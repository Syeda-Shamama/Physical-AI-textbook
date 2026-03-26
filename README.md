# Physical AI & Humanoid Robotics — AI-Native Textbook

 Hackathon I Submission

An AI-native textbook on **Physical AI & Humanoid Robotics** built with Docusaurus, featuring an integrated RAG chatbot, authentication, and content personalization.

## Live Demo

- **Book**: [GitHub Pages URL] *(after deployment)*
- **Backend**: [Render/Railway URL] *(after deployment)*

## Features

| Feature | Status |
|---------|--------|
| Textbook — 4 Modules, 13 Chapters | ✅ |
| RAG Chatbot (ask questions about the book) | ✅ |
| Ask about selected text | ✅ |
| Signup / Login with background questions | ✅ |
| Personalized answers based on user background | ✅ |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend / Book | Docusaurus (React + TypeScript) |
| Backend | FastAPI (Python) |
| LLM | Groq — `llama-3.1-8b-instant` (free) |
| Embeddings | `sentence-transformers/all-MiniLM-L6-v2` (local, free) |
| Vector DB | Qdrant (local persistent) |
| Database | Neon Serverless PostgreSQL |
| Speech-to-Text | OpenAI Whisper (local, free) |

## Project Structure

```
hackathon1/
├── book/                      # Docusaurus frontend + textbook
│   ├── docs/                  # Textbook content (Markdown)
│   │   ├── intro.md
│   │   ├── module1/           # ROS 2 — The Robotic Nervous System
│   │   ├── module2/           # Gazebo & Unity — The Digital Twin
│   │   ├── module3/           # NVIDIA Isaac — The AI-Robot Brain
│   │   └── module4/           # Vision-Language-Action (VLA)
│   └── src/
│       ├── components/Chatbot/        # Floating AI chatbot widget
│       ├── components/ChapterTools/   # Urdu + Personalize buttons
│       └── pages/                     # Signup / Login pages
└── backend/                   # FastAPI server
    ├── app/
    │   ├── api/routes/        # auth, chat, ingest endpoints
    │   ├── services/rag.py    # RAG pipeline (embed + search + LLM)
    │   └── models/user.py     # Neon DB user model
    └── main.py                # Auto-ingests textbook on startup
```

## Course Modules

- **Module 1: ROS 2** — Nodes, Topics, Services, rclpy, URDF
- **Module 2: Gazebo & Unity** — Physics simulation, sensors (LiDAR, Depth Camera, IMU)
- **Module 3: NVIDIA Isaac** — Isaac Sim, VSLAM, Nav2 bipedal navigation
- **Module 4: VLA** — Whisper STT, LLM cognitive planning, Autonomous Humanoid capstone

## Local Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # fill in your keys
uvicorn main:app --reload
# Backend runs at http://localhost:8000
# Auto-ingests all textbook chapters into Qdrant on first startup
```

### Frontend
```bash
cd book
npm install
npm start
# Book runs at http://localhost:3000/hackathon1/
```

## Environment Variables

```env
GROQ_API_KEY=        # https://console.groq.com (free)
DATABASE_URL=        # https://neon.tech (free tier)
SECRET_KEY=          # random string for JWT
QDRANT_URL=          # leave default for local persistent mode
```

## Built With

- [Claude Code](https://www.claude.com/product/claude-code) — AI-assisted development
- [Docusaurus](https://docusaurus.io/) — Book framework
- [FastAPI](https://fastapi.tiangolo.com/) — Backend API
- [Groq](https://console.groq.com/) — Free LLM API
- [Neon](https://neon.tech/) — Serverless PostgreSQL
- [Qdrant](https://qdrant.tech/) — Vector database
