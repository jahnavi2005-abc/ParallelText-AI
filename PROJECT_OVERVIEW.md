# Project Overview: ParallelText AI

## 🚀 Introduction
**ParallelText AI** is a high-performance text processing system designed to handle large datasets efficiently. It leverages parallel processing to ensure responsiveness even under heavy loads. The system allows users to upload text or CSV files, analyzes them for sentiment and patterns (e.g., emails, phone numbers), and allows for storing and searching the results.

## 🏗️ Technology Stack

### **Backend (The "Brain")**
*   **Language:** Python 3.11+
*   **Framework:** **FastAPI** (High-performance async web framework).
*   **Database:** **SQLite (Async)** via **SQLAlchemy**. Optimized for local development with async support.
*   **Concurrency Model:**
    *   **AsyncIO**: Handles I/O-bound operations (database queries, API requests) efficiently.
    *   **Multiprocessing**: Uses `ProcessPoolExecutor` to distribute CPU-intensive text analysis across multiple cores, preventing server blocking.

### **Frontend (The "Face")**
*   **Framework:** **React (v19)**
*   **Build Tool:** **Vite** (Next-generation frontend tooling).
*   **Styling:** **TailwindCSS** (Utility-first CSS) + **PostCSS**.
*   **State & Networking:** Axios for API communication.

---

## ⚙️ Core Architecture & Flow Service

### 1. The Processing Core (`app/services/processing_service.py`)
This service orchestrates the analysis.
*   **Splitting**: Incoming text is broken down into manageable "chunks" by `app.modules.splitter`.
*   **Parallel Execution**: Chunks are dispatched to a **Process Pool**. Each chunk is analyzed independently on a separate CPU core.
*   **Aggregation**: Results (sentiment scores, detected patterns) are gathered and merged.
    *   **Sentiment**: Scores are averaged across chunks.
    *   **Patterns**: Lists of emails/dates are combined and deduplicated.

### 2. Logic Modules (`app/modules/`)
*   **`rule_engine.py`**:
    *   **Sentiment Analysis**: Dictionary-based approach. Checks words against "positive" and "negative" lists to calculate a score (-1.0 to 1.0).
    *   **Pattern Detection**: Uses compiled **Regex** to identify entities like Emails, Dates (YYYY-MM-DD), and Phone Numbers.
*   **`loader.py`**: Utilities for efficient data loading.

### 3. API & Data Handling (`app/api/routes.py`)
*   **POST `/process-text`**:
    *   Accepts raw text.
    *   Invokes `ProcessingService`.
    *   Persists results (Content, Score, Patterns) to **SQLite**.
*   **POST `/process-csv`**:
    *   Accepts CSV uploads.
    *   Processes rows efficiently.
    *   Returns a downloadable CSV with added analysis columns.
*   **GET `/search`**: Queries the database for previously processed texts based on keywords.

---

## 📂 Directory Structure

```text
c:\ParallelText AI\
├── app\
│   ├── main.py                 # Application Entry Point (Lifespan resource management)
│   ├── api\routes.py           # API Route Definitions
│   ├── core\config.py          # Configuration (Environment variables, Worker settings)
│   ├── db\models.py            # SQLAlchemy Database Models
│   ├── modules\                # Reusable Logic Components
│   │   ├── rule_engine.py      # Sentiment & Regex logic
│   │   └── splitter.py         # Text chunking logic
│   └── services\
│       └── processing_service.py # Parallel processing orchestration
├── frontend\
│   ├── src\                    # React Components and Logic
│   ├── package.json            # Frontend Dependencies
│   └── vite.config.js          # Vite Configuration
└── requirements.txt            # Python Dependencies
```

## 🏃 Running Instructions

### Backend
1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```
2. **Run Server**
   ```bash
   uvicorn app.main:app --reload
   ```
   (Starts API at `http://localhost:8000`)

### Frontend
1. **Start Development Server**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   (Starts UI at `http://localhost:5173`)
