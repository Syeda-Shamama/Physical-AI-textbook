from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer
from groq import Groq
from app.core.config import settings
from typing import Optional
import uuid
import os
import re

COLLECTION_NAME = "textbook"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
VECTOR_SIZE = 384
QDRANT_PATH = "./qdrant_data"  # persistent local storage

_embedder: Optional[SentenceTransformer] = None
_qdrant: Optional[QdrantClient] = None
_groq: Optional[Groq] = None


def get_embedder() -> SentenceTransformer:
    global _embedder
    if _embedder is None:
        _embedder = SentenceTransformer(EMBEDDING_MODEL)
    return _embedder


def get_qdrant() -> QdrantClient:
    global _qdrant
    if _qdrant is None:
        api_key = settings.qdrant_api_key.strip()
        is_local_default = settings.qdrant_url == "http://localhost:6333"

        if is_local_default and not api_key:
            # Persistent file-based Qdrant — data survives restarts
            _qdrant = QdrantClient(path=QDRANT_PATH)
        else:
            kwargs = {"url": settings.qdrant_url}
            if api_key:
                kwargs["api_key"] = api_key
            _qdrant = QdrantClient(**kwargs)

        existing = [c.name for c in _qdrant.get_collections().collections]
        if COLLECTION_NAME not in existing:
            _qdrant.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
            )
    return _qdrant


def get_groq() -> Groq:
    global _groq
    if _groq is None:
        _groq = Groq(api_key=settings.groq_api_key)
    return _groq


def ingest_chunk(text: str, metadata: dict) -> str:
    embedder = get_embedder()
    qdrant = get_qdrant()
    vector = embedder.encode(text).tolist()
    point_id = str(uuid.uuid4())
    qdrant.upsert(
        collection_name=COLLECTION_NAME,
        points=[PointStruct(id=point_id, vector=vector, payload={"text": text, **metadata})],
    )
    return point_id


def search(query: str, top_k: int = 5) -> list[dict]:
    embedder = get_embedder()
    qdrant = get_qdrant()
    vector = embedder.encode(query).tolist()
    results = qdrant.query_points(
        collection_name=COLLECTION_NAME,
        query=vector,
        limit=top_k,
    ).points
    return [{"text": r.payload["text"], "score": r.score, **r.payload} for r in results]


def answer(question: str, context_chunks: list[dict], user_background: str = "") -> str:
    groq = get_groq()
    personalization = f"\nUser background: {user_background}" if user_background else ""

    if context_chunks:
        context = "\n\n".join(c["text"] for c in context_chunks)
        user_msg = f"Context:\n{context}\n\nQuestion: {question}"
        system_msg = (
            "You are a helpful tutor for a Physical AI & Humanoid Robotics textbook. "
            "Answer based on the provided context. Be concise and clear."
            + personalization
        )
    else:
        user_msg = question
        system_msg = (
            "You are a helpful tutor for a Physical AI & Humanoid Robotics textbook "
            "covering ROS 2, Gazebo, NVIDIA Isaac, and Vision-Language-Action systems. "
            "Answer the question using your knowledge of these topics."
            + personalization
        )

    response = groq.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ],
        max_tokens=1024,
    )
    return response.choices[0].message.content


def _chunk_markdown(text: str, chunk_size: int = 500) -> list[str]:
    """Split markdown into chunks by heading or ~500 chars."""
    # Split on headings
    sections = re.split(r'\n(?=#{1,3} )', text)
    chunks = []
    for section in sections:
        section = section.strip()
        if not section:
            continue
        # If section is too long, split further
        if len(section) > chunk_size:
            words = section.split()
            current = []
            for word in words:
                current.append(word)
                if len(' '.join(current)) >= chunk_size:
                    chunks.append(' '.join(current))
                    current = []
            if current:
                chunks.append(' '.join(current))
        else:
            chunks.append(section)
    return chunks


def ingest_all_docs(docs_path: str) -> int:
    """Walk docs/ folder, ingest all markdown files. Returns total chunks ingested."""
    total = 0
    for root, _, files in os.walk(docs_path):
        for fname in files:
            if not fname.endswith('.md'):
                continue
            fpath = os.path.join(root, fname)
            with open(fpath, encoding='utf-8') as f:
                content = f.read()

            # Extract module name from path
            parts = fpath.replace('\\', '/').split('/')
            module = next((p for p in parts if p.startswith('module')), 'general')
            chapter = fname.replace('.md', '')

            chunks = _chunk_markdown(content)
            for chunk in chunks:
                if len(chunk.strip()) > 50:  # skip tiny chunks
                    ingest_chunk(chunk, {"chapter": chapter, "module": module, "source": fname})
                    total += 1
    return total


def collection_count() -> int:
    """Return number of vectors currently in the collection."""
    qdrant = get_qdrant()
    info = qdrant.get_collection(COLLECTION_NAME)
    return info.points_count or 0
