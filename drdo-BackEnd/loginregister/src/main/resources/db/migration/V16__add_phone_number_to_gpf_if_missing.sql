-- Add PHONE_NUMBER column to GPF table if it doesn't exist
-- This migration is safe to run even if the column already exists
BEGIN
  EXECUTE IMMEDIATE 'ALTER TABLE GPF ADD (PHONE_NUMBER VARCHAR2(20))';
  COMMIT;
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE = -1430 THEN
      -- Column already exists, ignore error
      NULL;
    ELSE
      RAISE;
    END IF;
END;
/
