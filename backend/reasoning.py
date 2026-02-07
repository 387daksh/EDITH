from backend.vector_store import query_documents
import os
from groq import Groq

# Initialize Groq Client
# Ensure GROQ_API_KEY is in os.environ
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

SYSTEM_PROMPT = """You are EDITH, a strict and precise technical assistant.
Your goal is to help developers understand large codebases.

PRINCIPLES:
1. Answer accuracy > features.
2. Context > visualization.
3. Refuse cleanly > hallucinate. If you don't know, say "I don't have enough context."
4. Be concise and direct.

Instructions:
- Answer the user's QUESTION based ONLY on the provided CONTEXT.
- Cite file paths if relevant.

CONTEXT:
{context}

QUESTION:
{question}
"""

def answer_question(question: str) -> str:
    """
    Retrieves context for the question and generates an answer using Groq.
    """
    # 1. Retrieve relevant documents
    # Uses local embeddings via vector_store
    results = query_documents(question, n_results=25) 
    
    # 2. Format context
    context_parts = []
    if results['documents'] and results['documents'][0]:
        for i, doc in enumerate(results['documents'][0]):
            meta = results['metadatas'][0][i] if results['metadatas'] else {}
            source = meta.get('source', 'unknown')
            
            # Skip binary-like or irrelevant files even if retrieved
            if any(x in source.lower() for x in ['.png', '.svg', '.ai', '.lock', 'license', 'test', 'tests']):
                continue
                
            context_parts.append(f"--- FILE: {source} ---\n{doc}\n")
            
    context_str = "\n".join(context_parts)
    
    if not context_str:
        return "I could not find any relevant code in the ingested repository to answer your question."

    # 3. Call Groq LLM
    full_prompt = SYSTEM_PROMPT.format(context=context_str, question=question)
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": full_prompt,
                }
            ],
            model="llama-3.3-70b-versatile", # Updated to latest stable
            temperature=0, # Deterministic answers
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        return f"Error calling Groq: {str(e)}"
