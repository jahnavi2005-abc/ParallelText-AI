import pandas as pd
import io
from typing import BinaryIO
from app.services.processing_service import processing_service

class CSVService:
    async def process_csv_upload(self, file_content: bytes) -> tuple[str, dict, list]:
        """
        Reads CSV, processes a 'text' or 'content' column, and returns (CSV string, summary stats, records list).
        """
        df = pd.read_csv(io.BytesIO(file_content))
        
        # Identify text column
        text_col = None
        for col in ["text", "content", "body", "comment"]:
            if col in df.columns:
                text_col = col
                break
        
        if not text_col:
            # Fallback: use first string column
            for col in df.columns:
                if df[col].dtype == 'object':
                    text_col = col
                    break
        
        if not text_col:
            raise ValueError("No valid text column found in CSV")

        # Process rows
        results = []
        for text in df[text_col].fillna("").astype(str):
            result = await processing_service.process_text(text)
            results.append(result)
            
        # Add results to DataFrame
        df["Sentiment Score"] = [r["sentiment_score"] for r in results]
        
        # Flatten patterns into separate columns
        # distinct keys from RuleEngine are: email, date, phone
        # But we can also do it dynamically based on what's returned
        
        # Initialize columns for known patterns
        for key in ["email", "date", "phone", "url", "currency"]:
            col_name = f"Found {key.title()}s"
            values = []
            for r in results:
                items = r.get("detected_patterns", {}).get(key, [])
                values.append("; ".join(items) if items else "")
            df[col_name] = values
            
        # Add Keywords
        df["Top Keywords"] = [", ".join(r.get("keywords", [])) for r in results]

        csv_string = df.to_csv(index=False)
        
        # Calculate summary stats
        total_rows = len(results)
        avg_sentiment = sum(r["sentiment_score"] for r in results) / total_rows if total_rows > 0 else 0
        total_entities = sum(
            len(items) for r in results for items in r["detected_patterns"].values() if items
        )
        
        summary = {
            "total_rows": total_rows,
            "avg_sentiment": avg_sentiment,
            "total_entities": total_entities
        }
        
        # Convert df to records for frontend table
        records = df.fillna("").to_dict(orient="records")
        
        return csv_string, summary, records

csv_service = CSVService()
