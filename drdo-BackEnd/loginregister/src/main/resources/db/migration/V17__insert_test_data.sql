-- ============================================================================
-- V17: INSERT TEST DATA FOR 6 EMPLOYEES
-- Runs automatically when Spring Boot starts via Flyway
-- 2 Officers | 2 Industrial Staff | 2 Non-Industrial
--
-- LOGIN CREDENTIALS (use these in the React app):
--   userId: OFF001  password: Pass@1234  (Officer - Rajesh Kumar Singh)
--   userId: OFF002  password: Pass@1234  (Officer - Priya Sharma)
--   userId: IND001  password: Pass@1234  (Industrial - Amit Patel)
--   userId: IND002  password: Pass@1234  (Industrial - Neha Verma)
--   userId: NIN001  password: Pass@1234  (Non-Industrial - Vikram Desai)
--   userId: NIN002  password: Pass@1234  (Non-Industrial - Anjali Gupta)
-- ============================================================================

-- ============================================================================
-- USERS TABLE
-- ============================================================================

INSERT INTO users (user_id, username, password, dob, work_status, last_password_change_date)
SELECT 'OFF001','Rajesh Kumar Singh','Pass@1234',TO_DATE('1980-05-15','YYYY-MM-DD'),'OFFICER',SYSDATE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM users WHERE user_id = 'OFF001');

INSERT INTO users (user_id, username, password, dob, work_status, last_password_change_date)
SELECT 'OFF002','Priya Sharma','Pass@1234',TO_DATE('1982-08-22','YYYY-MM-DD'),'OFFICER',SYSDATE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM users WHERE user_id = 'OFF002');

INSERT INTO users (user_id, username, password, dob, work_status, last_password_change_date)
SELECT 'IND001','Amit Patel','Pass@1234',TO_DATE('1985-03-10','YYYY-MM-DD'),'INDUSTRIAL',SYSDATE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM users WHERE user_id = 'IND001');

INSERT INTO users (user_id, username, password, dob, work_status, last_password_change_date)
SELECT 'IND002','Neha Verma','Pass@1234',TO_DATE('1987-11-30','YYYY-MM-DD'),'INDUSTRIAL',SYSDATE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM users WHERE user_id = 'IND002');

INSERT INTO users (user_id, username, password, dob, work_status, last_password_change_date)
SELECT 'NIN001','Vikram Desai','Pass@1234',TO_DATE('1988-07-18','YYYY-MM-DD'),'NON_INDUSTRIAL',SYSDATE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM users WHERE user_id = 'NIN001');

INSERT INTO users (user_id, username, password, dob, work_status, last_password_change_date)
SELECT 'NIN002','Anjali Gupta','Pass@1234',TO_DATE('1990-02-25','YYYY-MM-DD'),'NON_INDUSTRIAL',SYSDATE
FROM dual WHERE NOT EXISTS (SELECT 1 FROM users WHERE user_id = 'NIN002');

-- ============================================================================
-- GPF TABLE (PERS_NUMBER matches user_id so search works from React)
-- ============================================================================

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
SELECT 100001,'OFF001','Rajesh Kumar Singh','Senior Officer',TO_DATE('1980-05-15','YYYY-MM-DD'),TO_DATE('2040-05-15','YYYY-MM-DD'),75000,'9876543210'
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF WHERE GPF_ACCOUNTNUMBER = 100001);

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
SELECT 100002,'OFF002','Priya Sharma','Officer Grade II',TO_DATE('1982-08-22','YYYY-MM-DD'),TO_DATE('2042-08-22','YYYY-MM-DD'),65000,'9876543211'
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF WHERE GPF_ACCOUNTNUMBER = 100002);

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
SELECT 100003,'IND001','Amit Patel','Industrial Worker Grade A',TO_DATE('1985-03-10','YYYY-MM-DD'),TO_DATE('2045-03-10','YYYY-MM-DD'),45000,'9876543212'
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF WHERE GPF_ACCOUNTNUMBER = 100003);

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
SELECT 100004,'IND002','Neha Verma','Industrial Worker Grade B',TO_DATE('1987-11-30','YYYY-MM-DD'),TO_DATE('2047-11-30','YYYY-MM-DD'),40000,'9876543213'
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF WHERE GPF_ACCOUNTNUMBER = 100004);

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
SELECT 100005,'NIN001','Vikram Desai','Contractual Staff',TO_DATE('1988-07-18','YYYY-MM-DD'),TO_DATE('2048-07-18','YYYY-MM-DD'),35000,'9876543214'
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF WHERE GPF_ACCOUNTNUMBER = 100005);

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
SELECT 100006,'NIN002','Anjali Gupta','Temporary Staff',TO_DATE('1990-02-25','YYYY-MM-DD'),TO_DATE('2050-02-25','YYYY-MM-DD'),30000,'9876543215'
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF WHERE GPF_ACCOUNTNUMBER = 100006);

