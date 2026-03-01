-- Create GPF_PURPOSE_E table
-- This table stores GPF purpose codes with their associated rules and percentages (E category)

CREATE TABLE GPF_PURPOSE_E (
    CODE NUMBER NOT NULL,
    PURPOSE VARCHAR2(20),
    PERCENTAGE NUMBER,
    RULE VARCHAR2(20),
    CONSTRAINT pk_gpf_purpose_e PRIMARY KEY (CODE)
);

-- Add comments for documentation
COMMENT ON TABLE GPF_PURPOSE_E IS 'GPF Purpose codes (E category) with rules and percentages';
COMMENT ON COLUMN GPF_PURPOSE_E.CODE IS 'Unique purpose code identifier';
COMMENT ON COLUMN GPF_PURPOSE_E.PURPOSE IS 'Purpose description (max 20 characters)';
COMMENT ON COLUMN GPF_PURPOSE_E.PERCENTAGE IS 'Percentage value associated with the purpose';
COMMENT ON COLUMN GPF_PURPOSE_E.RULE IS 'Rule description (max 20 characters)';

-- Insert sample data (optional - remove if not needed)
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (1, 'Emergency Medical', 100, 'Rule E1');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (2, 'Education Loan', 60, 'Rule E2');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (3, 'Home Repair', 75, 'Rule E3');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (4, 'Vehicle Repair', 40, 'Rule E4');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (5, 'Personal Loan', 30, 'Rule E5');

COMMIT;
