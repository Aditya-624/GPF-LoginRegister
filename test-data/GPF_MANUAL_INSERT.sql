-- ============================================================================
-- GPF TEST DATA - MANUAL INSERT FOR SQL DEVELOPER
-- Copy this entire file and paste into SQL Developer, then run it.
--
-- LOGIN CREDENTIALS (enter these in the React login form):
-- ┌──────────────────────────────────────────────────────────────────┐
-- │  userId   │ Password   │ Name                  │ Type           │
-- ├──────────────────────────────────────────────────────────────────┤
-- │  OFF001   │ Pass@1234  │ Rajesh Kumar Singh    │ OFFICER        │
-- │  OFF002   │ Pass@1234  │ Priya Sharma          │ OFFICER        │
-- │  OFF003   │ Pass@1234  │ Suresh Nair           │ OFFICER        │
-- │  IND001   │ Pass@1234  │ Amit Patel            │ INDUSTRIAL     │
-- │  IND002   │ Pass@1234  │ Neha Verma            │ INDUSTRIAL     │
-- │  IND003   │ Pass@1234  │ Ramesh Yadav          │ INDUSTRIAL     │
-- │  NIN001   │ Pass@1234  │ Vikram Desai          │ NON_INDUSTRIAL │
-- │  NIN002   │ Pass@1234  │ Anjali Gupta          │ NON_INDUSTRIAL │
-- │  NIN003   │ Pass@1234  │ Kavitha Reddy         │ NON_INDUSTRIAL │
-- │  NIN004   │ Pass@1234  │ Mohan Krishnan        │ NON_INDUSTRIAL │
-- └──────────────────────────────────────────────────────────────────┘
-- Security Q1: "What is your mother's maiden name?" → Answer: "test"
-- Security Q2: "What was the name of your first pet?"  → Answer: "test"
-- ============================================================================

-- ============================================================================
-- USERS (10 employees)
-- ============================================================================
INSERT INTO users (id, user_id, username, password, dob, work_status, last_password_change_date,
                   security_question_1, security_answer_1, security_question_2, security_answer_2,
                   password_expiry_days)
VALUES (1,'OFF001','Rajesh Kumar Singh','Pass@1234',TO_DATE('1980-05-15','YYYY-MM-DD'),'OFFICER',SYSDATE,
        'What is your mother''s maiden name?','test','What was the name of your first pet?','test',90);

INSERT INTO users (id, user_id, username, password, dob, work_status, last_password_change_date,
                   security_question_1, security_answer_1, security_question_2, security_answer_2,
                   password_expiry_days)
VALUES (2,'OFF002','Priya Sharma','Pass@1234',TO_DATE('1982-08-22','YYYY-MM-DD'),'OFFICER',SYSDATE,
        'What is your mother''s maiden name?','test','What was the name of your first pet?','test',90);

INSERT INTO users (id, user_id, username, password, dob, work_status, last_password_change_date,
                   security_question_1, security_answer_1, security_question_2, security_answer_2,
                   password_expiry_days)
VALUES (3,'IND001','Amit Patel','Pass@1234',TO_DATE('1985-03-10','YYYY-MM-DD'),'INDUSTRIAL',SYSDATE,
        'What is your mother''s maiden name?','test','What was the name of your first pet?','test',90);

INSERT INTO users (id, user_id, username, password, dob, work_status, last_password_change_date,
                   security_question_1, security_answer_1, security_question_2, security_answer_2,
                   password_expiry_days)
VALUES (4,'IND002','Neha Verma','Pass@1234',TO_DATE('1987-11-30','YYYY-MM-DD'),'INDUSTRIAL',SYSDATE,
        'What is your mother''s maiden name?','test','What was the name of your first pet?','test',90);

INSERT INTO users (id, user_id, username, password, dob, work_status, last_password_change_date,
                   security_question_1, security_answer_1, security_question_2, security_answer_2,
                   password_expiry_days)
VALUES (5,'NIN001','Vikram Desai','Pass@1234',TO_DATE('1988-07-18','YYYY-MM-DD'),'NON_INDUSTRIAL',SYSDATE,
        'What is your mother''s maiden name?','test','What was the name of your first pet?','test',90);

INSERT INTO users (id, user_id, username, password, dob, work_status, last_password_change_date,
                   security_question_1, security_answer_1, security_question_2, security_answer_2,
                   password_expiry_days)
VALUES (6,'NIN002','Anjali Gupta','Pass@1234',TO_DATE('1990-02-25','YYYY-MM-DD'),'NON_INDUSTRIAL',SYSDATE,
        'What is your mother''s maiden name?','test','What was the name of your first pet?','test',90);

INSERT INTO users (id, user_id, username, password, dob, work_status, last_password_change_date,
                   security_question_1, security_answer_1, security_question_2, security_answer_2,
                   password_expiry_days)
