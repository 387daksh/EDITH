-- EDITH Snowflake Setup Script
-- Copy and paste this into a Snowflake Worksheet and Run All.

-- 1. Create a Warehouse (if not already there)
CREATE WAREHOUSE IF NOT EXISTS COMPUTE_WH 
WAREHOUSE_SIZE = 'X-SMALL' 
AUTO_SUSPEND = 300 
AUTO_RESUME = TRUE;

-- 2. Create the Database
CREATE DATABASE IF NOT EXISTS EDITH_DB;

-- 3. Verify Cortex AI Access (Should return a greeting)
SELECT SNOWFLAKE.CORTEX.COMPLETE('llama3-70b', 'Hello from EDITH!');

-- 4. Get Your Account Info
-- Look at your browser URL. It should be https://app.snowflake.com/<ORG>/<ACCOUNT>/...
-- Your SNOWFLAKE_ACCOUNT is <ORG>-<ACCOUNT>
