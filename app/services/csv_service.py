import pandas as pd
import io
from typing import BinaryIO
from app.services.processing_service import processing_service

class CSVService:
    async def process_csv_upload(self, file_content: bytes) -> str:
        """
        Reads CSV, processes a 'text' or 'content' column, and returns CSV string.
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
        for key in ["email", "date", "phone"]:
            col_name = f"Found {key.title()}s"
            values = []
            for r in results:
                items = r["detected_patterns"].get(key, [])
                values.append("; ".join(items) if items else "")
            df[col_name] = values

        return df.to_csv(index=False)

csv_service = CSVService()
