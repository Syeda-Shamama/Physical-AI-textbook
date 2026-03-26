from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rag import ingest_chunk

router = APIRouter(prefix="/ingest", tags=["ingest"])


class IngestRequest(BaseModel):
    text: str
    chapter: str = ""
    module: str = ""


@router.post("/")
async def ingest(req: IngestRequest):
    point_id = ingest_chunk(req.text, {"chapter": req.chapter, "module": req.module})
    return {"status": "ok", "id": point_id}
