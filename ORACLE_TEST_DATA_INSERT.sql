-- ============================================
-- TEST DATA FOR GPF PROJECT - ORACLE DATABASE
-- Run this AFTER creating all tables
-- ============================================

-- Clear existing data
DELETE FROM GPF_USR_DETAILS;
DELETE FROM GPF_YEARS;
DELETE FROM GPF;
DELETE FROM GPF_PURPOSE_E;
DELETE FROM GPF_PURPOSE_F;
DELETE FROM USERS;
COMMIT;

-- 1. INSERT TEST USERS
INSERT INTO users (id, user_id, username, password, work_status, dob, security_question_1, security_answer_1, security_question_2, security_answer_2, password_expiry_days, last_password_change_date) 
VALUES (user_sequence.NEXTVAL, 'WS001', 'testuser1', 'Test@123', 'OFFICER', TO_DATE('1985-05-15', 'YYYY-MM-DD'), 'What is your favorite color?', 'blue', 'What is your pet name?', 'tommy', 90, TO_DATE('2026-03-02', 'YYYY-MM-DD'));

INSERT INTO users (id, user_id, username, password, work_status, dob, security_question_1, security_answer_1, security_question_2, security_answer_2, password_expiry_days, last_password_change_date) 
VALUES (user_sequence.NEXTVAL, 'WS002', 'testuser2', 'Test@123', 'INDUSTRIAL', TO_DATE('1990-08-20', 'YYYY-MM-DD'), 'What is your favorite color?', 'red', 'What is your pet name?', 'milo', 90, TO_DATE('2026-03-02', 'YYYY-MM-DD'));

INSERT INTO users (id, user_id, username, password, work_status, dob, security_question_1, security_answer_1, security_question_2, security_answer_2, password_expiry_days, last_password_change_date) 
VALUES (user_sequence.NEXTVAL, 'WS003', 'testuser3', 'Test@123', 'NON_INDUSTRIAL', TO_DATE('1988-03-10', 'YYYY-MM-DD'), 'What is your favorite color?', 'green', 'What is your pet name?', 'buddy', 90, TO_DATE('2026-03-02', 'YYYY-MM-DD'));

-- 2. INSERT GPF RECORDS
INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER) 
VALUES (1001, 'WS001', 'Rajesh Kumar', 'Senior Scientist', TO_DATE('1985-05-15', 'YYYY-MM-DD'), TO_DATE('2045-05-15', 'YYYY-MM-DD'), 85000, '9876543210');

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER) 
VALUES (1002, 'WS002', 'Priya Sharma', 'Scientist B', TO_DATE('1990-08-20', 'YYYY-MM-DD'), TO_DATE('2050-08-20', 'YYYY-MM-DD'), 65000, '9876543211');

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER) 
VALUES (1003, 'WS003', 'Amit Patel', 'Technical Officer', TO_DATE('1988-03-10', 'YYYY-MM-DD'), TO_DATE('2048-03-10', 'YYYY-MM-DD'), 55000, '9876543212');

-- 3. INSERT GPF_YEARS RECORDS
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('WS001', 5.5, 669600.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('WS001', 6.5, 824688.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('WS002', 3.5, 427680.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('WS002', 4.5, 578534.40);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('WS003', 5.0, 540000.00);

-- 4. INSERT GPF_USR_DETAILS
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE) 
VALUES (50000, TO_DATE('2024-01-15', 'YYYY-MM-DD'), 'Y', 'F', '123 Main Street, Delhi', 1001, 1);

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE) 
VALUES (25000, TO_DATE('2024-02-10', 'YYYY-MM-DD'), 'N', 'E', '456 Park Avenue, Bangalore', 1002, 1);

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE) 
VALUES (75000, TO_DATE('2024-03-05', 'YYYY-MM-DD'), 'Y', 'F', '789 Lake Road, Hyderabad', 1003, 2);

-- 5. INSERT GPF_PURPOSE_F
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (1, 'House Construction', 90, 'Rule F1');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (2, 'House Repair', 75, 'Rule F2');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (3, 'Purchase of Land', 80, 'Rule F3');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (4, 'Medical Emergency', 100, 'Rule F4');

-- 6. INSERT GPF_PURPOSE_E
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (1, 'Higher Studies', 60, 'Rule E1');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (2, 'School Fees', 50, 'Rule E2');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (3, 'Marriage Expenses', 70, 'Rule E3');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (4, 'Medical Treatment', 100, 'Rule E4');

-- COMMIT ALL CHANGES
COMMIT;

-- Verify data inserted
SELECT 'Data inserted successfully!' AS STATUS FROM DUAL;
SELECT 'USERS: ' || COUNT(*) || ' records' AS INFO FROM USERS
UNION ALL
SELECT 'GPF: ' || COUNT(*) || ' records' FROM GPF
UNION ALL
SELECT 'GPF_YEARS: ' || COUNT(*) || ' records' FROM GPF_YEARS
UNION ALL
SELECT 'GPF_PURPOSE_F: ' || COUNT(*) || ' records' FROM GPF_PURPOSE_F
UNION ALL
SELECT 'GPF_PURPOSE_E: ' || COUNT(*) || ' records' FROM GPF_PURPOSE_E
UNION ALL
SELECT 'GPF_USR_DETAILS: ' || COUNT(*) || ' records' FROM GPF_USR_DETAILS;

-- Test Login Credentials
SELECT '=== TEST LOGIN CREDENTIALS ===' AS INFO FROM DUAL
UNION ALL
SELECT 'Username: WS001 | Password: Test@123' FROM DUAL
UNION ALL
SELECT 'Username: WS002 | Password: Test@123' FROM DUAL
UNION ALL
SELECT 'Username: WS003 | Password: Test@123' FROM DUAL;
