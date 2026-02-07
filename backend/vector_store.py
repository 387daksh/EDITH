import os
import chromadb
from chromadb.utils import embedding_functions
from typing import List, Dict, Any

# Use persistent client
CHROMA_DATA_PATH = "data/chroma_db"

def get_db_client():
    return chromadb.PersistentClient(path=CHROMA_DATA_PATH)

def get_collection():
    client = get_db_client()
    
    # Use Default Embedding Function (Sentence Transformers / all-MiniLM-L6-v2)
    # This comes built-in with chromadb if sentence-transformers is installed.
    print("Loading embedding model (this may take time on first run)...", flush=True)
    emb_fn = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
        
    return client.get_or_create_collection(
        name="edith_context_groq", # New collection for Groq/Local embeddings
        embedding_function=emb_fn
    )

def add_documents(documents: List[Dict[str, Any]]):
    """
    Adds a list of document chunks to the ChromaDB collection.
    """
    if not documents:
        return
        
    collection = get_collection()
    
    ids = [d["id"] for d in documents]
    documents_content = [d["content"] for d in documents]
    metadatas = [d["metadata"] for d in documents]
    
    # Process in batches
    batch_size = 166 
    total_added = 0
    
    for i in range(0, len(ids), batch_size):
        end_idx = min(i + batch_size, len(ids))
        collection.upsert(
            ids=ids[i:end_idx],
            documents=documents_content[i:end_idx],
            metadatas=metadatas[i:end_idx]
        )
        total_added += (end_idx - i)
        print(f"Added batch {i} to {end_idx} (Total: {total_added})")

def query_documents(query_text: str, n_results: int = 5) -> Dict[str, Any]:
    """
    Queries the collection for relevant documents.
    """
    collection = get_collection()
    results = collection.query(
        query_texts=[query_text],
        n_results=n_results
    )
    return results
