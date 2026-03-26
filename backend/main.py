from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.api.routes import auth, chat, ingest
from app.services.rag import ingest_all_docs, collection_count
import os
import logging

logger = logging.getLogger(__name__)

DOCS_PATH = os.path.join(os.path.dirname(__file__), "..", "book", "docs")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ingest textbook if Qdrant is empty
    count = collection_count()
    if count == 0:
        docs_abs = os.path.abspath(DOCS_PATH)
        if os.path.exists(docs_abs):
            logger.info(f"Ingesting textbook from {docs_abs} ...")
            total = ingest_all_docs(docs_abs)
            logger.info(f"Ingested {total} chunks into Qdrant.")
        else:
            logger.warning(f"Docs path not found: {docs_abs}")
    else:
        logger.info(f"Qdrant already has {count} chunks — skipping ingest.")
    yield


app = FastAPI(
    title="Physical AI Textbook API",
    description="RAG Chatbot + Auth for Physical AI & Humanoid Robotics Textbook",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(ingest.router)


@app.get("/")
def root():
    count = collection_count()
    return {"status": "ok", "chunks_in_db": count}
