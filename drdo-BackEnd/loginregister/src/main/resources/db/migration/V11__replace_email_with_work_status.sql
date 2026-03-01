-- Replace email column with work_status column
-- Drop the unique constraint on email first
ALTER TABLE users DROP CONSTRAINT uniq_users_email;

-- Drop the email column
ALTER TABLE users DROP COLUMN email;

-- Add work_status column with check constraint (allowing NULL temporarily)
ALTER TABLE users ADD work_status VARCHAR2(50) 
    CONSTRAINT chk_work_status CHECK (work_status IN ('OFFICER', 'INDUSTRIAL', 'NON_INDUSTRIAL'));

-- Update existing users with a default value (if any exist)
UPDATE users SET work_status = 'OFFICER' WHERE work_status IS NULL;

-- Now make the column NOT NULL
ALTER TABLE users MODIFY work_status VARCHAR2(50) NOT NULL;

-- Add comment to the column
COMMENT ON COLUMN users.work_status IS 'Employee work status/designation type: OFFICER, INDUSTRIAL, or NON_INDUSTRIAL';
