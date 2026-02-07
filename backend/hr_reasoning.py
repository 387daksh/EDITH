"""
HR reasoning module.

This module performs intent detection (keyword-based), retrieves HR
context from `hr_context`, and calls the LLM (Groq) to produce a grounded
answer. It enforces that answers are based on uploaded HR documents and
returns a structured response.
"""
import os
from typing import List, Dict, Any
from backend import hr_context

try:
    from groq import Groq
    _GROQ_AVAILABLE = True
except Exception:
    _GROQ_AVAILABLE = False

# Initialize Groq client if possible. Keep errors local so module import
# doesn't fail if Groq isn't installed during tests.
_groq_client = None
if _GROQ_AVAILABLE:
    try:
        _groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    except Exception:
        _groq_client = None


HR_SYSTEM_PROMPT = """You are EDITH-HR, a precise HR assistant. Only answer using
the provided HR CONTEXT. Do NOT hallucinate or guess. If the information
is missing from the provided CONTEXT, say: "not enough HR information uploaded yet".

Be concise and cite the source titles from the CONTEXT when relevant.

CONTEXT:
{context}

QUESTION:
{question}
"""


def classify_intent(question: str) -> str:
    """Simple keyword-based intent classification for HR domain.

    Returns one of: 'policy', 'payroll', 'leave', 'hiring', 'culture', 'sop', 'other'
    """
    q = question.lower()
    if any(w in q for w in ["policy", "policies", "policy" , "handbook", "rules"]):
        return "policy"
    if any(w in q for w in ["salary", "payroll", "compensation", "pay"]):
        return "payroll"
    if any(w in q for w in ["leave", "vacation", "pto", "time off", "sick"]):
        return "leave"
    if any(w in q for w in ["hire", "hiring", "recruit", "onboard", "interview"]):
        return "hiring"
    if any(w in q for w in ["culture", "values", "behavior", "ethic", "diversity"]):
        return "culture"
    if any(w in q for w in ["sop", "procedure", "process", "how to", "steps"]):
        return "sop"
    return "other"


def _build_context_text(docs: List[Dict[str, Any]]) -> str:
    parts = []
    for d in docs:
        title = d.get("title", "Untitled")
        content = d.get("content", "")
        parts.append(f"--- SOURCE: {title} ---\n{content}\n")
    return "\n".join(parts)


def ask_hr(question: str, top_k: int = 3) -> Dict[str, Any]:
    """
    Main entry for HR reasoning.

    Steps:
      1. Classify intent (best-effort).
      2. Retrieve top-k HR docs from hr_context.
      3. If no useful context, return a refusal indicating not enough info.
      4. Otherwise, call LLM (Groq) with grounded prompt and return structured answer.

    Returns: {answer, sources: [titles], confidence}
    """
    if not question or not question.strip():
        return {"answer": "Please provide a question.", "sources": [], "confidence": "low"}

    intent = classify_intent(question)

    # Retrieve top-k documents
    docs = hr_context.retrieve_top_k(question, k=top_k)

    if not docs or len(docs) == 0:
        # No helpful HR context available
        return {
            "answer": "not enough HR information uploaded yet",
            "sources": [],
            "confidence": "low",
        }

    context_text = _build_context_text(docs)

    # Grounded prompt
    prompt = HR_SYSTEM_PROMPT.format(context=context_text, question=question)

    # If Groq client is available, call it. Otherwise, fail gracefully with a helpful message.
    if _groq_client is None:
        # For environments without Groq configured, return a simple best-effort answer
        # by echoing relevant lines from the top docs. This avoids hallucination.
        snippet = docs[0].get("content", "")[:800]
        answer = f"Based on the uploaded HR docs (see sources), here is an excerpt:\n\n{snippet}"
        sources = [d.get("title", "Untitled") for d in docs]
        return {"answer": answer, "sources": sources, "confidence": "medium"}

    try:
        chat_completion = _groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-70b-8192",
            temperature=0,
        )
        content = chat_completion.choices[0].message.content
        sources = [d.get("title", "Untitled") for d in docs]
        # Heuristic confidence: if docs found, high
        return {"answer": content, "sources": sources, "confidence": "high"}
    except Exception as e:
        return {"answer": f"Error calling LLM: {str(e)}", "sources": [d.get("title", "Untitled") for d in docs], "confidence": "low"}
