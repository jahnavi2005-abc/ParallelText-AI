from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks, Response
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.db.session import get_db
from app.db.repository import TextRepository
from app.services.processing_service import processing_service
from app.services.csv_service import csv_service
from app.services.email_service import email_service
from app.core.config import settings

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "ok"}

@router.post("/process-text")
async def process_text(
    content: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Process a single text input.
    """
    if not content:
        raise HTTPException(status_code=400, detail="Content cannot be empty")

    # Process text
    result = await processing_service.process_text(content)
    
    # Save to DB
    repo = TextRepository(db)
    record = await repo.create_record(
        content=content, 
        sentiment_score=result["sentiment_score"], 
        detected_patterns=result["detected_patterns"]
    )
    
    return {
        "id": record.id,
        "sentiment_score": record.sentiment_score,
        "detected_patterns": record.detected_patterns,
        "chunk_count": result["chunk_count"]
    }

@router.post("/process-csv")
async def process_csv(
    file: UploadFile = File(...),
):
    """
    Upload and process a CSV file. Returns a CSV with results.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")
        
    content = await file.read()
    try:
        csv_result = await csv_service.process_csv_upload(content)
        csv_result = await csv_service.process_csv_upload(content)
        return Response(
            content=csv_result, 
            media_type="text/csv", 
            headers={"Content-Disposition": f"attachment; filename=processed_{file.filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search")
async def search_texts(
    q: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Search processed texts by keyword.
    """
    repo = TextRepository(db)
    results = await repo.search_records(q)
    return results

@router.post("/send-email-summary")
async def send_email_summary(
    email: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Trigger an email summary of processed data.
    """
    repo = TextRepository(db)
    records = await repo.get_all_records(limit=1000)
    
    total = len(records)
    avg_sentiment = sum(r.sentiment_score for r in records) / total if total > 0 else 0
    
    stats = {
        "total": total,
        "avg_sentiment": avg_sentiment
    }
    
    background_tasks.add_task(email_service.send_summary, email, stats)
    return {"message": "Email sending queued"}
