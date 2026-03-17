-- ============================================================================
-- GPF TEST DATA - MANUAL INSERT FOR SQL DEVELOPER
-- Copy this entire file and paste into SQL Developer, then run it.
--
-- LOGIN CREDENTIALS (enter these in the React login form):
-- ┌─────────────────────────────────────────────────────────────┐
-- │  userId   │ Password   │ Name                │ Type        │
-- ├─────────────────────────────────────────────────────────────┤
-- │  OFF001   │ Pass@1234  │ Rajesh Kumar Singh  │ OFFICER     │
-- │  OFF002   │ Pass@1234  │ Priya Sharma        │ OFFICER     │
-- │  IND001   │ Pass@1234  │ Amit Patel          │ INDUSTRIAL  │
-- │  IND002   │ Pass@1234  │ Neha Verma          │ INDUSTRIAL  │
-- │  NIN001   │ Pass@1234  │ Vikram Desai        │ NON_INDUST. │
-- │  NIN002   │ Pass@1234  │ Anjali Gupta        │ NON_INDUST. │
-- └─────────────────────────────────────────────────────────────┘
-- ============================================================================

-- USERS
INSERT INTO users (id, user_id, username, password, dob, work_status, last_password_change_date)
VALUES (1, 'OFF001', 'Rajesh Kumar Singh', 'Pass@1234', TO_DATE('1980-05-15','YYYY-MM-DD'), 'OFFICER', SYSDATE);

INSERT INTO users (id, user_id, username, password, dob, work_status, last_password_change_date)
VALUES (2, 'OFF002', 'Priya Sharma', 'Pass@1234', TO_DATE('1982-08-22','YYYY-MM-DD'), 'OFFICER', SYSDATE);

INSERT INTO users (id, user_id, username, password, dob, work_status, last_password_change_date)
VALUES (3, 'IND001', 'Amit Patel', 'Pass@1234', TO_DATE('1985-03-10','YYYY-MM-DD'), 'INDUSTRIAL', SYSDATE);

INSERT INTO users (id, user_id, username, password, dob, work_status, last_password_change_date)
VALUES (4, 'IND002', 'Neha Verma', 'Pass@1234', TO_DATE('1987-11-30','YYYY-MM-DD'), 'INDUSTRIAL', SYSDATE);

INSERT INTO users (id, user_id, username, password, dob, work_status, last_password_change_date)
VALUES (5, 'NIN001', 'Vikram Desai', 'Pass@1234', TO_DATE('1988-07-18','YYYY-MM-DD'), 'NON_INDUSTRIAL', SYSDATE);

INSERT INTO users (id, user_id, username, password, dob, work_status, last_password_change_date)
VALUES (6, 'NIN002', 'Anjali Gupta', 'Pass@1234', TO_DATE('1990-02-25','YYYY-MM-DD'), 'NON_INDUSTRIAL', SYSDATE);

COMMIT;

-- GPF ACCOUNTS (PERS_NUMBER = user_id so search works in React)
INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
VALUES (100001, 'OFF001', 'Rajesh Kumar Singh', 'Senior Officer', TO_DATE('1980-05-15','YYYY-MM-DD'), TO_DATE('2040-05-15','YYYY-MM-DD'), 75000, '9876543210');

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
VALUES (100002, 'OFF002', 'Priya Sharma', 'Officer Grade II', TO_DATE('1982-08-22','YYYY-MM-DD'), TO_DATE('2042-08-22','YYYY-MM-DD'), 65000, '9876543211');

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
VALUES (100003, 'IND001', 'Amit Patel', 'Industrial Worker Grade A', TO_DATE('1985-03-10','YYYY-MM-DD'), TO_DATE('2045-03-10','YYYY-MM-DD'), 45000, '9876543212');

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
VALUES (100004, 'IND002', 'Neha Verma', 'Industrial Worker Grade B', TO_DATE('1987-11-30','YYYY-MM-DD'), TO_DATE('2047-11-30','YYYY-MM-DD'), 40000, '9876543213');

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
VALUES (100005, 'NIN001', 'Vikram Desai', 'Contractual Staff', TO_DATE('1988-07-18','YYYY-MM-DD'), TO_DATE('2048-07-18','YYYY-MM-DD'), 35000, '9876543214');

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
VALUES (100006, 'NIN002', 'Anjali Gupta', 'Temporary Staff', TO_DATE('1990-02-25','YYYY-MM-DD'), TO_DATE('2050-02-25','YYYY-MM-DD'), 30000, '9876543215');

COMMIT;

-- GPF PURPOSE F
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (1, 'House Construction', 90, 'Rule F1');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (2, 'House Purchase', 85, 'Rule F2');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (3, 'Education', 50, 'Rule F3');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (4, 'Marriage', 50, 'Rule F4');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (5, 'Medical Emergency', 100, 'Rule F5');

