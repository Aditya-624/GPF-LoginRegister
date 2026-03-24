-- Create or replace the sequence for gpf_sanction_details starting above existing test data IDs (101-112)
DECLARE
  v_count NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM user_sequences WHERE sequence_name = 'GPF_SANCTION_DETAILS_SEQ';
  IF v_count = 0 THEN
    EXECUTE IMMEDIATE 'CREATE SEQUENCE gpf_sanction_details_seq START WITH 200 INCREMENT BY 1';
  ELSE
    -- Reset to safe value above existing data
    EXECUTE IMMEDIATE 'DROP SEQUENCE gpf_sanction_details_seq';
    EXECUTE IMMEDIATE 'CREATE SEQUENCE gpf_sanction_details_seq START WITH 200 INCREMENT BY 1';
  END IF;
END;
/
