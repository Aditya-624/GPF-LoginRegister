-- Remove recently added columns (8-12) from GPF table
-- Then add only PHONE_NUMBER column

-- Drop columns 8-12 that were added by Hibernate
BEGIN
   -- Drop EMPLOYEE_ID column
   BEGIN
      EXECUTE IMMEDIATE 'ALTER TABLE GPF DROP COLUMN EMPLOYEE_ID';
      DBMS_OUTPUT.PUT_LINE('Dropped EMPLOYEE_ID column');
   EXCEPTION
      WHEN OTHERS THEN
         IF SQLCODE != -904 THEN -- Column does not exist
            RAISE;
         END IF;
   END;
   
   -- Drop ACCOUNT_NO column
   BEGIN
      EXECUTE IMMEDIATE 'ALTER TABLE GPF DROP COLUMN ACCOUNT_NO';
      DBMS_OUTPUT.PUT_LINE('Dropped ACCOUNT_NO column');
   EXCEPTION
      WHEN OTHERS THEN
         IF SQLCODE != -904 THEN
            RAISE;
         END IF;
   END;
   
   -- Drop NAME column
   BEGIN
      EXECUTE IMMEDIATE 'ALTER TABLE GPF DROP COLUMN NAME';
      DBMS_OUTPUT.PUT_LINE('Dropped NAME column');
   EXCEPTION
      WHEN OTHERS THEN
         IF SQLCODE != -904 THEN
            RAISE;
         END IF;
   END;
   
   -- Drop PHONE column
   BEGIN
      EXECUTE IMMEDIATE 'ALTER TABLE GPF DROP COLUMN PHONE';
      DBMS_OUTPUT.PUT_LINE('Dropped PHONE column');
   EXCEPTION
      WHEN OTHERS THEN
         IF SQLCODE != -904 THEN
            RAISE;
         END IF;
   END;
   
   -- Drop RETIREMENT_DATE column
   BEGIN
      EXECUTE IMMEDIATE 'ALTER TABLE GPF DROP COLUMN RETIREMENT_DATE';
      DBMS_OUTPUT.PUT_LINE('Dropped RETIREMENT_DATE column');
   EXCEPTION
      WHEN OTHERS THEN
         IF SQLCODE != -904 THEN
            RAISE;
         END IF;
   END;
END;
/

-- Add PHONE_NUMBER column
ALTER TABLE GPF ADD PHONE_NUMBER VARCHAR2(20);

-- Create index for phone number searches
CREATE INDEX idx_gpf_phone_number ON GPF(PHONE_NUMBER);

COMMIT;
