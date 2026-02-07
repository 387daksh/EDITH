# EDITH: Persistent Organizational AI

EDITH is a hackathon project designed to help developers understand large codebases through RAG (Retrieval-Augmented Generation).

## Team Sync Strategy

**Documentation as Code**: `task.md` and `implementation_plan.md` in the root are the source of truth. All AI agents must read these first.

## Setup

1. **Prerequisites**: Python 3.9+, Git.
2. **Install Dependencies**:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. **Environment Variables**:
   Create a `.env` file in the root with:
   ```
   OPENAI_API_KEY=sk-...
   ```
   (If you don't have a key, it will default to local embeddings but reasoning requires an LLM).

## Running

1. **Start Backend**:
   ```bash
   venv\Scripts\uvicorn backend.main:app --reload
   ```
2. **Open Frontend**:
   Open `frontend/index.html` in your browser.

## Architecture

- **Ingestion**: git extraction -> chunking -> ChromaDB
- **Reasoning**: ChromaDB context -> OpenAI GPT-4o-mini -> Answer
- **Principles**: Accuracy > Features.

## Limitations (Hackathon Scope)

- No specialized handling for binary files.
- Single-turn Q&A (no chat memory yet).
- Re-ingesting wipes the previous repo data.