-- ============================================================================
-- GPF_PURPOSE_F TABLE
-- ============================================================================

INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE)
SELECT 1,'House Construction',90,'Rule F1' FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_PURPOSE_F WHERE CODE = 1);

INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE)
SELECT 2,'House Purchase',85,'Rule F2' FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_PURPOSE_F WHERE CODE = 2);

INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE)
SELECT 3,'Education',50,'Rule F3' FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_PURPOSE_F WHERE CODE = 3);

INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE)
SELECT 4,'Marriage',50,'Rule F4' FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_PURPOSE_F WHERE CODE = 4);

INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE)
SELECT 5,'Medical Emergency',100,'Rule F5' FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_PURPOSE_F WHERE CODE = 5);

-- ============================================================================
-- GPF_PURPOSE_E TABLE
-- ============================================================================

INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE)
SELECT 1,'Emergency Medical',100,'Rule E1' FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_PURPOSE_E WHERE CODE = 1);

INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE)
SELECT 2,'Education Loan',60,'Rule E2' FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_PURPOSE_E WHERE CODE = 2);

INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE)
SELECT 3,'Home Repair',75,'Rule E3' FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_PURPOSE_E WHERE CODE = 3);

INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE)
SELECT 4,'Vehicle Repair',40,'Rule E4' FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_PURPOSE_E WHERE CODE = 4);

INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE)
SELECT 5,'Personal Loan',30,'Rule E5' FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_PURPOSE_E WHERE CODE = 5);

-- ============================================================================
-- GPF_YEARS TABLE (2 year records per employee)
-- ============================================================================

INSERT INTO GPF_YEARS (ID, PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
SELECT 101,'OFF001-Y1',5.5,275000.00 FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_YEARS WHERE ID = 101);

INSERT INTO GPF_YEARS (ID, PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
SELECT 102,'OFF001-Y2',10.0,550000.00 FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_YEARS WHERE ID = 102);

INSERT INTO GPF_YEARS (ID, PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
SELECT 103,'OFF002-Y1',6.0,240000.00 FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_YEARS WHERE ID = 103);

INSERT INTO GPF_YEARS (ID, PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
SELECT 104,'OFF002-Y2',12.0,480000.00 FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_YEARS WHERE ID = 104);

INSERT INTO GPF_YEARS (ID, PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
SELECT 105,'IND001-Y1',4.5,135000.00 FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_YEARS WHERE ID = 105);

INSERT INTO GPF_YEARS (ID, PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
SELECT 106,'IND001-Y2',9.0,270000.00 FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_YEARS WHERE ID = 106);

INSERT INTO GPF_YEARS (ID, PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
SELECT 107,'IND002-Y1',5.0,120000.00 FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_YEARS WHERE ID = 107);

INSERT INTO GPF_YEARS (ID, PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
SELECT 108,'IND002-Y2',10.0,240000.00 FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_YEARS WHERE ID = 108);

