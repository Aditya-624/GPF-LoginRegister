-- Test script to verify GPF_YEARS table structure after V10 migration
-- Run this to check if the migration was applied correctly

-- Check table structure
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'GPF_YEARS'
ORDER BY ORDINAL_POSITION;

-- Check constraints
SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_NAME = 'GPF_YEARS';

-- Check existing data
SELECT * FROM GPF_YEARS;

-- Check Flyway migration history
SELECT * FROM flyway_schema_history
ORDER BY installed_rank DESC;
