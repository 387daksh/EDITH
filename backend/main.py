from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.ingestion import clone_repo, process_repo, DATA_DIR
from backend.graph import DependencyGraph
import os

app = FastAPI(title="EDITH Backend")

# Enable CORS for frontend
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class IngestRequest(BaseModel):
    repo_url: str
    force: bool = False  # Set to True to re-ingest

@app.get("/")
def read_root():
    return {"status": "EDITH is online"}

@app.get("/graph")
def get_graph():
    """Returns the dependency graph in Mermaid format."""
    graph_path = os.path.join(DATA_DIR, "dependency_graph.gml")
    dg = DependencyGraph()
    if os.path.exists(graph_path):
        dg.load(graph_path)
        return {"mermaid": dg.to_mermaid()}
    return {"mermaid": "graph TD; A[No Graph Found]"}

@app.get("/status")
def get_status():
    """Check if data has been ingested."""
    from backend.vector_store import get_collection
    try:
        collection = get_collection()
        count = collection.count()
        return {"ingested": count > 0, "chunks_count": count}
    except:
        return {"ingested": False, "chunks_count": 0}

@app.post("/ingest")
def ingest_repo(request: IngestRequest):
    try:
        # Check if already ingested (skip re-embedding)
        from backend.vector_store import get_collection, add_documents
        
        if not request.force:
            try:
                collection = get_collection()
                existing_count = collection.count()
                if existing_count > 0:
                    print(f"⏭️ Data already exists ({existing_count} chunks). Skipping re-ingestion.", flush=True)
                    print(f"   Use force=True to re-ingest.", flush=True)
                    return {
                        "status": "skipped",
                        "message": f"Already ingested ({existing_count} chunks). Use force=true to re-ingest.",
                        "chunks_count": existing_count
                    }
            except:
                pass  # Collection doesn't exist, proceed with ingestion
        
        repo_path = clone_repo(request.repo_url)
        documents = process_repo(repo_path)
        
        # Store in Vector Store
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


# -------------------- HR Domain Endpoints (added) --------------------
class HRUploadRequest(BaseModel):
    title: str
    content: str


@app.post("/upload-hr-doc")
def upload_hr_doc(request: HRUploadRequest):
    """Upload an HR document into the in-memory HR context store."""
    try:
        from backend.hr_context import add_hr_doc
        doc = add_hr_doc(request.title, request.content)
        return {"status": "success", "doc": doc}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


class HRAskRequest(BaseModel):
    question: str


@app.post("/ask-hr")
def ask_hr(request: HRAskRequest):
    """Ask an HR question. This endpoint is independent from code-domain logic.

    It uses a lightweight HR pipeline (intent detection + retrieval + LLM call)
    implemented in backend.hr_reasoning.
    """
    try:
        from backend.hr_reasoning import ask_hr as hr_ask
        result = hr_ask(request.question)
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/hr-docs")
def list_hr_docs():
    """Return all uploaded HR documents (for debugging/inspection)."""
    try:
        from backend.hr_context import list_hr_docs
        docs = list_hr_docs()
        # Do not return full content if very large; keep as-is for now
        return {"docs": docs}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

