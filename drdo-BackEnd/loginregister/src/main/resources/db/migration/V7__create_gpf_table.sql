-- Create GPF table for employee GPF account information
CREATE TABLE GPF (
    GPF_ACCOUNTNUMBER NUMBER NOT NULL,
    PERS_NUMBER VARCHAR2(20),
    EMPLOYEE_NAME VARCHAR2(50),
    DESIGNATION VARCHAR2(400),
    DOB DATE,
    DATE_OF_RETIREMENT DATE,
    BASIC_PAY NUMBER,
    PHONE_NUMBER VARCHAR2(20),
    CONSTRAINT pk_gpf PRIMARY KEY (GPF_ACCOUNTNUMBER)
);

-- Create indexes for better query performance
CREATE INDEX idx_gpf_pers_number ON GPF(PERS_NUMBER);

-- Add comments for documentation
COMMENT ON TABLE GPF IS 'GPF account holder information';
COMMENT ON COLUMN GPF.GPF_ACCOUNTNUMBER IS 'Unique GPF account number (Primary Key)';
COMMENT ON COLUMN GPF.PERS_NUMBER IS 'Personnel/Employee number';
COMMENT ON COLUMN GPF.EMPLOYEE_NAME IS 'Full name of the employee';
COMMENT ON COLUMN GPF.DESIGNATION IS 'Job designation/title';
COMMENT ON COLUMN GPF.DOB IS 'Date of birth';
COMMENT ON COLUMN GPF.DATE_OF_RETIREMENT IS 'Expected retirement date';
COMMENT ON COLUMN GPF.BASIC_PAY IS 'Current basic pay amount';

COMMIT;
