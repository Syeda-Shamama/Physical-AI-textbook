from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rag import search, answer

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    question: str
    selected_text: str = ""
    user_background: str = ""


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict]


@router.post("/", response_model=ChatResponse)
async def chat(req: ChatRequest):
    query = req.selected_text if req.selected_text else req.question
    chunks = search(query)
    # No 404 — answer with or without context
    reply = answer(req.question, chunks, req.user_background)
    sources = [{"text": c["text"][:200]} for c in chunks]
    return ChatResponse(answer=reply, sources=sources)
