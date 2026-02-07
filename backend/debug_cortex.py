from dotenv import load_dotenv
import os
import snowflake.connector

load_dotenv()

def debug_cortex():
    print("--- Debugging Snowflake Cortex ---")
    try:
        conn = snowflake.connector.connect(
            user=os.getenv("SNOWFLAKE_USER"),
            password=os.getenv("SNOWFLAKE_PASSWORD"),
            account=os.getenv("SNOWFLAKE_ACCOUNT"),
            role=os.getenv("SNOWFLAKE_ROLE"),
            warehouse=os.getenv("SNOWFLAKE_WAREHOUSE"),
            database=os.getenv("SNOWFLAKE_DATABASE"),
            schema=os.getenv("SNOWFLAKE_SCHEMA"),
            authenticator=os.getenv("SNOWFLAKE_AUTHENTICATOR"),
        )
        print("✅ Connected to Snowflake")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return

    cur = conn.cursor()
    
    # Try a simple query
    try:
        print("Attempting to call llama3-8b...")
        cur.execute("SELECT SNOWFLAKE.CORTEX.COMPLETE('llama3-8b', 'Say hi')")
        print("✅ Success!")
        print(cur.fetchall())
    except Exception as e:
        print(f"\n❌ ERROR DETAILS:\n{e}")
        
    conn.close()

if __name__ == "__main__":
    debug_cortex()
