from backend.vector_store import query_documents
from backend.snowflake_utils import run_query
import json

SYSTEM_PROMPT = """You are EDITH, a strict and precise technical assistant for a one-day hackathon project.
Your goal is to help developers understand large codebases.

PRINCIPLES:
1. Answer accuracy > features.
2. Context > visualization.
3. Refuse cleanly > hallucinate. If you don't know, say "I don't have enough context in the provided files to answer that."
4. Be concise and direct.

Instructions:
- You will be provided with CONTEXT which allows you to see parts of the codebase.
- Answer the user's QUESTION based ONLY on the provided CONTEXT.
- If the CONTEXT is insufficient, state exactly what is missing or say you don't know.
- Cite the file paths in your answer if relevant (e.g., "In `backend/main.py`, ...").

CONTEXT:
{context}

QUESTION:
{question}
"""

def answer_question(question: str) -> str:
    """
    Retrieves context for the question and generates an answer using Snowflake Cortex LLM.
    """
    # 1. Retrieve relevant documents
    # Note: query_documents will now use the SnowflakeEmbeddingFunction we hooked up
    results = query_documents(question, n_results=10) 
    
    # 2. Format context
    context_parts = []
    if results['documents'] and results['documents'][0]:
        for i, doc in enumerate(results['documents'][0]):
            meta = results['metadatas'][0][i] if results['metadatas'] else {}
            source = meta.get('source', 'unknown')
            context_parts.append(f"--- SOURCE: {source} ---\n{doc}\n")
            
    context_str = "\n".join(context_parts)
    
    if not context_str:
        return "I could not find any relevant code in the ingested repository to answer your question."

    # 3. Call Snowflake Cortex LLM
    # We construct the full prompt and send it to Cortex 'llama3-70b' (or similar supported model)
    full_prompt = SYSTEM_PROMPT.format(context=context_str, question=question)
    
    # Escape single quotes for SQL
    safe_prompt = full_prompt.replace("'", "''")
    query = f"SELECT SNOWFLAKE.CORTEX.COMPLETE('llama3-70b', '{safe_prompt}') as response"
    
    try:
        result = run_query(query)
        if result and result[0]['response']:
            return result[0]['response']
        else:
            return "Snowflake Cortex returned an empty response."
    except Exception as e:
        return f"Error calling Snowflake Cortex: {str(e)}"
