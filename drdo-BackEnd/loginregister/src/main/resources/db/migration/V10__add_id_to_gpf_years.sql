-- Migration V10: Add auto-generated ID as primary key to GPF_YEARS table
-- This allows multiple year records per GPF account while preventing duplicate year entries

-- Step 1: Create new table with correct structure (Oracle syntax)
CREATE TABLE GPF_YEARS_NEW (
    ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PASS_NUMBER VARCHAR2(50) NOT NULL,
    GPF_YEARS NUMBER(10, 2) NOT NULL,
    CLOSING_BALANCE NUMBER(15, 2) NOT NULL,
    CONSTRAINT uk_gpf_years_pass_year UNIQUE (PASS_NUMBER, GPF_YEARS)
);

-- Step 2: Copy existing data from old table to new table
INSERT INTO GPF_YEARS_NEW (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
SELECT PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE
FROM GPF_YEARS;

-- Step 3: Drop old table
DROP TABLE GPF_YEARS CASCADE CONSTRAINTS;

-- Step 4: Rename new table to original name
ALTER TABLE GPF_YEARS_NEW RENAME TO GPF_YEARS;

-- Step 5: Create indexes for performance
CREATE INDEX idx_gpf_years_pass_number ON GPF_YEARS(PASS_NUMBER);
CREATE INDEX idx_gpf_years_year ON GPF_YEARS(GPF_YEARS);

COMMIT;
