# 🚀 ParallelText AI

A highly optimized, production-ready system designed to handle large text datasets seamlessly. This project leverages Python's multiprocessing capabilities for parallel execution, a robust rule-based scoring engine for sentiment analysis and pattern recognition, and an aggressively optimized asynchronous database for rapid retrieval.

The frontend is a beautifully designed, premium React application featuring glassmorphism elements, dynamic transitions with Framer Motion, and visual analytics using Recharts.

---

## ✨ Key Features

### 1. High-Performance Text Processing
- **Advanced Chunking**: Breaks down massive text sets into manageable chunks aggressively.
- **Multiprocessing Groups**: Dispatches text chunks across multiple CPU cores simultaneously using `ProcessPoolExecutor`, guaranteeing zero server blocking during heavy IO/CPU loads.

### 2. Intelligent Rule Checker and Scorer
- **Parallel Sentiment Scoring**: Processes text chunks concurrently to determine nuanced sentiment scores ranging from `-1.0` (negative) to `1.0` (positive) using rule-based dictionaries.
- **Regex Pattern Detection**: Instantly identifies and extracts critical entities like emails, phone numbers, and dates (YYYY-MM-DD).
- **Async DB Persistence**: Automatically saves aggregated results to an SQLite database via SQLAlchemy's async engine.

### 3. Batch CSV Orchestration
- **Drag-and-Drop Processing**: Upload enormous CSV datasets through a modern interface. The system dynamically locates text columns, processes rows efficiently, and returns a scored, downloadable CSV.
- **Email Summaries**: Generates comprehensive processing reports and fires them off via SMTP email services upon completion.

### 4. Advanced Storage & Search
- **Indexed Database Architecture**: Employs rapid indexing on `sentiment_score` and `created_at` fields, allowing instantaneous search query results across thousands of records.
- **Search DB Dashboard**: An elegant paginated view in the frontend to search historical records by keyword.

### 5. Premium UI Experience
- **Modern Dashboard**: Built with React (v19), Vite, and TailwindCSS, boasting a sleek dark theme.
- **Animated Interactions**: Utilizes `framer-motion` for fluid page transitions.
- **Visual Analytics**: Real-time gauge charts (`recharts`) and entity metadata cards.

---

## 🏗️ Technology Stack

### **Backend (The "Brain")**
- **Language**: Python 3.11+
- **Framework**: FastAPI (High-performance async web framework)
- **Database**: SQLite via SQLAlchemy (async mode with `aiosqlite`)
- **Concurrency**: AsyncIO for I/O operations, Multiprocessing (`ProcessPoolExecutor`) for CPU-bound tasks

### **Frontend (The "Face")**
- **Framework**: React (v19)
- **Build Tool**: Vite
- **Styling**: TailwindCSS + PostCSS
- **State & Networking**: Axios
- **Enhancements**: Framer Motion, Recharts, Lucide React

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

---

## ⚙️ Setup Instructions

### 1. Database & Environment Preparation
1. Clone the repository.
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   *(Update SMTP configurations if you wish to use the Email Summary feature).*

### 2. Run the Backend (FastAPI + Multiprocessing)
Install Python dependencies and start the backend service:
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```
> **Troubleshooting Port 8000 (`[WinError 10013]`):**
> If you encounter `An attempt was made to access a socket in a way forbidden by its access permissions`, it means port 8000 is already in use by another application. You can specify a different port:
> ```bash
> uvicorn app.main:app --port 8080 --reload
> ```
> *(Note: If you change the backend port, ensure you update the `API_URL` inside `frontend/src/App.jsx` to match!)*

Once running, interactive API docs are available at `http://localhost:8000/docs`.

### 3. Run the Frontend (React + Vite)
In a separate terminal, navigate to the `frontend` directory, install the required packages (including the UI libraries), and spin up the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## 🐳 Docker Deployment
To run the entire processor stack in containers seamlessly:
```bash
docker-compose up --build
```
