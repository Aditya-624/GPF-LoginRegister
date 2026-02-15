-- Manual cleanup of GPF table
-- Remove columns 8-12 and add PHONE_NUMBER

-- Drop EMPLOYEE_ID column
ALTER TABLE GPF DROP COLUMN EMPLOYEE_ID;

-- Drop ACCOUNT_NO column
ALTER TABLE GPF DROP COLUMN ACCOUNT_NO;

-- Drop NAME column
ALTER TABLE GPF DROP COLUMN NAME;

-- Drop PHONE column
ALTER TABLE GPF DROP COLUMN PHONE;

-- Drop RETIREMENT_DATE column
ALTER TABLE GPF DROP COLUMN RETIREMENT_DATE;

-- Add PHONE_NUMBER column
ALTER TABLE GPF ADD PHONE_NUMBER VARCHAR2(20);

-- Create index for phone number
CREATE INDEX idx_gpf_phone_number ON GPF(PHONE_NUMBER);

COMMIT;

-- Show final structure
SELECT column_name, data_type, data_length 
FROM user_tab_columns 
WHERE table_name = 'GPF' 
ORDER BY column_id;

EXIT;
