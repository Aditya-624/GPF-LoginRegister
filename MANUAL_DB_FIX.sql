-- MANUAL DATABASE FIX FOR WORK_STATUS
-- Run these commands in your Oracle SQL Developer or SQL*Plus

-- Step 1: Check current table structure
DESC users;

-- Step 2: Drop email column if it exists
ALTER TABLE users DROP COLUMN email;

-- Step 3: Add work_status column (nullable first)
ALTER TABLE users ADD work_status VARCHAR2(50);

-- Step 4: Update existing users with default value
UPDATE users SET work_status = 'OFFICER' WHERE work_status IS NULL;
COMMIT;

-- Step 5: Make work_status NOT NULL
ALTER TABLE users MODIFY work_status VARCHAR2(50) NOT NULL;

-- Step 6: Add check constraint
ALTER TABLE users ADD CONSTRAINT chk_work_status CHECK (work_status IN ('OFFICER', 'INDUSTRIAL', 'NON_INDUSTRIAL'));

-- Step 7: Verify changes
DESC users;
SELECT user_id, username, work_status FROM users;

-- Step 8: Update Flyway schema history to mark V11 as executed
INSERT INTO flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, execution_time, success)
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

-- Verify Flyway history
SELECT * FROM flyway_schema_history ORDER BY installed_rank;
