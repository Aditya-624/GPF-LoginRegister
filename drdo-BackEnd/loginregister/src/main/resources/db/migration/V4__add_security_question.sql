-- Flyway migration: add security questions and answers to users table

ALTER TABLE users ADD security_question_1 VARCHAR2(255);
ALTER TABLE users ADD security_answer_1 VARCHAR2(255);
ALTER TABLE users ADD security_question_2 VARCHAR2(255);
ALTER TABLE users ADD security_answer_2 VARCHAR2(255);
