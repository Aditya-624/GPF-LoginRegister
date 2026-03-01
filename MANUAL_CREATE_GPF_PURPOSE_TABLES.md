# Manual Creation of GPF_PURPOSE_F and GPF_PURPOSE_E Tables

## Issue
The Flyway migrations are not running automatically, so the tables need to be created manually.

## Solution: Run SQL Script Manually

### Step 1: Connect to Oracle Database

Open SQL*Plus or SQL Developer and connect:

```bash
sqlplus aditya/aditya2468@localhost:1521/xe
```

Or use SQL Developer with these credentials:
- Username: `aditya`
- Password: `aditya2468`
- Hostname: `localhost`
- Port: `1521`
- Service name: `xe`

### Step 2: Run the SQL Script

Copy and paste the contents of `create_gpf_purpose_tables_manual.sql` or run it directly:

```sql
@create_gpf_purpose_tables_manual.sql
```

Or execute the commands manually:

```sql
-- Create GPF_PURPOSE_F table
CREATE TABLE GPF_PURPOSE_F (
    CODE NUMBER NOT NULL,
    PURPOSE VARCHAR2(20),
    PERCENTAGE NUMBER,
    RULE VARCHAR2(20),
    CONSTRAINT pk_gpf_purpose_f PRIMARY KEY (CODE)
);

-- Insert sample data
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (1, 'House Construction', 90, 'Rule 1');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (2, 'Education', 50, 'Rule 2');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (3, 'Medical Emergency', 100, 'Rule 3');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (4, 'Marriage', 50, 'Rule 4');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (5, 'Other Purpose', 25, 'Rule 5');

-- Create GPF_PURPOSE_E table
CREATE TABLE GPF_PURPOSE_E (
    CODE NUMBER NOT NULL,
    PURPOSE VARCHAR2(20),
    PERCENTAGE NUMBER,
    RULE VARCHAR2(20),
    CONSTRAINT pk_gpf_purpose_e PRIMARY KEY (CODE)
);

-- Insert sample data
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (1, 'Emergency Medical', 100, 'Rule E1');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (2, 'Education Loan', 60, 'Rule E2');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (3, 'Home Repair', 75, 'Rule E3');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (4, 'Vehicle Repair', 40, 'Rule E4');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (5, 'Personal Loan', 30, 'Rule E5');

COMMIT;
```

### Step 3: Verify Tables Were Created

```sql
-- Check if tables exist
SELECT table_name FROM user_tables WHERE table_name IN ('GPF_PURPOSE_F', 'GPF_PURPOSE_E');

-- Count rows
SELECT 'GPF_PURPOSE_F' as TABLE_NAME, COUNT(*) as ROW_COUNT FROM GPF_PURPOSE_F
UNION ALL
SELECT 'GPF_PURPOSE_E' as TABLE_NAME, COUNT(*) as ROW_COUNT FROM GPF_PURPOSE_E;

-- View all data
SELECT 'F' as CATEGORY, CODE, PURPOSE, PERCENTAGE, RULE FROM GPF_PURPOSE_F
UNION ALL
SELECT 'E' as CATEGORY, CODE, PURPOSE, PERCENTAGE, RULE FROM GPF_PURPOSE_E
ORDER BY CATEGORY, CODE;
```

Expected output:
```
CATEGORY  CODE  PURPOSE              PERCENTAGE  RULE
--------  ----  ------------------  ----------  --------
E         1     Emergency Medical   100         Rule E1
E         2     Education Loan      60          Rule E2
E         3     Home Repair         75          Rule E3
E         4     Vehicle Repair      40          Rule E4
E         5     Personal Loan       30          Rule E5
F         1     House Construction  90          Rule 1
F         2     Education           50          Rule 2
F         3     Medical Emergency   100         Rule 3
F         4     Marriage            50          Rule 4
F         5     Other Purpose       25          Rule 5
```

### Step 4: Test the API Endpoints

Once tables are created, test the APIs:

```bash
# Test GPF_PURPOSE_F
curl http://localhost:8081/api/gpf-purpose/all

# Test GPF_PURPOSE_E
curl http://localhost:8081/api/gpf-purpose-e/all
```

## Alternative: Using SQL Developer

1. Open SQL Developer
2. Create a new connection with the credentials above
3. Open a SQL Worksheet
4. Paste the SQL commands
5. Execute (F5 or Run Script button)

## Troubleshooting

### Error: Table already exists
If you get "ORA-00955: name is already used by an existing object":
```sql
-- Drop existing tables
DROP TABLE GPF_PURPOSE_F;
DROP TABLE GPF_PURPOSE_E;

-- Then recreate them
```

### Error: Insufficient privileges
If you get permission errors, ensure the user has CREATE TABLE privilege:
```sql
-- Run as SYSTEM or DBA user
GRANT CREATE TABLE TO aditya;
GRANT UNLIMITED TABLESPACE TO aditya;
```

### Verify User Schema
```sql
-- Check current user
SELECT USER FROM DUAL;

-- Should return: ADITYA
```

## Why Flyway Isn't Running

Possible reasons:
1. Flyway dependency might be missing in pom.xml
2. Migration files might not be in the correct location
3. Flyway might be disabled or misconfigured
4. Database user might not have sufficient privileges

## Next Steps

After manually creating the tables:
1. Restart Spring Boot application
2. Test the API endpoints
3. Verify data is accessible through the application
4. Consider fixing Flyway configuration for future migrations
