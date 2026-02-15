-- Insert Test Data into GPF Table
-- This script adds sample employee records for testing the GPF system

-- Clear existing test data (optional - comment out if you want to keep existing data)
-- DELETE FROM GPF WHERE GPF_ACCOUNTNUMBER IN (100001, 100002, 100003, 100004, 100005);

-- Insert 5 test employees
INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER) 
VALUES 
(100001, 'PERS001', 'Rajesh Kumar', 'Senior Scientist', '1980-05-15', '2040-05-31', 85000.00, '9876543210'),
(100002, 'PERS002', 'Priya Sharma', 'Technical Officer', '1985-08-22', '2045-08-31', 65000.00, '9876543211'),
(100003, 'PERS003', 'Amit Patel', 'Research Associate', '1990-03-10', '2050-03-31', 55000.00, '9876543212'),
(100004, 'PERS004', 'Sneha Reddy', 'Principal Scientist', '1978-11-28', '2038-11-30', 95000.00, '9876543213'),
(100005, 'PERS005', 'Vikram Singh', 'Junior Scientist', '1992-07-05', '2052-07-31', 45000.00, '9876543214');

-- Verify the inserted data
SELECT * FROM GPF ORDER BY GPF_ACCOUNTNUMBER;

-- Display count
SELECT COUNT(*) AS TOTAL_RECORDS FROM GPF;
