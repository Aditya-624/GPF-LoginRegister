-- Create GPF_PURPOSE_F table
-- This table stores GPF purpose codes with their associated rules and percentages

CREATE TABLE GPF_PURPOSE_F (
    CODE NUMBER NOT NULL,
    PURPOSE VARCHAR2(20),
    PERCENTAGE NUMBER,
    RULE VARCHAR2(20),
    CONSTRAINT pk_gpf_purpose_f PRIMARY KEY (CODE)
);

-- Add comments for documentation
COMMENT ON TABLE GPF_PURPOSE_F IS 'GPF Purpose codes with rules and percentages';
COMMENT ON COLUMN GPF_PURPOSE_F.CODE IS 'Unique purpose code identifier';
COMMENT ON COLUMN GPF_PURPOSE_F.PURPOSE IS 'Purpose description (max 20 characters)';
COMMENT ON COLUMN GPF_PURPOSE_F.PERCENTAGE IS 'Percentage value associated with the purpose';
COMMENT ON COLUMN GPF_PURPOSE_F.RULE IS 'Rule description (max 20 characters)';

-- Insert sample data (optional - remove if not needed)
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (1, 'House Construction', 90, 'Rule 1');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (2, 'Education', 50, 'Rule 2');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (3, 'Medical Emergency', 100, 'Rule 3');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (4, 'Marriage', 50, 'Rule 4');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE, PERCENTAGE, RULE) VALUES (5, 'Other Purpose', 25, 'Rule 5');

COMMIT;
