import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Parallel Text Processor"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite+aiosqlite:///./test.db"
    
    # Email
    SMTP_TLS: bool = True
    SMTP_PORT: int = 587
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_USER: str = "your-email@example.com"
    SMTP_PASSWORD: str = "your-password"
    EMAILS_FROM_EMAIL: str = "your-email@example.com"
    EMAILS_FROM_NAME: str = "Parallel Processor"
    
    # Worker
    MAX_WORKERS: int = 4

    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True)

settings = Settings()
