-- Check GPF table structure
DESC GPF;

-- Show all columns
SELECT column_name, data_type, data_length, nullable
FROM user_tab_columns
WHERE table_name = 'GPF'
ORDER BY column_id;

-- Show sample data
SELECT * FROM GPF WHERE ROWNUM <= 5;

EXIT;
