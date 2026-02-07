import os
import getpass
import snowflake.connector
from snowflake.connector import DictCursor
from dotenv import load_dotenv

# Load .env file manually in case load_dotenv() fails or is not found
load_dotenv()

def setup_snowflake():
    print("=== EDITH Snowflake Connection Test ===")
    
    # Check if we have .env configuration
    env_account = os.getenv("SNOWFLAKE_ACCOUNT")
    env_user = os.getenv("SNOWFLAKE_USER")
    env_password = os.getenv("SNOWFLAKE_PASSWORD")
    env_role = os.getenv("SNOWFLAKE_ROLE") or "ACCOUNTADMIN"
    env_auth = os.getenv("SNOWFLAKE_AUTHENTICATOR")
    
    if env_account and env_user:
        print(f"\nFound configuration for user '{env_user}' on account '{env_account}' in .env")
        choice = input("Test this configuration? [Y/n]: ").strip().lower()
        if choice in ('', 'y', 'yes'):
            test_connection(env_user, env_password, env_account, env_role, env_auth)
            return

    print("\n--- Manual Configuration ---")
    account = input("Snowflake Account (e.g., xy12345.us-east-1): ").strip()
    user = input("Username: ").strip()
    
    print("\nAuthentication Method:")
    print("1. Password (default)")
    print("2. Browser / SSO (Pop-up window)")
    auth_choice = input("Choice [1]: ").strip()
    
    password = ""
    authenticator = None
    
    if auth_choice == "2":
        authenticator = "externalbrowser"
    else:
        password = getpass.getpass("Password: ").strip()

    role = input("Role [ACCOUNTADMIN]: ").strip() or "ACCOUNTADMIN"
    
    test_connection(user, password, account, role, authenticator)

def test_connection(user, password, account, role, authenticator):
    print(f"\nConnecting to {account} as {user}...")
    
    try:
        connect_args = {
            "user": user,
            "account": account,
            "role": role,
            "warehouse": "COMPUTE_WH",
            "database": "EDITH_DB",
            "schema": "PUBLIC"
        }
        if authenticator:
            connect_args["authenticator"] = authenticator
        else:
            connect_args["password"] = password

        conn = snowflake.connector.connect(**connect_args)
        print("✅ Connection successful!")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return

    cur = conn.cursor(DictCursor)

    # 3. Test Cortex Models
    print("\n--- Testing Cortex AI Models ---")
    available_model = None
    models_to_test = ["llama3-70b", "mistral-large", "gemma-7b", "snowflake-arctic", "reka-flash"]
    
    for model in models_to_test:
        print(f"Testing model '{model}'...", end=" ")
        try:
            cur.execute(f"SELECT SNOWFLAKE.CORTEX.COMPLETE('{model}', 'Hello') as response")
            row = cur.fetchone()
            if row:
                print("✅ Working!")
                available_model = model
                break
        except Exception as e:
            # Check specifically for "invalid value" or "not supported"
            err_msg = str(e)
            if "invalid value" in err_msg or "not supported" in err_msg:
                print(f"❌ Unavailable ({model})")
            else:
                print(f"❌ Failed: {e}")

    conn.close()

    if not available_model:
        # Fallback
        available_model = "llama3-70b"
        print(f"\n⚠️ Could not verify a model. Defaulting to {available_model}.")
    else:
        print(f"\n🎉 Configuration verified successfully! Model: {available_model}")
        print("You can start the backend now.")

if __name__ == "__main__":
    setup_snowflake()
