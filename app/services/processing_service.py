import asyncio
from concurrent.futures import ProcessPoolExecutor
from typing import List, Dict, Any

from app.core.config import settings
from app.modules.rule_engine import rule_engine
from app.modules.splitter import split_text
from app.modules.scorer import aggregate_sentiment, merge_patterns

# Helper function must be top-level for pickling in multiprocessing
def analyze_chunk(chunk: str) -> Dict[str, Any]:
    sentiment = rule_engine.analyze_sentiment(chunk)
    patterns = rule_engine.detect_patterns(chunk)
    return {"sentiment": sentiment, "patterns": patterns}

class ProcessingService:
    def __init__(self):
        self.executor = ProcessPoolExecutor(max_workers=settings.MAX_WORKERS)

    async def process_text(self, text: str) -> Dict[str, Any]:
        loop = asyncio.get_running_loop()
        chunks = list(split_text(text))
        
        if not chunks:
            return {
                "sentiment_score": 0.0,
                "detected_patterns": {},
                "chunk_count": 0
            }

        # Run analysis in parallel
        # We use loop.run_in_executor to offload the CPU-bound tasks
        tasks = [
            loop.run_in_executor(self.executor, analyze_chunk, chunk)
            for chunk in chunks
        ]
        
        results = await asyncio.gather(*tasks)
        
        # Aggregate results
        sentiments = [r["sentiment"] for r in results]
        patterns_list = [r["patterns"] for r in results]
        
        final_score = aggregate_sentiment(sentiments)
        final_patterns = merge_patterns(patterns_list)
        
        return {
            "sentiment_score": final_score,
            "detected_patterns": final_patterns,
            "chunk_count": len(chunks)
        }

    def shutdown(self):
        self.executor.shutdown()

processing_service = ProcessingService()