-- GPF PURPOSE E
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (1, 'Emergency Medical', 100, 'Rule E1');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (2, 'Education Loan', 60, 'Rule E2');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (3, 'Home Repair', 75, 'Rule E3');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (4, 'Vehicle Repair', 40, 'Rule E4');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (5, 'Personal Loan', 30, 'Rule E5');

COMMIT;

-- GPF YEARS (2 per employee)
-- NOTE: ID is GENERATED ALWAYS AS IDENTITY — do NOT insert ID manually
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('OFF001-Y1', 5.5,  275000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('OFF001-Y2', 10.0, 550000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('OFF002-Y1', 6.0,  240000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('OFF002-Y2', 12.0, 480000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('IND001-Y1', 4.5,  135000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('IND001-Y2', 9.0,  270000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('IND002-Y1', 5.0,  120000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('IND002-Y2', 10.0, 240000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('NIN001-Y1', 3.5,  87500.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('NIN001-Y2', 7.0,  175000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('NIN002-Y1', 2.5,  50000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('NIN002-Y2', 5.0,  100000.00);

COMMIT;

-- GPF USER DETAILS - Applications (2 per employee)
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (500000, TO_DATE('2024-01-15','YYYY-MM-DD'), 'Y', 'F', '123 Main Street, New Delhi', 1, 1);

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (150000, TO_DATE('2024-02-20','YYYY-MM-DD'), 'Y', 'F', NULL, 1, 3);

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (200000, TO_DATE('2024-01-10','YYYY-MM-DD'), 'Y', 'F', NULL, 2, 5);

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (100000, TO_DATE('2024-03-05','YYYY-MM-DD'), 'N', 'E', NULL, 2, 1);

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (300000, TO_DATE('2024-01-25','YYYY-MM-DD'), 'Y', 'F', '456 Oak Avenue, Mumbai', 3, 2);

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (75000, TO_DATE('2024-02-15','YYYY-MM-DD'), 'Y', 'E', NULL, 3, 3);

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (250000, TO_DATE('2024-01-30','YYYY-MM-DD'), 'Y', 'F', NULL, 4, 4);

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (120000, TO_DATE('2024-03-10','YYYY-MM-DD'), 'N', 'E', NULL, 4, 2);

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (350000, TO_DATE('2024-02-05','YYYY-MM-DD'), 'Y', 'F', '789 Pine Road, Bangalore', 5, 1);

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (50000, TO_DATE('2024-03-15','YYYY-MM-DD'), 'N', 'E', NULL, 5, 4);

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (100000, TO_DATE('2024-02-10','YYYY-MM-DD'), 'Y', 'F', NULL, 6, 3);

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (80000, TO_DATE('2024-03-20','YYYY-MM-DD'), 'N', 'E', NULL, 6, 5);

COMMIT;

-- GPF SANCTION DETAILS (2 per employee)
INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal, house_addr)
VALUES (101,'OFF001','House Construction',TO_DATE('2024-01-15','YYYY-MM-DD'),TO_DATE('2024-01-25','YYYY-MM-DD'),450000,'House Construction','BILL001',TO_DATE('2024-01-25','YYYY-MM-DD'),TO_DATE('2024-02-01','YYYY-MM-DD'),12,500000,37500,TO_DATE('2024-02-01','YYYY-MM-DD'),'DV001','Approved',450000,275000,'123 Main Street, New Delhi');

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
VALUES (102,'OFF001','Education',TO_DATE('2024-02-20','YYYY-MM-DD'),TO_DATE('2024-02-28','YYYY-MM-DD'),75000,'Education','BILL002',TO_DATE('2024-02-28','YYYY-MM-DD'),TO_DATE('2024-03-01','YYYY-MM-DD'),6,150000,12500,TO_DATE('2024-03-01','YYYY-MM-DD'),'DV002','Approved',75000,550000);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
VALUES (103,'OFF002','Medical Emergency',TO_DATE('2024-01-10','YYYY-MM-DD'),TO_DATE('2024-01-15','YYYY-MM-DD'),200000,'Medical Emergency','BILL003',TO_DATE('2024-01-15','YYYY-MM-DD'),TO_DATE('2024-02-01','YYYY-MM-DD'),10,200000,20000,TO_DATE('2024-02-01','YYYY-MM-DD'),'DV003','Approved',200000,240000);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
VALUES (104,'OFF002','Emergency Medical',TO_DATE('2024-03-05','YYYY-MM-DD'),TO_DATE('2024-03-10','YYYY-MM-DD'),100000,'Emergency Medical','BILL004',TO_DATE('2024-03-10','YYYY-MM-DD'),TO_DATE('2024-03-15','YYYY-MM-DD'),5,100000,20000,TO_DATE('2024-03-15','YYYY-MM-DD'),'DV004','Approved',100000,480000);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal, house_addr)
VALUES (105,'IND001','House Purchase',TO_DATE('2024-01-25','YYYY-MM-DD'),TO_DATE('2024-02-05','YYYY-MM-DD'),255000,'House Purchase','BILL005',TO_DATE('2024-02-05','YYYY-MM-DD'),TO_DATE('2024-02-15','YYYY-MM-DD'),15,300000,17000,TO_DATE('2024-02-15','YYYY-MM-DD'),'DV005','Approved',255000,135000,'456 Oak Avenue, Mumbai');

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
VALUES (106,'IND001','Home Repair',TO_DATE('2024-02-15','YYYY-MM-DD'),TO_DATE('2024-02-20','YYYY-MM-DD'),56250,'Home Repair','BILL006',TO_DATE('2024-02-20','YYYY-MM-DD'),TO_DATE('2024-03-01','YYYY-MM-DD'),6,75000,9375,TO_DATE('2024-03-01','YYYY-MM-DD'),'DV006','Approved',56250,270000);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
VALUES (107,'IND002','Marriage',TO_DATE('2024-01-30','YYYY-MM-DD'),TO_DATE('2024-02-10','YYYY-MM-DD'),125000,'Marriage','BILL007',TO_DATE('2024-02-10','YYYY-MM-DD'),TO_DATE('2024-02-20','YYYY-MM-DD'),8,250000,15625,TO_DATE('2024-02-20','YYYY-MM-DD'),'DV007','Approved',125000,120000);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
VALUES (108,'IND002','Education Loan',TO_DATE('2024-03-10','YYYY-MM-DD'),TO_DATE('2024-03-15','YYYY-MM-DD'),72000,'Education Loan','BILL008',TO_DATE('2024-03-15','YYYY-MM-DD'),TO_DATE('2024-03-20','YYYY-MM-DD'),6,120000,12000,TO_DATE('2024-03-20','YYYY-MM-DD'),'DV008','Approved',72000,240000);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal, house_addr)
VALUES (109,'NIN001','House Construction',TO_DATE('2024-02-05','YYYY-MM-DD'),TO_DATE('2024-02-15','YYYY-MM-DD'),315000,'House Construction','BILL009',TO_DATE('2024-02-15','YYYY-MM-DD'),TO_DATE('2024-02-25','YYYY-MM-DD'),12,350000,26250,TO_DATE('2024-02-25','YYYY-MM-DD'),'DV009','Approved',315000,87500,'789 Pine Road, Bangalore');

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
VALUES (110,'NIN001','Vehicle Repair',TO_DATE('2024-03-15','YYYY-MM-DD'),TO_DATE('2024-03-18','YYYY-MM-DD'),20000,'Vehicle Repair','BILL010',TO_DATE('2024-03-18','YYYY-MM-DD'),TO_DATE('2024-03-25','YYYY-MM-DD'),4,50000,5000,TO_DATE('2024-03-25','YYYY-MM-DD'),'DV010','Approved',20000,175000);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
VALUES (111,'NIN002','Education',TO_DATE('2024-02-10','YYYY-MM-DD'),TO_DATE('2024-02-18','YYYY-MM-DD'),50000,'Education','BILL011',TO_DATE('2024-02-18','YYYY-MM-DD'),TO_DATE('2024-02-25','YYYY-MM-DD'),5,100000,10000,TO_DATE('2024-02-25','YYYY-MM-DD'),'DV011','Approved',50000,50000);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
VALUES (112,'NIN002','Personal Loan',TO_DATE('2024-03-20','YYYY-MM-DD'),TO_DATE('2024-03-22','YYYY-MM-DD'),24000,'Personal Loan','BILL012',TO_DATE('2024-03-22','YYYY-MM-DD'),TO_DATE('2024-03-28','YYYY-MM-DD'),4,80000,6000,TO_DATE('2024-03-28','YYYY-MM-DD'),'DV012','Approved',24000,100000);

COMMIT;

-- VERIFY (run these to confirm everything inserted correctly)
-- SELECT COUNT(*) FROM users WHERE user_id IN ('OFF001','OFF002','IND001','IND002','NIN001','NIN002');
-- SELECT COUNT(*) FROM GPF WHERE GPF_ACCOUNTNUMBER BETWEEN 100001 AND 100006;
-- SELECT COUNT(*) FROM GPF_YEARS WHERE PASS_NUMBER LIKE '%Y1' OR PASS_NUMBER LIKE '%Y2';
-- SELECT COUNT(*) FROM GPF_PURPOSE_F;
-- SELECT COUNT(*) FROM GPF_PURPOSE_E;
-- SELECT COUNT(*) FROM GPF_USR_DETAILS;
-- SELECT COUNT(*) FROM gpf_sanction_details WHERE id BETWEEN 101 AND 112;
-- Expected: 6, 6, 12, 5, 5, 12, 12
