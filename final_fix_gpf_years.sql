-- Final fix: Recreate GPF_YEARS with ID column
-- Copy this entire script and run in SQL Developer

-- Drop existing table
DROP TABLE GPF_YEARS CASCADE CONSTRAINTS;

-- Create new table with ID
CREATE TABLE GPF_YEARS (
    ID NUMBER PRIMARY KEY,
    PASS_NUMBER VARCHAR2(50) NOT NULL,
    GPF_YEARS NUMBER(10, 2) NOT NULL,
    CLOSING_BALANCE NUMBER(15, 2) NOT NULL,
    CONSTRAINT uk_gpf_years_pass_year UNIQUE (PASS_NUMBER, GPF_YEARS)
);

-- Create sequence for ID
CREATE SEQUENCE gpf_years_seq START WITH 1;

-- Create trigger for auto-increment
CREATE OR REPLACE TRIGGER gpf_years_id_trigger
BEFORE INSERT ON GPF_YEARS
FOR EACH ROW
BEGIN
  IF :NEW.ID IS NULL THEN
    :NEW.ID := gpf_years_seq.NEXTVAL;
  END IF;
END;
/

-- Insert your test data back
INSERT INTO GPF_YEARS (ID, PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES (1, 'PERS005', 2024, 10000);
INSERT INTO GPF_YEARS (ID, PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES (2, '100005', 2025, 60000);

-- Clean Flyway
DELETE FROM flyway_schema_history WHERE version = '10';

COMMIT;

-- Verify
SELECT * FROM GPF_YEARS ORDER BY ID;
