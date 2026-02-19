-- Simple script to add ID column to existing GPF_YEARS table
-- Run this in SQL Developer

-- Step 1: Add ID column to existing table
ALTER TABLE GPF_YEARS ADD (
    ID NUMBER GENERATED ALWAYS AS IDENTITY
);

-- Step 2: Make ID the primary key
ALTER TABLE GPF_YEARS ADD CONSTRAINT gpf_years_pk PRIMARY KEY (ID);

-- Step 3: Add unique constraint on PASS_NUMBER and GPF_YEARS
ALTER TABLE GPF_YEARS ADD CONSTRAINT uk_gpf_years_pass_year UNIQUE (PASS_NUMBER, GPF_YEARS);

-- Step 4: Create indexes
CREATE INDEX idx_gpf_years_pass_number ON GPF_YEARS(PASS_NUMBER);
CREATE INDEX idx_gpf_years_year ON GPF_YEARS(GPF_YEARS);

-- Step 5: Clean up Flyway history (if V10 failed before)
DELETE FROM flyway_schema_history WHERE version = '10';

COMMIT;

-- Verify the changes
SELECT * FROM GPF_YEARS;
