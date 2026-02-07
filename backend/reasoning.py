from backend.vector_store import query_documents
import os
import re
from groq import Groq

# Lazy-loaded globals
_groq_client = None
_dep_graph = None

def get_groq_client():
    global _groq_client
    if _groq_client is None:
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable not set. Please add it to your .env file.")
        _groq_client = Groq(api_key=api_key)
    return _groq_client

def get_dep_graph():
    global _dep_graph
    if _dep_graph is None:
        from backend.graph import DependencyGraph
        _dep_graph = DependencyGraph()
        graph_path = "data/dependency_graph.gml"
        if os.path.exists(graph_path):
            _dep_graph.load(graph_path)
    return _dep_graph

# --- TOOLS ---
def search_code(query: str):
    """Semantic search for code snippets."""
    results = query_documents(query, n_results=8)
    output = []
    if results['documents'] and results['documents'][0]:
        for i, doc in enumerate(results['documents'][0]):
            meta = results['metadatas'][0][i]
            source = meta.get('source', 'unknown')
            # Show a preview, not entire chunk
            preview = doc[:500] + "..." if len(doc) > 500 else doc
            output.append(f"[{source}]\n{preview}\n")
    return "\n".join(output) if output else "No results found."

def read_file(file_path: str):
    """Reads a specific file from the repo."""
    # Search for the file in data/repos
    for root, dirs, files in os.walk("data/repos"):
        for file in files:
            full_path = os.path.join(root, file).replace("\\", "/")
            if file_path in full_path:
                try:
                    with open(os.path.join(root, file), 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    # Truncate if too long
                    if len(content) > 8000:
                        return content[:8000] + "\n\n...(file truncated, showing first 8000 chars)"
                    return content
                except Exception as e:
                    return f"Error reading file: {e}"
    return "File not found. Try using search_code to find the correct path."

def get_dependencies(file_path: str):
    """Returns files that this file imports."""
    deps = get_dep_graph().get_dependencies(file_path)
    return ", ".join(deps) if deps else "No dependencies found."

def get_dependents(file_path: str):
    """Returns files that import this file."""
    deps = get_dep_graph().get_dependents(file_path)
    return ", ".join(deps) if deps else "No dependents found."

# --- AGENT PROMPT ---
SYSTEM_PROMPT = """You are EDITH, a code analysis AI. You MUST answer questions by reading actual code.

CRITICAL RULES:
1. NEVER guess or use general knowledge. ONLY answer based on code you have READ.
2. You MUST use read_file to see actual code before giving a Final Answer.
3. Include specific file names, function names, and code snippets in your answer.
4. If search_code finds relevant files, READ them before answering.

TOOLS:
- search_code(query): Find relevant code chunks. USE THIS FIRST.
- read_file(path): Read a file's full content. USE THIS BEFORE ANSWERING.
- get_dependencies(path): What does this file import?
- get_dependents(path): What imports this file?

FORMAT:
Thought: <reasoning>
Action: [tool_name: argument]

After observations, provide:
Final Answer: <answer WITH code evidence>

EXAMPLE:
Question: How does get() work?
Thought: I need to find and read the get function
Action: [search_code: get function http]
Observation: [FILE: src/requests/api.py] def get(url, params=None...
Thought: Found it in api.py, let me read the full file
Action: [read_file: src/requests/api.py]
Observation: <full file content>
Final Answer: The `get()` function is defined in `src/requests/api.py`. It takes a URL and optional parameters, then calls `request('get', url, params=params, **kwargs)`. Here's the code:
```python
def get(url, params=None, **kwargs):
    return request('get', url, params=params, **kwargs)
```
"""

def answer_question(question: str) -> str:
    client = get_groq_client()
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": question}
    ]
    
    all_observations = []
    steps = 0
    max_steps = 10
    
    while steps < max_steps:
        try:
            chat = client.chat.completions.create(
                messages=messages,
                model="llama-3.3-70b-versatile",
                temperature=0,
                stop=["Observation:"]
            )
        except Exception as e:
            return f"LLM Error: {e}"
            
        response_text = chat.choices[0].message.content.strip()
        messages.append({"role": "assistant", "content": response_text})
        
        # Check for Final Answer
        if "Final Answer:" in response_text:
            answer = response_text.split("Final Answer:")[-1].strip()
            return answer
            
        # Parse Action - more flexible regex
        action_match = re.search(r"Action:\s*\[?(\w+)[:]\s*(.+?)\]?$", response_text, re.MULTILINE)
        if action_match:
            tool = action_match.group(1).strip()
            arg = action_match.group(2).strip().strip(']').strip('"\'')
            
            print(f"🤖 Step {steps+1}: {tool}('{arg}')", flush=True)
            
            # Execute Tool
            observation = "Error: Unknown tool. Available: search_code, read_file, get_dependencies, get_dependents"
            if tool == "search_code":
                observation = search_code(arg)
            elif tool == "read_file":
                observation = read_file(arg)
            elif tool == "get_dependencies":
                observation = get_dependencies(arg)
            elif tool == "get_dependents":
                observation = get_dependents(arg)
                
            # Truncate observation if huge
            if len(observation) > 6000:
                observation = observation[:6000] + "\n...(truncated)"
                
            all_observations.append(f"[{tool}({arg})]: {observation[:200]}...")
            messages.append({"role": "user", "content": f"Observation: {observation}"})
        else:
            # Force a conclusion if format is wrong
            messages.append({"role": "user", "content": "Observation: Please either use 'Action: [tool: arg]' or provide 'Final Answer:' now."})
            
        steps += 1
    
    # If we hit the limit, summarize what we found
    summary = "\n".join(all_observations[-3:]) if all_observations else "No observations collected."
    return f"I explored the codebase but reached my step limit. Here's what I found:\n\n{response_text}"
