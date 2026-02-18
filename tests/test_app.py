import pytest
from app.modules.rule_engine import rule_engine
from app.modules.splitter import split_text
from app.api.routes import router
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_sentiment_analysis():
    assert rule_engine.analyze_sentiment("I love this!") > 0
    assert rule_engine.analyze_sentiment("I hate this.") < 0
    assert rule_engine.analyze_sentiment("It is okay.") == 0

def test_pattern_detection():
    text = "Contact me at test@example.com or 123-456-7890"
    patterns = rule_engine.detect_patterns(text)
    assert "email" in patterns
    assert "phone" in patterns
    assert patterns["email"][0] == "test@example.com"

def test_text_splitter():
    text = "Hello world. This is a test."
    chunks = list(split_text(text, chunk_size=10))
    assert len(chunks) > 1

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
