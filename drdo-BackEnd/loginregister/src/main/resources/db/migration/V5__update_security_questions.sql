-- Flyway migration: rename and add second security question/answer

ALTER TABLE users RENAME COLUMN security_question TO security_question_1;
ALTER TABLE users RENAME COLUMN security_answer TO security_answer_1;
ALTER TABLE users ADD security_question_2 VARCHAR2(255);
ALTER TABLE users ADD security_answer_2 VARCHAR2(255);
