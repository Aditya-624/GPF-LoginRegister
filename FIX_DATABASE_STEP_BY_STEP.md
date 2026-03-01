# Fix Database - Step by Step Guide

## Problem
- Database still has EMAIL column
- Backend validation is failing because it expects workStatus but database has email

## Solution - Manual Database Update

### Step 1: Stop the Backend
The backend is currently running. Stop it first.

### Step 2: Connect to Oracle Database
Open SQL Developer or SQL*Plus and connect with:
- Username: aditya
- Password: aditya2468
- Connection: localhost:1521/xe

### Step 3: Run These SQL Commands ONE BY ONE

```sql
-- Check current structure
DESC users;

-- Drop email column
ALTER TABLE users DROP COLUMN email;

-- Add work_status column (nullable first)
ALTER TABLE users ADD work_status VARCHAR2(50);

-- Update existing users with default value
UPDATE users SET work_status = 'OFFICER' WHERE work_status IS NULL;
COMMIT;

-- Make work_status NOT NULL
ALTER TABLE users MODIFY work_status VARCHAR2(50) NOT NULL;

-- Add check constraint
ALTER TABLE users ADD CONSTRAINT chk_work_status 
CHECK (work_status IN ('OFFICER', 'INDUSTRIAL', 'NON_INDUSTRIAL'));

-- Verify the changes
DESC users;
SELECT * FROM users;
```

### Step 4: Update Flyway History (Important!)

This tells Flyway that V11 migration has been applied:

```sql
-- Check current Flyway history
SELECT * FROM flyway_schema_history ORDER BY installed_rank;

-- Insert V11 migration record
INSERT INTO flyway_schema_history (
    installed_rank, 
    version, 
    description, 
    type, 
    script, 
    checksum, 
    installed_by, 
    execution_time, 
    success
)
VALUES (
    (SELECT COALESCE(MAX(installed_rank), 0) + 1 FROM flyway_schema_history),
    '11',
    'replace email with work status',
    'SQL',
    'V11__replace_email_with_work_status.sql',
    NULL,
    USER,
    0,
    1
);
COMMIT;

-- Verify it was added
SELECT * FROM flyway_schema_history ORDER BY installed_rank;
```

### Step 5: Restart Backend

After database is fixed, restart the backend:

```bash
cd drdo-BackEnd/loginregister
./mvnw.cmd spring-boot:run
```

### Step 6: Test Registration

1. Open browser: http://localhost:5173
2. Go to Registration page
3. Fill the form with:
   - Username: testuser123
   - Work Status: Select "Government Officer"
   - Date of Birth: Select a date
   - Password: Test@1234
   - Confirm Password: Test@1234
   - Password Expiry: 30
   - Security Questions: Answer both
4. Click "Create Account"

### Expected Result

✅ User should be created successfully
✅ Database should have work_status value
✅ No validation errors

## Alternative: Quick Reset (If you don't need existing users)

If you don't need existing users, you can simply delete all users and let the backend recreate the table:

```sql
-- Delete all users
DELETE FROM users;
COMMIT;

-- Drop the table completely
DROP TABLE users CASCADE CONSTRAINTS;

-- Delete Flyway history for users table migrations
DELETE FROM flyway_schema_history WHERE version IN ('1', '2', '3', '4', '5', '6', '8', '9', '10', '11');
COMMIT;

-- Restart backend - it will recreate everything from scratch
```

## Verification Queries

After fixing, run these to verify:

```sql
-- Check table structure
DESC users;

-- Should show: WORK_STATUS VARCHAR2(50) NOT NULL
-- Should NOT show: EMAIL column

-- Check constraints
SELECT constraint_name, search_condition 
FROM user_constraints 
WHERE table_name = 'USERS' 
AND constraint_name = 'CHK_WORK_STATUS';

-- Check Flyway history
SELECT version, description, success 
FROM flyway_schema_history 
ORDER BY installed_rank;
```

## Troubleshooting

### If you get "column already exists" error:
```sql
-- Check if work_status exists
SELECT column_name FROM user_tab_columns 
WHERE table_name = 'USERS' AND column_name = 'WORK_STATUS';

-- If it exists, just drop email
ALTER TABLE users DROP COLUMN email;
```

### If you get "constraint already exists" error:
```sql
-- Drop existing constraint
ALTER TABLE users DROP CONSTRAINT chk_work_status;

-- Add it again
ALTER TABLE users ADD CONSTRAINT chk_work_status 
CHECK (work_status IN ('OFFICER', 'INDUSTRIAL', 'NON_INDUSTRIAL'));
```

### If Flyway complains about checksum mismatch:
```sql
-- Repair Flyway
DELETE FROM flyway_schema_history WHERE version = '11';
COMMIT;

-- Then insert the record again
```

## Summary

1. ✅ Stop backend
2. ✅ Run SQL commands to fix database
3. ✅ Update Flyway history
4. ✅ Restart backend
5. ✅ Test registration

The key issue is that Hibernate's `ddl-auto=update` tried to add the column before Flyway could run the proper migration. I've changed it to `validate` so Flyway will handle all schema changes.
