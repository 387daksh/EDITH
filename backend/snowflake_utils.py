import os
import snowflake.connector
from snowflake.connector import DictCursor

def get_snowflake_connection():
    """
    Establishes a connection to Snowflake using environment variables.
    """
    try:
        conn = snowflake.connector.connect(
            user=os.getenv("SNOWFLAKE_USER"),
            password=os.getenv("SNOWFLAKE_PASSWORD"),
            account=os.getenv("SNOWFLAKE_ACCOUNT"),
            warehouse=os.getenv("SNOWFLAKE_WAREHOUSE"),
            database=os.getenv("SNOWFLAKE_DATABASE"),
            schema=os.getenv("SNOWFLAKE_SCHEMA"),
            role=os.getenv("SNOWFLAKE_ROLE"),
        )
        return conn
    except Exception as e:
        print(f"Failed to connect to Snowflake: {e}")
        raise e

def run_query(query: str, params=None):
    """
    Executes a query and returns the results.
    """
    conn = get_snowflake_connection()
    try:
        cur = conn.cursor(DictCursor)
        if params:
            cur.execute(query, params)
        else:
            cur.execute(query)
        return cur.fetchall()
    finally:
        conn.close()
