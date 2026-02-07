import os
import shutil
import git
from typing import List, Dict, Any
from langchain_text_splitters import RecursiveCharacterTextSplitter

REPO_DIR = "data/repos"

def clone_repo(repo_url: str) -> str:
    """
    Clones a GitHub repository to the local data directory.
    Returns the path to the cloned repository.
    """
    if not os.path.exists(REPO_DIR):
        os.makedirs(REPO_DIR)
    
    repo_name = repo_url.rstrip("/").split("/")[-1].replace(".git", "")
    local_path = os.path.join(REPO_DIR, repo_name)
    
    if os.path.exists(local_path):
        # fast path: if repo exists, we might want to pull, but for hackathon demo, 
        # let's just use what's there or wipe and re-clone if requested.
        # For now, simplistic approach: remove and re-clone to ensure fresh state.
        try:
            shutil.rmtree(local_path)
        except PermissionError:
            # On Windows, sometimes files are locked.
            pass
            
    if not os.path.exists(local_path):
        git.Repo.clone_from(repo_url, local_path)
    
    return local_path

def process_repo(repo_path: str) -> List[Dict[str, Any]]:
    """
    Walks the repository, reads text files, and chunks them.
    Returns a list of documents (chunks) with metadata.
    """
    documents = []
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        is_separator_regex=False,
    )

    # Exclude common binary/generated files/directories
    exclude_dirs = {'.git', 'venv', '__pycache__', 'node_modules', '.idea', '.vscode', 'dist', 'build'}
    exclude_exts = {'.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.exe', '.bin', '.pyc', '.whl', '.zip', '.tar', '.gz'}

    for root, dirs, files in os.walk(repo_path):
        # modify dirs in-place to skip excluded
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in exclude_exts:
                continue
                
            file_path = os.path.join(root, file)
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    
                # Skip empty files
                if not content.strip():
                    continue

                chunks = text_splitter.split_text(content)
                rel_path = os.path.relpath(file_path, repo_path)
                
                for i, chunk in enumerate(chunks):
                    documents.append({
                        "id": f"{rel_path}:{i}",
                        "content": chunk,
                        "metadata": {
                            "source": rel_path,
                            "chunk_index": i
                        }
                    })
            except Exception as e:
                # Log error but continue
                print(f"Error reading {file_path}: {e}")
                
    return documents
