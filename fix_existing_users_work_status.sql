-- Script to fix existing users by adding work_status
-- Run this manually in your Oracle database if you have existing users

-- Option 1: Delete all existing users (if test data)
-- DELETE FROM users;
-- COMMIT;

-- Option 2: Add work_status column with default value for existing users
-- First, check if email column still exists
SELECT column_name FROM user_tab_columns WHERE table_name = 'USERS' AND column_name = 'EMAIL';

-- If email exists, drop it
ALTER TABLE users DROP COLUMN email;

-- Add work_status column (nullable first)
ALTER TABLE users ADD work_status VARCHAR2(50);

-- Update existing users with a default value
UPDATE users SET work_status = 'OFFICER' WHERE work_status IS NULL;
COMMIT;

-- Now make it NOT NULL
ALTER TABLE users MODIFY work_status VARCHAR2(50) NOT NULL;

-- Add check constraint
ALTER TABLE users ADD CONSTRAINT chk_work_status CHECK (work_status IN ('OFFICER', 'INDUSTRIAL', 'NON_INDUSTRIAL'));

-- Verify the changes
DESC users;
SELECT * FROM users;