INSERT INTO GPF_YEARS (ID, PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
SELECT 109,'NIN001-Y1',3.5,87500.00 FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_YEARS WHERE ID = 109);

INSERT INTO GPF_YEARS (ID, PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
SELECT 110,'NIN001-Y2',7.0,175000.00 FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_YEARS WHERE ID = 110);

INSERT INTO GPF_YEARS (ID, PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
SELECT 111,'NIN002-Y1',2.5,50000.00 FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_YEARS WHERE ID = 111);

INSERT INTO GPF_YEARS (ID, PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
SELECT 112,'NIN002-Y2',5.0,100000.00 FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_YEARS WHERE ID = 112);

-- ============================================================================
-- GPF_USR_DETAILS TABLE (2 applications per employee)
-- ============================================================================

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
SELECT 500000,TO_DATE('2024-01-15','YYYY-MM-DD'),'Y','F','123 Main Street, New Delhi',1,1
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_USR_DETAILS WHERE PERSNO=1 AND APPL_DATE=TO_DATE('2024-01-15','YYYY-MM-DD'));

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
SELECT 150000,TO_DATE('2024-02-20','YYYY-MM-DD'),'Y','F',NULL,1,3
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_USR_DETAILS WHERE PERSNO=1 AND APPL_DATE=TO_DATE('2024-02-20','YYYY-MM-DD'));

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
SELECT 200000,TO_DATE('2024-01-10','YYYY-MM-DD'),'Y','F',NULL,2,5
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_USR_DETAILS WHERE PERSNO=2 AND APPL_DATE=TO_DATE('2024-01-10','YYYY-MM-DD'));

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
SELECT 100000,TO_DATE('2024-03-05','YYYY-MM-DD'),'N','E',NULL,2,1
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_USR_DETAILS WHERE PERSNO=2 AND APPL_DATE=TO_DATE('2024-03-05','YYYY-MM-DD'));

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
SELECT 300000,TO_DATE('2024-01-25','YYYY-MM-DD'),'Y','F','456 Oak Avenue, Mumbai',3,2
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_USR_DETAILS WHERE PERSNO=3 AND APPL_DATE=TO_DATE('2024-01-25','YYYY-MM-DD'));

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
SELECT 75000,TO_DATE('2024-02-15','YYYY-MM-DD'),'Y','E',NULL,3,3
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_USR_DETAILS WHERE PERSNO=3 AND APPL_DATE=TO_DATE('2024-02-15','YYYY-MM-DD'));

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
SELECT 250000,TO_DATE('2024-01-30','YYYY-MM-DD'),'Y','F',NULL,4,4
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_USR_DETAILS WHERE PERSNO=4 AND APPL_DATE=TO_DATE('2024-01-30','YYYY-MM-DD'));

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
SELECT 120000,TO_DATE('2024-03-10','YYYY-MM-DD'),'N','E',NULL,4,2
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_USR_DETAILS WHERE PERSNO=4 AND APPL_DATE=TO_DATE('2024-03-10','YYYY-MM-DD'));

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
SELECT 350000,TO_DATE('2024-02-05','YYYY-MM-DD'),'Y','F','789 Pine Road, Bangalore',5,1
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_USR_DETAILS WHERE PERSNO=5 AND APPL_DATE=TO_DATE('2024-02-05','YYYY-MM-DD'));

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
SELECT 50000,TO_DATE('2024-03-15','YYYY-MM-DD'),'N','E',NULL,5,4
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_USR_DETAILS WHERE PERSNO=5 AND APPL_DATE=TO_DATE('2024-03-15','YYYY-MM-DD'));

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
SELECT 100000,TO_DATE('2024-02-10','YYYY-MM-DD'),'Y','F',NULL,6,3
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_USR_DETAILS WHERE PERSNO=6 AND APPL_DATE=TO_DATE('2024-02-10','YYYY-MM-DD'));

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
SELECT 80000,TO_DATE('2024-03-20','YYYY-MM-DD'),'N','E',NULL,6,5
FROM dual WHERE NOT EXISTS (SELECT 1 FROM GPF_USR_DETAILS WHERE PERSNO=6 AND APPL_DATE=TO_DATE('2024-03-20','YYYY-MM-DD'));

