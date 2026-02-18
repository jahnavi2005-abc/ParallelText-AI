# Python Parallel Text Handling Processor

A production-ready system for handling large text datasets with parallel processing, sentiment analysis, searchable storage, and email notifications.

## Features

*   **Parallel Processing**: Distributes text analysis across multiple CPU cores.
*   **Sentiment Analysis**: Dictionary-based scoring + regex pattern detection.
*   **Batch CSV Processing**: Upload large CSVs and download processed results.
*   **Search**: Query processed texts by keyword.
*   **Email Summaries**: Send reports via SMTP.
*   **Modern Frontend**: React + Vite dashboard.

## Tech Stack

*   **Backend**: Python 3.11, FastAPI, SQL Alchemy, Multiprocessing
*   **Frontend**: React, Vite, TailwindCSS
*   **Database**: SQLite (Async)

## Setup

1.  **Clone the repository**
2.  **Install Backend Dependencies**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Setup Environment**
    Copy `.env.example` to `.env` and configure your settings.
4.  **Run Backend**
    ```bash
    uvicorn app.main:app --reload
    ```
5.  **Run Frontend (Dev)**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## API Documentation

Once running, visit `http://localhost:8000/docs` for the interactive API documentation.

## Docker

Run the entire stack with:
```bash
docker-compose up --build
```
