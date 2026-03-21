-- ============================================================
-- Run this in Oracle SQL Developer (F5 = Run as Script)
-- Connect as user: aditya
-- ============================================================

-- Step 1: Drop if partially created (ignore errors if not exists)
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE GPF_SUB_DETAILS CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE GPF_SUB_DETAILS_SEQ';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

-- Step 2: Create the table
CREATE TABLE GPF_SUB_DETAILS (
    ID            NUMBER         PRIMARY KEY,
    PERS_NUMBER   VARCHAR2(50)   NOT NULL,
    ADD_SUB_DATE  DATE           NOT NULL,
    GPF_SUB       NUMBER(15, 2)  NOT NULL,
    GPF_RET       NUMBER(15, 2)  NOT NULL
);

-- Step 3: Create sequence
CREATE SEQUENCE GPF_SUB_DETAILS_SEQ
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- Step 4: Create trigger
CREATE OR REPLACE TRIGGER GPF_SUB_DETAILS_TRG
BEFORE INSERT ON GPF_SUB_DETAILS
FOR EACH ROW
BEGIN
    IF :NEW.ID IS NULL THEN
        SELECT GPF_SUB_DETAILS_SEQ.NEXTVAL INTO :NEW.ID FROM DUAL;
    END IF;
END;
/

-- Step 5: Remove any failed/pending V18 entry from Flyway history
DELETE FROM flyway_schema_history WHERE version = '18';
COMMIT;

-- Step 6: Insert V18 as successfully completed
INSERT INTO flyway_schema_history 
    (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success)
SELECT 
    NVL(MAX(installed_rank), 0) + 1,
    '18',
    'create gpf sub details table',
    'SQL',
    'V18__create_gpf_sub_details_table.sql',
    -1,
    'aditya',
    SYSDATE,
    50,
    1
FROM flyway_schema_history;

COMMIT;

-- Step 7: Verify
SELECT 'TABLE CREATED: ' || table_name FROM user_tables WHERE table_name = 'GPF_SUB_DETAILS';
SELECT 'FLYWAY ENTRY: V' || version || ' success=' || success FROM flyway_schema_history WHERE version = '18';