VALUES (7,'OFF003','Suresh Nair','Pass@1234',TO_DATE('1979-11-12','YYYY-MM-DD'),'OFFICER',SYSDATE,
        'What is your mother''s maiden name?','test','What was the name of your first pet?','test',90);

INSERT INTO users (id, user_id, username, password, dob, work_status, last_password_change_date,
                   security_question_1, security_answer_1, security_question_2, security_answer_2,
                   password_expiry_days)
VALUES (8,'IND003','Ramesh Yadav','Pass@1234',TO_DATE('1983-06-20','YYYY-MM-DD'),'INDUSTRIAL',SYSDATE,
        'What is your mother''s maiden name?','test','What was the name of your first pet?','test',90);

INSERT INTO users (id, user_id, username, password, dob, work_status, last_password_change_date,
                   security_question_1, security_answer_1, security_question_2, security_answer_2,
                   password_expiry_days)
VALUES (9,'NIN003','Kavitha Reddy','Pass@1234',TO_DATE('1991-04-08','YYYY-MM-DD'),'NON_INDUSTRIAL',SYSDATE,
        'What is your mother''s maiden name?','test','What was the name of your first pet?','test',90);

INSERT INTO users (id, user_id, username, password, dob, work_status, last_password_change_date,
                   security_question_1, security_answer_1, security_question_2, security_answer_2,
                   password_expiry_days)
VALUES (10,'NIN004','Mohan Krishnan','Pass@1234',TO_DATE('1986-09-03','YYYY-MM-DD'),'NON_INDUSTRIAL',SYSDATE,
        'What is your mother''s maiden name?','test','What was the name of your first pet?','test',90);

COMMIT;

-- ============================================================================
-- GPF ACCOUNTS (10 employees, PERS_NUMBER = user_id, SERVICE_DATE filled)
-- ============================================================================
INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER, SERVICE_DATE)
VALUES (100001,'OFF001','Rajesh Kumar Singh','OFFICER',TO_DATE('1980-05-15','YYYY-MM-DD'),TO_DATE('2040-05-15','YYYY-MM-DD'),75000,'9876543210',TO_DATE('2005-06-01','YYYY-MM-DD'));

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER, SERVICE_DATE)
VALUES (100002,'OFF002','Priya Sharma','OFFICER',TO_DATE('1982-08-22','YYYY-MM-DD'),TO_DATE('2042-08-22','YYYY-MM-DD'),65000,'9876543211',TO_DATE('2007-09-01','YYYY-MM-DD'));

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER, SERVICE_DATE)
VALUES (100003,'IND001','Amit Patel','INDUSTRIAL Worker Grade A',TO_DATE('1985-03-10','YYYY-MM-DD'),TO_DATE('2045-03-10','YYYY-MM-DD'),45000,'9876543212',TO_DATE('2010-04-01','YYYY-MM-DD'));

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER, SERVICE_DATE)
VALUES (100004,'IND002','Neha Verma','INDUSTRIAL Worker Grade B',TO_DATE('1987-11-30','YYYY-MM-DD'),TO_DATE('2047-11-30','YYYY-MM-DD'),40000,'9876543213',TO_DATE('2012-01-01','YYYY-MM-DD'));

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER, SERVICE_DATE)
VALUES (100005,'NIN001','Vikram Desai','NON-INDUSTRIAL Staff',TO_DATE('1988-07-18','YYYY-MM-DD'),TO_DATE('2048-07-18','YYYY-MM-DD'),35000,'9876543214',TO_DATE('2013-07-01','YYYY-MM-DD'));

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER, SERVICE_DATE)
VALUES (100006,'NIN002','Anjali Gupta','NON-INDUSTRIAL Staff',TO_DATE('1990-02-25','YYYY-MM-DD'),TO_DATE('2050-02-25','YYYY-MM-DD'),30000,'9876543215',TO_DATE('2015-03-01','YYYY-MM-DD'));

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER, SERVICE_DATE)
VALUES (100007,'OFF003','Suresh Nair','OFFICER Deputy Director',TO_DATE('1979-11-12','YYYY-MM-DD'),TO_DATE('2039-11-12','YYYY-MM-DD'),82000,'9876543216',TO_DATE('2003-08-01','YYYY-MM-DD'));

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER, SERVICE_DATE)
VALUES (100008,'IND003','Ramesh Yadav','INDUSTRIAL Worker Grade A',TO_DATE('1983-06-20','YYYY-MM-DD'),TO_DATE('2043-06-20','YYYY-MM-DD'),42000,'9876543217',TO_DATE('2008-11-01','YYYY-MM-DD'));

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER, SERVICE_DATE)
VALUES (100009,'NIN003','Kavitha Reddy','NON-INDUSTRIAL Staff',TO_DATE('1991-04-08','YYYY-MM-DD'),TO_DATE('2051-04-08','YYYY-MM-DD'),28000,'9876543218',TO_DATE('2016-05-01','YYYY-MM-DD'));

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER, SERVICE_DATE)
VALUES (100010,'NIN004','Mohan Krishnan','NON-INDUSTRIAL Staff',TO_DATE('1986-09-03','YYYY-MM-DD'),TO_DATE('2046-09-03','YYYY-MM-DD'),32000,'9876543219',TO_DATE('2011-02-01','YYYY-MM-DD'));