-- ============================================================================
-- GPF_SANCTION_DETAILS TABLE (2 sanctions per employee)
-- ============================================================================

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal, house_addr)
SELECT 101,'OFF001','House Construction',TO_DATE('2024-01-15','YYYY-MM-DD'),TO_DATE('2024-01-25','YYYY-MM-DD'),450000,'House Construction','BILL001',TO_DATE('2024-01-25','YYYY-MM-DD'),TO_DATE('2024-02-01','YYYY-MM-DD'),12,500000,37500,TO_DATE('2024-02-01','YYYY-MM-DD'),'DV001','Approved',450000,275000,'123 Main Street, New Delhi'
FROM dual WHERE NOT EXISTS (SELECT 1 FROM gpf_sanction_details WHERE id = 101);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
SELECT 102,'OFF001','Education',TO_DATE('2024-02-20','YYYY-MM-DD'),TO_DATE('2024-02-28','YYYY-MM-DD'),75000,'Education','BILL002',TO_DATE('2024-02-28','YYYY-MM-DD'),TO_DATE('2024-03-01','YYYY-MM-DD'),6,150000,12500,TO_DATE('2024-03-01','YYYY-MM-DD'),'DV002','Approved',75000,550000
FROM dual WHERE NOT EXISTS (SELECT 1 FROM gpf_sanction_details WHERE id = 102);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
SELECT 103,'OFF002','Medical Emergency',TO_DATE('2024-01-10','YYYY-MM-DD'),TO_DATE('2024-01-15','YYYY-MM-DD'),200000,'Medical Emergency','BILL003',TO_DATE('2024-01-15','YYYY-MM-DD'),TO_DATE('2024-02-01','YYYY-MM-DD'),10,200000,20000,TO_DATE('2024-02-01','YYYY-MM-DD'),'DV003','Approved',200000,240000
FROM dual WHERE NOT EXISTS (SELECT 1 FROM gpf_sanction_details WHERE id = 103);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
SELECT 104,'OFF002','Emergency Medical',TO_DATE('2024-03-05','YYYY-MM-DD'),TO_DATE('2024-03-10','YYYY-MM-DD'),100000,'Emergency Medical','BILL004',TO_DATE('2024-03-10','YYYY-MM-DD'),TO_DATE('2024-03-15','YYYY-MM-DD'),5,100000,20000,TO_DATE('2024-03-15','YYYY-MM-DD'),'DV004','Approved',100000,480000
FROM dual WHERE NOT EXISTS (SELECT 1 FROM gpf_sanction_details WHERE id = 104);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal, house_addr)
SELECT 105,'IND001','House Purchase',TO_DATE('2024-01-25','YYYY-MM-DD'),TO_DATE('2024-02-05','YYYY-MM-DD'),255000,'House Purchase','BILL005',TO_DATE('2024-02-05','YYYY-MM-DD'),TO_DATE('2024-02-15','YYYY-MM-DD'),15,300000,17000,TO_DATE('2024-02-15','YYYY-MM-DD'),'DV005','Approved',255000,135000,'456 Oak Avenue, Mumbai'
FROM dual WHERE NOT EXISTS (SELECT 1 FROM gpf_sanction_details WHERE id = 105);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
SELECT 106,'IND001','Home Repair',TO_DATE('2024-02-15','YYYY-MM-DD'),TO_DATE('2024-02-20','YYYY-MM-DD'),56250,'Home Repair','BILL006',TO_DATE('2024-02-20','YYYY-MM-DD'),TO_DATE('2024-03-01','YYYY-MM-DD'),6,75000,9375,TO_DATE('2024-03-01','YYYY-MM-DD'),'DV006','Approved',56250,270000
FROM dual WHERE NOT EXISTS (SELECT 1 FROM gpf_sanction_details WHERE id = 106);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
SELECT 107,'IND002','Marriage',TO_DATE('2024-01-30','YYYY-MM-DD'),TO_DATE('2024-02-10','YYYY-MM-DD'),125000,'Marriage','BILL007',TO_DATE('2024-02-10','YYYY-MM-DD'),TO_DATE('2024-02-20','YYYY-MM-DD'),8,250000,15625,TO_DATE('2024-02-20','YYYY-MM-DD'),'DV007','Approved',125000,120000
FROM dual WHERE NOT EXISTS (SELECT 1 FROM gpf_sanction_details WHERE id = 107);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
SELECT 108,'IND002','Education Loan',TO_DATE('2024-03-10','YYYY-MM-DD'),TO_DATE('2024-03-15','YYYY-MM-DD'),72000,'Education Loan','BILL008',TO_DATE('2024-03-15','YYYY-MM-DD'),TO_DATE('2024-03-20','YYYY-MM-DD'),6,120000,12000,TO_DATE('2024-03-20','YYYY-MM-DD'),'DV008','Approved',72000,240000
FROM dual WHERE NOT EXISTS (SELECT 1 FROM gpf_sanction_details WHERE id = 108);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal, house_addr)
SELECT 109,'NIN001','House Construction',TO_DATE('2024-02-05','YYYY-MM-DD'),TO_DATE('2024-02-15','YYYY-MM-DD'),315000,'House Construction','BILL009',TO_DATE('2024-02-15','YYYY-MM-DD'),TO_DATE('2024-02-25','YYYY-MM-DD'),12,350000,26250,TO_DATE('2024-02-25','YYYY-MM-DD'),'DV009','Approved',315000,87500,'789 Pine Road, Bangalore'
FROM dual WHERE NOT EXISTS (SELECT 1 FROM gpf_sanction_details WHERE id = 109);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
SELECT 110,'NIN001','Vehicle Repair',TO_DATE('2024-03-15','YYYY-MM-DD'),TO_DATE('2024-03-18','YYYY-MM-DD'),20000,'Vehicle Repair','BILL010',TO_DATE('2024-03-18','YYYY-MM-DD'),TO_DATE('2024-03-25','YYYY-MM-DD'),4,50000,5000,TO_DATE('2024-03-25','YYYY-MM-DD'),'DV010','Approved',20000,175000
FROM dual WHERE NOT EXISTS (SELECT 1 FROM gpf_sanction_details WHERE id = 110);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
SELECT 111,'NIN002','Education',TO_DATE('2024-02-10','YYYY-MM-DD'),TO_DATE('2024-02-18','YYYY-MM-DD'),50000,'Education','BILL011',TO_DATE('2024-02-18','YYYY-MM-DD'),TO_DATE('2024-02-25','YYYY-MM-DD'),5,100000,10000,TO_DATE('2024-02-25','YYYY-MM-DD'),'DV011','Approved',50000,50000
FROM dual WHERE NOT EXISTS (SELECT 1 FROM gpf_sanction_details WHERE id = 111);

INSERT INTO gpf_sanction_details (id, pers_no, gpf_loan_type, application_date, sanction_date, sanction_amount, purpose, bill_no, bill_date, recovery_from_date, no_of_installments, applied_amount, instl_amount, dv_date, dv_no, remarks, tot_dv_amt, prev_bal)
SELECT 112,'NIN002','Personal Loan',TO_DATE('2024-03-20','YYYY-MM-DD'),TO_DATE('2024-03-22','YYYY-MM-DD'),24000,'Personal Loan','BILL012',TO_DATE('2024-03-22','YYYY-MM-DD'),TO_DATE('2024-03-28','YYYY-MM-DD'),4,80000,6000,TO_DATE('2024-03-28','YYYY-MM-DD'),'DV012','Approved',24000,100000
FROM dual WHERE NOT EXISTS (SELECT 1 FROM gpf_sanction_details WHERE id = 112);

COMMIT;
