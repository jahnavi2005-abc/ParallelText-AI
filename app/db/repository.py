from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import TextRecord

class TextRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_record(self, content: str, sentiment_score: float, detected_patterns: dict) -> TextRecord:
        record = TextRecord(
            content=content,
            sentiment_score=sentiment_score,
            detected_patterns=detected_patterns
        )
        self.session.add(record)
        await self.session.commit()
        await self.session.refresh(record)
        return record

    async def get_all_records(self, limit: int = 100, offset: int = 0):
        result = await self.session.execute(select(TextRecord).offset(offset).limit(limit))
        return result.scalars().all()

    async def search_records(self, keyword: str):
        # Basic LIKE search
        result = await self.session.execute(select(TextRecord).filter(TextRecord.content.ilike(f"%{keyword}%")))
        return result.scalars().all()
