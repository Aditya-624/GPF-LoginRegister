-- V19: Add CFA/TA report fields to gpf_sanction_details
-- These fields are used by the CFA Temporary Advance and Final Withdrawal reports

ALTER TABLE gpf_sanction_details ADD outstanding_advance  NUMBER(15,2) DEFAULT 0;
ALTER TABLE gpf_sanction_details ADD prev_sanction_date   DATE;
ALTER TABLE gpf_sanction_details ADD prev_payment_date    DATE;
ALTER TABLE gpf_sanction_details ADD last_bill_no         VARCHAR2(50);
ALTER TABLE gpf_sanction_details ADD last_bill_date       DATE;
ALTER TABLE gpf_sanction_details ADD last_ccb_year        VARCHAR2(10);
ALTER TABLE gpf_sanction_details ADD commencement_date    DATE;
