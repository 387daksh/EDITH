from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.ingestion import clone_repo, process_repo

app = FastAPI(title="EDITH Backend")

class IngestRequest(BaseModel):
    repo_url: str

@app.get("/")
def read_root():
    return {"status": "EDITH is online"}

@app.post("/ingest")
def ingest_repo(request: IngestRequest):
    try:
        repo_path = clone_repo(request.repo_url)
        documents = process_repo(repo_path)
        
        # Store in Vector Store
        from backend.vector_store import add_documents
        add_documents(documents)
        
        return {
            "status": "success",
            "message": f"Ingested {len(documents)} chunks from {request.repo_url}",
            "chunks_count": len(documents)
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

class QueryRequest(BaseModel):
    question: str

@app.post("/query")
def query_repo(request: QueryRequest):
    try:
        from backend.reasoning import answer_question
        answer = answer_question(request.question)
        return {"answer": answer}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
