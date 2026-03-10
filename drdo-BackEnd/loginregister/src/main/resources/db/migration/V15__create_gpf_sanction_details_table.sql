CREATE TABLE gpf_sanction_details (
    id NUMBER PRIMARY KEY,
    pers_no VARCHAR2(50) NOT NULL,
    gpf_loan_type VARCHAR2(100),
    application_date DATE,
    sanction_date DATE,
    sanction_amount NUMBER(15,2),
    purpose VARCHAR2(255),
    bill_no VARCHAR2(50),
    bill_date DATE,
    recovery_from_date DATE,
    no_of_installments NUMBER(5),
    transaction_date DATE,
    applied_amount NUMBER(15,2),
    instl_amount NUMBER(15,2),
    update_loan_tab VARCHAR2(50),
    dv_date DATE,
    dv_no VARCHAR2(50),
    remarks VARCHAR2(500),
    tot_dv_amt NUMBER(15,2),
    prev_bal NUMBER(15,2),
    rec_from DATE,
    recovery_paybill VARCHAR2(50),
    house_addr VARCHAR2(500),
    created_at TIMESTAMP DEFAULT SYSDATE,
    updated_at TIMESTAMP DEFAULT SYSDATE
);

CREATE SEQUENCE gpf_sanction_details_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER gpf_sanction_details_trigger
BEFORE INSERT ON gpf_sanction_details
FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        SELECT gpf_sanction_details_seq.NEXTVAL INTO :NEW.id FROM dual;
    END IF;
END;
/