COMMIT;

-- ============================================================================
-- GPF PURPOSE F & E (reference data)
-- ============================================================================
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (1,'House Construction',90,'Rule F1');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (2,'House Purchase',85,'Rule F2');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (3,'Education',50,'Rule F3');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (4,'Marriage',50,'Rule F4');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (5,'Medical Emergency',100,'Rule F5');

INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (1,'Emergency Medical',100,'Rule E1');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (2,'Education Loan',60,'Rule E2');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (3,'Home Repair',75,'Rule E3');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (4,'Vehicle Repair',40,'Rule E4');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (5,'Personal Loan',30,'Rule E5');

COMMIT;

-- ============================================================================
-- GPF_YEARS (2 year records per employee = 20 total)
-- PASS_NUMBER = PERS_NUMBER (user_id like OFF001) — matches what ReportsController queries
-- GPF_YEARS = actual calendar year (2022, 2023)
-- NOTE: ID is GENERATED ALWAYS AS IDENTITY — do NOT insert ID manually
-- ============================================================================
-- OFF001
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('OFF001', 2022, 275000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('OFF001', 2023, 550000.00);
-- OFF002
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('OFF002', 2022, 240000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('OFF002', 2023, 480000.00);
-- IND001
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('IND001', 2022, 135000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('IND001', 2023, 270000.00);
-- IND002
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('IND002', 2022, 120000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('IND002', 2023, 240000.00);
-- NIN001
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('NIN001', 2022,  87500.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('NIN001', 2023, 175000.00);
-- NIN002
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('NIN002', 2022,  50000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('NIN002', 2023, 100000.00);
-- OFF003
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('OFF003', 2022, 492000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('OFF003', 2023, 922500.00);
-- IND003
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('IND003', 2022, 176400.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('IND003', 2023, 327600.00);
-- NIN003
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('NIN003', 2022,  40320.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('NIN003', 2023,  80640.00);
-- NIN004
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('NIN004', 2022,  92160.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('NIN004', 2023, 184320.00);

COMMIT;

-- ============================================================================
-- GPF_USR_DETAILS — Applications (2 per employee = 20 total)
-- PERSNO = users.id (1-10)
-- PURPOSE codes: 1=House Building, 2=Education, 3=Marriage, 4=Medical, 5=Vehicle
-- GPF_TYPE: F=Final Withdrawal, E=Temporary Advance
-- ============================================================================
-- OFF001 (persno=1) — House Building (F) + Medical (E)
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (500000, TO_DATE('2024-01-15','YYYY-MM-DD'), 'Y', 'F', '123 Main Street, New Delhi', 1, 1);
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (150000, TO_DATE('2024-02-20','YYYY-MM-DD'), 'Y', 'E', NULL, 1, 4);
-- OFF002 (persno=2) — Medical (F) + Education (E)
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (200000, TO_DATE('2024-01-10','YYYY-MM-DD'), 'Y', 'F', NULL, 2, 4);
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (100000, TO_DATE('2024-03-05','YYYY-MM-DD'), 'N', 'E', NULL, 2, 2);
-- IND001 (persno=3) — House Building (F) + Education (E)
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (300000, TO_DATE('2024-01-25','YYYY-MM-DD'), 'Y', 'F', '456 Oak Avenue, Mumbai', 3, 1);
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (75000,  TO_DATE('2024-02-15','YYYY-MM-DD'), 'Y', 'E', NULL, 3, 2);
-- IND002 (persno=4) — Vehicle (E) + Marriage (F)
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (120000, TO_DATE('2024-01-30','YYYY-MM-DD'), 'N', 'E', NULL, 4, 5);
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (250000, TO_DATE('2024-03-10','YYYY-MM-DD'), 'Y', 'F', NULL, 4, 3);
-- NIN001 (persno=5) — Medical (E) + House Building (F)
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (50000,  TO_DATE('2024-02-05','YYYY-MM-DD'), 'N', 'E', NULL, 5, 4);
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (350000, TO_DATE('2024-03-15','YYYY-MM-DD'), 'Y', 'F', '789 Pine Road, Bangalore', 5, 1);
-- NIN002 (persno=6) — Education (F) + Vehicle (E)
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (100000, TO_DATE('2024-02-10','YYYY-MM-DD'), 'Y', 'F', NULL, 6, 2);
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (80000,  TO_DATE('2024-03-20','YYYY-MM-DD'), 'N', 'E', NULL, 6, 5);
-- OFF003 (persno=7) — House Building (F) + Education (E)
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (600000, TO_DATE('2024-01-08','YYYY-MM-DD'), 'Y', 'F', '22 Residency Road, Chennai', 7, 1);
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (180000, TO_DATE('2024-02-12','YYYY-MM-DD'), 'Y', 'E', NULL, 7, 2);
-- IND003 (persno=8) — House Building (F) + Medical (E)
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (200000, TO_DATE('2024-01-18','YYYY-MM-DD'), 'Y', 'F', '5 Gandhi Nagar, Hyderabad', 8, 1);
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (60000,  TO_DATE('2024-03-01','YYYY-MM-DD'), 'N', 'E', NULL, 8, 4);
-- NIN003 (persno=9) — Vehicle (E) + Education (F)
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (40000,  TO_DATE('2024-02-22','YYYY-MM-DD'), 'N', 'E', NULL, 9, 5);
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (80000,  TO_DATE('2024-03-18','YYYY-MM-DD'), 'Y', 'F', NULL, 9, 2);
-- NIN004 (persno=10) — Marriage (F) + Medical (E)
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (150000, TO_DATE('2024-01-28','YYYY-MM-DD'), 'Y', 'F', NULL, 10, 3);
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (55000,  TO_DATE('2024-03-08','YYYY-MM-DD'), 'N', 'E', NULL, 10, 4);

COMMIT;


-- ============================================================================
-- GPF_SANCTION_DETAILS (2 per employee = 20 total, ids 101-120)
-- All report fields filled: last_bill_no, last_bill_date, last_ccb_year
-- Type-E records also have: outstanding_advance, prev_sanction_date,
--   prev_payment_date, commencement_date
-- ============================================================================

-- OFF001 (id 101: Type F - House Construction, id 102: Type F - Education)
INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,house_addr,last_bill_no,last_bill_date,last_ccb_year)
VALUES (101,'OFF001','House Construction',TO_DATE('2024-01-15','YYYY-MM-DD'),TO_DATE('2024-01-25','YYYY-MM-DD'),450000,'House Construction','BILL001',TO_DATE('2024-01-25','YYYY-MM-DD'),TO_DATE('2024-02-01','YYYY-MM-DD'),12,500000,37500,TO_DATE('2024-02-01','YYYY-MM-DD'),'DV001','Approved',450000,275000,'123 Main Street, New Delhi','BILL-F001',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,last_bill_no,last_bill_date,last_ccb_year)
VALUES (102,'OFF001','Education',TO_DATE('2024-02-20','YYYY-MM-DD'),TO_DATE('2024-02-28','YYYY-MM-DD'),75000,'Education','BILL002',TO_DATE('2024-02-28','YYYY-MM-DD'),TO_DATE('2024-03-01','YYYY-MM-DD'),6,150000,12500,TO_DATE('2024-03-01','YYYY-MM-DD'),'DV002','Approved',75000,550000,'BILL-F002',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

-- OFF002 (id 103: Type F - Medical Emergency, id 104: Type E - Emergency Medical)
INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,last_bill_no,last_bill_date,last_ccb_year)
VALUES (103,'OFF002','Medical Emergency',TO_DATE('2024-01-10','YYYY-MM-DD'),TO_DATE('2024-01-15','YYYY-MM-DD'),200000,'Medical Emergency','BILL003',TO_DATE('2024-01-15','YYYY-MM-DD'),TO_DATE('2024-02-01','YYYY-MM-DD'),10,200000,20000,TO_DATE('2024-02-01','YYYY-MM-DD'),'DV003','Approved',200000,240000,'BILL-F003',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,outstanding_advance,prev_sanction_date,prev_payment_date,commencement_date,last_bill_no,last_bill_date,last_ccb_year)
VALUES (104,'OFF002','Emergency Medical',TO_DATE('2024-03-05','YYYY-MM-DD'),TO_DATE('2024-03-10','YYYY-MM-DD'),100000,'Emergency Medical','BILL004',TO_DATE('2024-03-10','YYYY-MM-DD'),TO_DATE('2024-03-15','YYYY-MM-DD'),5,100000,20000,TO_DATE('2024-03-15','YYYY-MM-DD'),'DV004','Approved',100000,480000,50000,TO_DATE('2023-06-01','YYYY-MM-DD'),TO_DATE('2023-07-01','YYYY-MM-DD'),TO_DATE('2024-04-01','YYYY-MM-DD'),'BILL-E004',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

-- IND001 (id 105: Type F - House Purchase, id 106: Type E - Home Repair)
INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,house_addr,last_bill_no,last_bill_date,last_ccb_year)
VALUES (105,'IND001','House Purchase',TO_DATE('2024-01-25','YYYY-MM-DD'),TO_DATE('2024-02-05','YYYY-MM-DD'),255000,'House Purchase','BILL005',TO_DATE('2024-02-05','YYYY-MM-DD'),TO_DATE('2024-02-15','YYYY-MM-DD'),15,300000,17000,TO_DATE('2024-02-15','YYYY-MM-DD'),'DV005','Approved',255000,135000,'456 Oak Avenue, Mumbai','BILL-F005',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,outstanding_advance,prev_sanction_date,prev_payment_date,commencement_date,last_bill_no,last_bill_date,last_ccb_year)
VALUES (106,'IND001','Home Repair',TO_DATE('2024-02-15','YYYY-MM-DD'),TO_DATE('2024-02-20','YYYY-MM-DD'),56250,'Home Repair','BILL006',TO_DATE('2024-02-20','YYYY-MM-DD'),TO_DATE('2024-03-01','YYYY-MM-DD'),6,75000,9375,TO_DATE('2024-03-01','YYYY-MM-DD'),'DV006','Approved',56250,270000,20000,TO_DATE('2023-05-01','YYYY-MM-DD'),TO_DATE('2023-06-01','YYYY-MM-DD'),TO_DATE('2024-03-15','YYYY-MM-DD'),'BILL-E006',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

-- IND002 (id 107: Type F - Marriage, id 108: Type E - Education Loan)
INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,last_bill_no,last_bill_date,last_ccb_year)
VALUES (107,'IND002','Marriage',TO_DATE('2024-01-30','YYYY-MM-DD'),TO_DATE('2024-02-10','YYYY-MM-DD'),125000,'Marriage','BILL007',TO_DATE('2024-02-10','YYYY-MM-DD'),TO_DATE('2024-02-20','YYYY-MM-DD'),8,250000,15625,TO_DATE('2024-02-20','YYYY-MM-DD'),'DV007','Approved',125000,120000,'BILL-F007',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,outstanding_advance,prev_sanction_date,prev_payment_date,commencement_date,last_bill_no,last_bill_date,last_ccb_year)
VALUES (108,'IND002','Education Loan',TO_DATE('2024-03-10','YYYY-MM-DD'),TO_DATE('2024-03-15','YYYY-MM-DD'),72000,'Education Loan','BILL008',TO_DATE('2024-03-15','YYYY-MM-DD'),TO_DATE('2024-03-20','YYYY-MM-DD'),6,120000,12000,TO_DATE('2024-03-20','YYYY-MM-DD'),'DV008','Approved',72000,240000,30000,TO_DATE('2023-04-01','YYYY-MM-DD'),TO_DATE('2023-05-01','YYYY-MM-DD'),TO_DATE('2024-04-01','YYYY-MM-DD'),'BILL-E008',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

-- NIN001 (id 109: Type F - House Construction, id 110: Type E - Vehicle Repair)
INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,house_addr,last_bill_no,last_bill_date,last_ccb_year)
VALUES (109,'NIN001','House Construction',TO_DATE('2024-02-05','YYYY-MM-DD'),TO_DATE('2024-02-15','YYYY-MM-DD'),315000,'House Construction','BILL009',TO_DATE('2024-02-15','YYYY-MM-DD'),TO_DATE('2024-02-25','YYYY-MM-DD'),12,350000,26250,TO_DATE('2024-02-25','YYYY-MM-DD'),'DV009','Approved',315000,87500,'789 Pine Road, Bangalore','BILL-F009',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,outstanding_advance,prev_sanction_date,prev_payment_date,commencement_date,last_bill_no,last_bill_date,last_ccb_year)
VALUES (110,'NIN001','Vehicle Repair',TO_DATE('2024-03-15','YYYY-MM-DD'),TO_DATE('2024-03-18','YYYY-MM-DD'),20000,'Vehicle Repair','BILL010',TO_DATE('2024-03-18','YYYY-MM-DD'),TO_DATE('2024-03-25','YYYY-MM-DD'),4,50000,5000,TO_DATE('2024-03-25','YYYY-MM-DD'),'DV010','Approved',20000,175000,10000,TO_DATE('2023-03-01','YYYY-MM-DD'),TO_DATE('2023-04-01','YYYY-MM-DD'),TO_DATE('2024-04-01','YYYY-MM-DD'),'BILL-E010',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

-- NIN002 (id 111: Type F - Education, id 112: Type E - Personal Loan)
INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,last_bill_no,last_bill_date,last_ccb_year)
VALUES (111,'NIN002','Education',TO_DATE('2024-02-10','YYYY-MM-DD'),TO_DATE('2024-02-18','YYYY-MM-DD'),50000,'Education','BILL011',TO_DATE('2024-02-18','YYYY-MM-DD'),TO_DATE('2024-02-25','YYYY-MM-DD'),5,100000,10000,TO_DATE('2024-02-25','YYYY-MM-DD'),'DV011','Approved',50000,50000,'BILL-F011',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,outstanding_advance,prev_sanction_date,prev_payment_date,commencement_date,last_bill_no,last_bill_date,last_ccb_year)
VALUES (112,'NIN002','Personal Loan',TO_DATE('2024-03-20','YYYY-MM-DD'),TO_DATE('2024-03-22','YYYY-MM-DD'),24000,'Personal Loan','BILL012',TO_DATE('2024-03-22','YYYY-MM-DD'),TO_DATE('2024-03-28','YYYY-MM-DD'),4,80000,6000,TO_DATE('2024-03-28','YYYY-MM-DD'),'DV012','Approved',24000,100000,12000,TO_DATE('2023-02-01','YYYY-MM-DD'),TO_DATE('2023-03-01','YYYY-MM-DD'),TO_DATE('2024-04-01','YYYY-MM-DD'),'BILL-E012',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

-- OFF003 (id 113: Type F - House Construction, id 114: Type E - Education Loan)
INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,house_addr,last_bill_no,last_bill_date,last_ccb_year)
VALUES (113,'OFF003','House Construction',TO_DATE('2024-01-08','YYYY-MM-DD'),TO_DATE('2024-01-18','YYYY-MM-DD'),540000,'House Construction','BILL013',TO_DATE('2024-01-18','YYYY-MM-DD'),TO_DATE('2024-02-01','YYYY-MM-DD'),18,600000,30000,TO_DATE('2024-02-01','YYYY-MM-DD'),'DV013','Approved',540000,492000,'22 Residency Road, Chennai','BILL-F013',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,outstanding_advance,prev_sanction_date,prev_payment_date,commencement_date,last_bill_no,last_bill_date,last_ccb_year)
VALUES (114,'OFF003','Education Loan',TO_DATE('2024-02-12','YYYY-MM-DD'),TO_DATE('2024-02-20','YYYY-MM-DD'),108000,'Education Loan','BILL014',TO_DATE('2024-02-20','YYYY-MM-DD'),TO_DATE('2024-03-01','YYYY-MM-DD'),6,180000,18000,TO_DATE('2024-03-01','YYYY-MM-DD'),'DV014','Approved',108000,922500,60000,TO_DATE('2023-07-01','YYYY-MM-DD'),TO_DATE('2023-08-01','YYYY-MM-DD'),TO_DATE('2024-03-15','YYYY-MM-DD'),'BILL-E014',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

-- IND003 (id 115: Type F - House Purchase, id 116: Type E - Home Repair)
INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,house_addr,last_bill_no,last_bill_date,last_ccb_year)
VALUES (115,'IND003','House Purchase',TO_DATE('2024-01-18','YYYY-MM-DD'),TO_DATE('2024-01-28','YYYY-MM-DD'),170000,'House Purchase','BILL015',TO_DATE('2024-01-28','YYYY-MM-DD'),TO_DATE('2024-02-10','YYYY-MM-DD'),12,200000,14167,TO_DATE('2024-02-10','YYYY-MM-DD'),'DV015','Approved',170000,176400,'5 Gandhi Nagar, Hyderabad','BILL-F015',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,outstanding_advance,prev_sanction_date,prev_payment_date,commencement_date,last_bill_no,last_bill_date,last_ccb_year)
VALUES (116,'IND003','Home Repair',TO_DATE('2024-03-01','YYYY-MM-DD'),TO_DATE('2024-03-08','YYYY-MM-DD'),45000,'Home Repair','BILL016',TO_DATE('2024-03-08','YYYY-MM-DD'),TO_DATE('2024-03-15','YYYY-MM-DD'),5,60000,9000,TO_DATE('2024-03-15','YYYY-MM-DD'),'DV016','Approved',45000,327600,18000,TO_DATE('2023-05-01','YYYY-MM-DD'),TO_DATE('2023-06-01','YYYY-MM-DD'),TO_DATE('2024-04-01','YYYY-MM-DD'),'BILL-E016',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

-- NIN003 (id 117: Type F - Education, id 118: Type E - Vehicle Repair)
INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,last_bill_no,last_bill_date,last_ccb_year)
VALUES (117,'NIN003','Education',TO_DATE('2024-02-22','YYYY-MM-DD'),TO_DATE('2024-03-01','YYYY-MM-DD'),40000,'Education','BILL017',TO_DATE('2024-03-01','YYYY-MM-DD'),TO_DATE('2024-03-10','YYYY-MM-DD'),5,80000,8000,TO_DATE('2024-03-10','YYYY-MM-DD'),'DV017','Approved',40000,40320,'BILL-F017',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,outstanding_advance,prev_sanction_date,prev_payment_date,commencement_date,last_bill_no,last_bill_date,last_ccb_year)
VALUES (118,'NIN003','Vehicle Repair',TO_DATE('2024-03-18','YYYY-MM-DD'),TO_DATE('2024-03-22','YYYY-MM-DD'),16000,'Vehicle Repair','BILL018',TO_DATE('2024-03-22','YYYY-MM-DD'),TO_DATE('2024-04-01','YYYY-MM-DD'),4,40000,4000,TO_DATE('2024-04-01','YYYY-MM-DD'),'DV018','Approved',16000,80640,8000,TO_DATE('2023-03-01','YYYY-MM-DD'),TO_DATE('2023-04-01','YYYY-MM-DD'),TO_DATE('2024-04-15','YYYY-MM-DD'),'BILL-E018',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

-- NIN004 (id 119: Type F - Marriage, id 120: Type E - Emergency Medical)
INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,last_bill_no,last_bill_date,last_ccb_year)
VALUES (119,'NIN004','Marriage',TO_DATE('2024-01-28','YYYY-MM-DD'),TO_DATE('2024-02-05','YYYY-MM-DD'),75000,'Marriage','BILL019',TO_DATE('2024-02-05','YYYY-MM-DD'),TO_DATE('2024-02-15','YYYY-MM-DD'),6,150000,12500,TO_DATE('2024-02-15','YYYY-MM-DD'),'DV019','Approved',75000,92160,'BILL-F019',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

INSERT INTO gpf_sanction_details (id,pers_no,gpf_loan_type,application_date,sanction_date,sanction_amount,purpose,bill_no,bill_date,recovery_from_date,no_of_installments,applied_amount,instl_amount,dv_date,dv_no,remarks,tot_dv_amt,prev_bal,outstanding_advance,prev_sanction_date,prev_payment_date,commencement_date,last_bill_no,last_bill_date,last_ccb_year)
VALUES (120,'NIN004','Emergency Medical',TO_DATE('2024-03-08','YYYY-MM-DD'),TO_DATE('2024-03-12','YYYY-MM-DD'),27500,'Emergency Medical','BILL020',TO_DATE('2024-03-12','YYYY-MM-DD'),TO_DATE('2024-03-20','YYYY-MM-DD'),4,55000,6875,TO_DATE('2024-03-20','YYYY-MM-DD'),'DV020','Approved',27500,184320,15000,TO_DATE('2023-04-01','YYYY-MM-DD'),TO_DATE('2023-05-01','YYYY-MM-DD'),TO_DATE('2024-04-01','YYYY-MM-DD'),'BILL-E020',TO_DATE('2023-06-30','YYYY-MM-DD'),'2022-23');

COMMIT;


-- ============================================================================
-- GPF_SUB_DETAILS — Monthly subscription + refund records (Mar–Sep 2023)
-- gpfSub = ~12% of basic pay | gpfRet = advance refund instalment
-- ============================================================================

-- OFF001 (basic 75000, gpfSub=9000, no advance refund)
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF001',TO_DATE('2023-03-01','YYYY-MM-DD'),9000.00,0.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF001',TO_DATE('2023-04-01','YYYY-MM-DD'),9000.00,0.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF001',TO_DATE('2023-05-01','YYYY-MM-DD'),9000.00,0.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF001',TO_DATE('2023-06-01','YYYY-MM-DD'),9000.00,0.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF001',TO_DATE('2023-07-01','YYYY-MM-DD'),9000.00,0.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF001',TO_DATE('2023-08-01','YYYY-MM-DD'),9000.00,0.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF001',TO_DATE('2023-09-01','YYYY-MM-DD'),9000.00,0.00);

-- OFF002 (basic 65000, gpfSub=7800, advance refund=10000/month)
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF002',TO_DATE('2023-03-01','YYYY-MM-DD'),7800.00,10000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF002',TO_DATE('2023-04-01','YYYY-MM-DD'),7800.00,10000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF002',TO_DATE('2023-05-01','YYYY-MM-DD'),7800.00,10000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF002',TO_DATE('2023-06-01','YYYY-MM-DD'),7800.00,10000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF002',TO_DATE('2023-07-01','YYYY-MM-DD'),7800.00,10000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF002',TO_DATE('2023-08-01','YYYY-MM-DD'),7800.00,10000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF002',TO_DATE('2023-09-01','YYYY-MM-DD'),7800.00,10000.00);

-- IND001 (basic 45000, gpfSub=5400, advance refund=5000/month)
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND001',TO_DATE('2023-03-01','YYYY-MM-DD'),5400.00,5000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND001',TO_DATE('2023-04-01','YYYY-MM-DD'),5400.00,5000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND001',TO_DATE('2023-05-01','YYYY-MM-DD'),5400.00,5000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND001',TO_DATE('2023-06-01','YYYY-MM-DD'),5400.00,5000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND001',TO_DATE('2023-07-01','YYYY-MM-DD'),5400.00,5000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND001',TO_DATE('2023-08-01','YYYY-MM-DD'),5400.00,5000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND001',TO_DATE('2023-09-01','YYYY-MM-DD'),5400.00,5000.00);

-- IND002 (basic 40000, gpfSub=4800, advance refund=6000/month)
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND002',TO_DATE('2023-03-01','YYYY-MM-DD'),4800.00,6000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND002',TO_DATE('2023-04-01','YYYY-MM-DD'),4800.00,6000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND002',TO_DATE('2023-05-01','YYYY-MM-DD'),4800.00,6000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND002',TO_DATE('2023-06-01','YYYY-MM-DD'),4800.00,6000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND002',TO_DATE('2023-07-01','YYYY-MM-DD'),4800.00,6000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND002',TO_DATE('2023-08-01','YYYY-MM-DD'),4800.00,6000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND002',TO_DATE('2023-09-01','YYYY-MM-DD'),4800.00,6000.00);

-- NIN001 (basic 35000, gpfSub=4200, advance refund=5000/month)
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN001',TO_DATE('2023-03-01','YYYY-MM-DD'),4200.00,5000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN001',TO_DATE('2023-04-01','YYYY-MM-DD'),4200.00,5000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN001',TO_DATE('2023-05-01','YYYY-MM-DD'),4200.00,5000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN001',TO_DATE('2023-06-01','YYYY-MM-DD'),4200.00,5000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN001',TO_DATE('2023-07-01','YYYY-MM-DD'),4200.00,5000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN001',TO_DATE('2023-08-01','YYYY-MM-DD'),4200.00,5000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN001',TO_DATE('2023-09-01','YYYY-MM-DD'),4200.00,5000.00);

-- NIN002 (basic 30000, gpfSub=3600, advance refund=4000/month)
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN002',TO_DATE('2023-03-01','YYYY-MM-DD'),3600.00,4000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN002',TO_DATE('2023-04-01','YYYY-MM-DD'),3600.00,4000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN002',TO_DATE('2023-05-01','YYYY-MM-DD'),3600.00,4000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN002',TO_DATE('2023-06-01','YYYY-MM-DD'),3600.00,4000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN002',TO_DATE('2023-07-01','YYYY-MM-DD'),3600.00,4000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN002',TO_DATE('2023-08-01','YYYY-MM-DD'),3600.00,4000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN002',TO_DATE('2023-09-01','YYYY-MM-DD'),3600.00,4000.00);

-- OFF003 (basic 82000, gpfSub=9840, advance refund=12000/month)
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF003',TO_DATE('2023-03-01','YYYY-MM-DD'),9840.00,12000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF003',TO_DATE('2023-04-01','YYYY-MM-DD'),9840.00,12000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF003',TO_DATE('2023-05-01','YYYY-MM-DD'),9840.00,12000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF003',TO_DATE('2023-06-01','YYYY-MM-DD'),9840.00,12000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF003',TO_DATE('2023-07-01','YYYY-MM-DD'),9840.00,12000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF003',TO_DATE('2023-08-01','YYYY-MM-DD'),9840.00,12000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('OFF003',TO_DATE('2023-09-01','YYYY-MM-DD'),9840.00,12000.00);

-- IND003 (basic 42000, gpfSub=5040, advance refund=5500/month)
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND003',TO_DATE('2023-03-01','YYYY-MM-DD'),5040.00,5500.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND003',TO_DATE('2023-04-01','YYYY-MM-DD'),5040.00,5500.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND003',TO_DATE('2023-05-01','YYYY-MM-DD'),5040.00,5500.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND003',TO_DATE('2023-06-01','YYYY-MM-DD'),5040.00,5500.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND003',TO_DATE('2023-07-01','YYYY-MM-DD'),5040.00,5500.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND003',TO_DATE('2023-08-01','YYYY-MM-DD'),5040.00,5500.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('IND003',TO_DATE('2023-09-01','YYYY-MM-DD'),5040.00,5500.00);

-- NIN003 (basic 28000, gpfSub=3360, advance refund=3000/month)
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN003',TO_DATE('2023-03-01','YYYY-MM-DD'),3360.00,3000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN003',TO_DATE('2023-04-01','YYYY-MM-DD'),3360.00,3000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN003',TO_DATE('2023-05-01','YYYY-MM-DD'),3360.00,3000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN003',TO_DATE('2023-06-01','YYYY-MM-DD'),3360.00,3000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN003',TO_DATE('2023-07-01','YYYY-MM-DD'),3360.00,3000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN003',TO_DATE('2023-08-01','YYYY-MM-DD'),3360.00,3000.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN003',TO_DATE('2023-09-01','YYYY-MM-DD'),3360.00,3000.00);

-- NIN004 (basic 32000, gpfSub=3840, advance refund=4500/month)
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN004',TO_DATE('2023-03-01','YYYY-MM-DD'),3840.00,4500.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN004',TO_DATE('2023-04-01','YYYY-MM-DD'),3840.00,4500.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN004',TO_DATE('2023-05-01','YYYY-MM-DD'),3840.00,4500.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN004',TO_DATE('2023-06-01','YYYY-MM-DD'),3840.00,4500.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN004',TO_DATE('2023-07-01','YYYY-MM-DD'),3840.00,4500.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN004',TO_DATE('2023-08-01','YYYY-MM-DD'),3840.00,4500.00);
INSERT INTO GPF_SUB_DETAILS (PERS_NUMBER, ADD_SUB_DATE, GPF_SUB, GPF_RET) VALUES ('NIN004',TO_DATE('2023-09-01','YYYY-MM-DD'),3840.00,4500.00);

COMMIT;
