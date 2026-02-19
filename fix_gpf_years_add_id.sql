-- Fix GPF_YEARS table: Add ID column as primary key
-- Run this script in your Oracle database (SQL Developer or similar)

-- Step 1: Remove failed migration from Flyway history
DELETE FROM flyway_schema_history WHERE version = '10';

-- Step 2: Create new table with ID column
CREATE TABLE GPF_YEARS_NEW (
    ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PASS_NUMBER VARCHAR2(50) NOT NULL,
    GPF_YEARS NUMBER(10, 2) NOT NULL,
    CLOSING_BALANCE NUMBER(15, 2) NOT NULL,
    CONSTRAINT uk_gpf_years_pass_year UNIQUE (PASS_NUMBER, GPF_YEARS)
);

-- Step 3: Copy existing data from old table
INSERT INTO GPF_YEARS_NEW (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
SELECT PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE
FROM GPF_YEARS;

-- Step 4: Drop old table
DROP TABLE GPF_YEARS CASCADE CONSTRAINTS;

-- Step 5: Rename new table to original name
ALTER TABLE GPF_YEARS_NEW RENAME TO GPF_YEARS;

-- Step 6: Create indexes for performance
CREATE INDEX idx_gpf_years_pass_number ON GPF_YEARS(PASS_NUMBER);
CREATE INDEX idx_gpf_years_year ON GPF_YEARS(GPF_YEARS);

COMMIT;

-- Verify the fix
SELECT * FROM GPF_YEARS;
