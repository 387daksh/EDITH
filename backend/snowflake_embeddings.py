from chromadb import Documents, EmbeddingFunction, Embeddings
from backend.snowflake_utils import run_query
import json

class SnowflakeEmbeddingFunction(EmbeddingFunction):
    def __call__(self, input: Documents) -> Embeddings:
        # Cortex expects a list of strings
        # Query: SELECT SNOWFLAKE.CORTEX.EMBED_TEXT_768('snowflake-arctic-embed-m', 'text')
        
        # We process in batches if necessary, but for simplicity here we map one by one 
        # or use a more optimized SQL approach if list is supported. 
        # Currently Cortex EMBED_TEXT_768 takes a single string or column.
        # We can optimize this by creating a temp table or using VALUES, but loop is safest for MVP.
        
        embeddings = []
        for text in input:
            # Escape single quotes in text
            safe_text = text.replace("'", "''")
            query = f"SELECT SNOWFLAKE.CORTEX.EMBED_TEXT_768('snowflake-arctic-embed-m', '{safe_text}') as embed"
            result = run_query(query)
            if result and result[0]['embed']:
                embeddings.append(json.loads(result[0]['embed']))
            else:
                embeddings.append([0.0]*768) # Fallback null embedding
        
        return embeddings
