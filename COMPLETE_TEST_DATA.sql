-- ============================================
-- COMPLETE TEST DATA FOR 3 USERS
-- ============================================
-- This script creates test data for 3 users across all tables
-- Run this script in your H2 database console or via SQL client

-- ============================================
-- 1. USERS TABLE - 3 Test Users
-- ============================================
-- Password for all users: Test@1234
-- Hashed using BCrypt

INSERT INTO users (user_id, username, work_status, password, dob, security_question_1, security_answer_1, security_question_2, security_answer_2, password_expiry_days, last_password_change_date) 
VALUES 
('OFF001', 'rajesh.kumar', 'OFFICER', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1985-05-15', 'What is your favorite color?', 'blue', 'What is your pet name?', 'tommy', 90, CURRENT_DATE),
('IND001', 'priya.sharma', 'INDUSTRIAL', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1990-08-22', 'What is your favorite color?', 'red', 'What is your pet name?', 'fluffy', 90, CURRENT_DATE),
('NON001', 'amit.patel', 'NON_INDUSTRIAL', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1988-12-10', 'What is your favorite color?', 'green', 'What is your pet name?', 'buddy', 90, CURRENT_DATE);

-- ============================================
-- 2. GPF TABLE - GPF Account Details
-- ============================================

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
VALUES 
(100001, 'OFF001', 'Rajesh Kumar', 'SENIOR TECHNICAL OFFICER', '1985-05-15', '2045-05-31', 75000.00, '9876543210'),
(100002, 'IND001', 'Priya Sharma', 'INDUSTRIAL WORKER GRADE-II', '1990-08-22', '2050-08-31', 45000.00, '9876543211'),
(100003, 'NON001', 'Amit Patel', 'NON-INDUSTRIAL STAFF', '1988-12-10', '2048-12-31', 35000.00, '9876543212');

-- ============================================
-- 3. GPF_YEARS TABLE - Year-wise Closing Balances
-- ============================================
-- Multiple years for each user to test year selection

-- Rajesh Kumar (OFF001) - Officer with good savings
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
VALUES 
('OFF001', 2022, 850000.00),
('OFF001', 2023, 920000.00),
('OFF001', 2024, 1050000.00),
('OFF001', 2025, 1150000.00);

-- Priya Sharma (IND001) - Industrial worker
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
VALUES 
('IND001', 2022, 450000.00),
('IND001', 2023, 520000.00),
('IND001', 2024, 580000.00),
('IND001', 2025, 650000.00);

-- Amit Patel (NON001) - Non-industrial staff
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
VALUES 
('NON001', 2022, 320000.00),
('NON001', 2023, 380000.00),
('NON001', 2024, 425000.00),
('NON001', 2025, 480000.00);

-- ============================================
-- 4. GPF_PURPOSE_E TABLE - Temporary Advance Purposes
-- ============================================

INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE)
VALUES 
(1, 'Medical Emergency'),
(2, 'Education of Children'),
(3, 'House Repair and Renovation'),
(4, 'Purchase of Consumer Durables'),
(5, 'Marriage Expenses'),
(6, 'Travel and Tourism'),
(7, 'Debt Repayment'),
(8, 'Other Personal Needs');

-- ============================================
-- 5. GPF_PURPOSE_F TABLE - Final Withdrawal Purposes
-- ============================================

INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE)
VALUES 
(1, 'House Construction'),
(2, 'Purchase of House/Flat'),
(3, 'Marriage of Self/Children'),
(4, 'Higher Education'),
(5, 'Medical Treatment'),
(6, 'Starting Business'),
(7, 'Retirement Settlement'),
(8, 'Other Approved Purposes');

-- ============================================
-- 6. GPF_USR_DETAILS TABLE - Sample Applications
-- ============================================
-- Some pending and some approved applications for testing

-- Rajesh Kumar - Pending Temporary Advance
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES 
(50000.00, '2025-02-15', 'Y', 'T', '123 MG Road, Bangalore', 100001, 1);

-- Rajesh Kumar - Approved Final Withdrawal
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES 
(200000.00, '2024-11-20', 'Y', 'F', '123 MG Road, Bangalore', 100001, 1);

-- Priya Sharma - Pending Temporary Advance
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES 
(30000.00, '2025-02-20', 'Y', 'T', '456 Park Street, Mumbai', 100002, 2);

-- Priya Sharma - Approved Temporary Advance
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES 
(25000.00, '2024-10-15', 'Y', 'T', '456 Park Street, Mumbai', 100002, 5);

-- Amit Patel - Pending Final Withdrawal
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES 
(100000.00, '2025-02-25', 'Y', 'F', '789 Lake View, Delhi', 100003, 3);

-- Amit Patel - Approved Temporary Advance
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES 
(20000.00, '2024-12-10', 'Y', 'T', '789 Lake View, Delhi', 100003, 3);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify data was inserted correctly

-- Check Users
SELECT user_id, username, work_status, dob FROM users ORDER BY user_id;

-- Check GPF Accounts
SELECT GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, BASIC_PAY FROM GPF ORDER BY PERS_NUMBER;

-- Check GPF Years
SELECT PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE FROM GPF_YEARS ORDER BY PASS_NUMBER, GPF_YEARS;

-- Check Purpose E
SELECT CODE, PURPOSE FROM GPF_PURPOSE_E ORDER BY CODE;

-- Check Purpose F
SELECT CODE, PURPOSE FROM GPF_PURPOSE_F ORDER BY CODE;

-- Check User Applications
SELECT ID, PERSNO, APPL_AMT, APPL_DATE, GPF_TYPE, PURPOSE FROM GPF_USR_DETAILS ORDER BY PERSNO, APPL_DATE;

-- ============================================
-- SUMMARY OF TEST DATA
-- ============================================
/*
USER 1: Rajesh Kumar (Officer)
- Username: rajesh.kumar
- Password: Test@1234
- User ID: OFF001
- Work Status: OFFICER
- GPF Account: 100001
- Closing Balance 2025: ₹11,50,000
- Applications: 1 Pending, 1 Approved

USER 2: Priya Sharma (Industrial)
- Username: priya.sharma
- Password: Test@1234
- User ID: IND001
- Work Status: INDUSTRIAL
- GPF Account: 100002
- Closing Balance 2025: ₹6,50,000
- Applications: 1 Pending, 1 Approved

USER 3: Amit Patel (Non-Industrial)
- Username: amit.patel
- Password: Test@1234
- User ID: NON001
- Work Status: NON_INDUSTRIAL
- GPF Account: 100003
- Closing Balance 2025: ₹4,80,000
- Applications: 1 Pending, 1 Approved
*/
