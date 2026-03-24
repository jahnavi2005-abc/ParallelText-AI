import requests

try:
    resp = requests.post(
        "http://127.0.0.1:8000/api/v1/process-text",
        params={"content": "Hello world. My email is test@example.com and this is a great day for $100. Check out https://google.com."}
    )
    print(resp.json())
except Exception as e:
    print(f"Error: {e}")
