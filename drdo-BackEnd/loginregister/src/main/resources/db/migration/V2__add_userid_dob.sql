-- Flyway migration: add user_id and dob to users table

ALTER TABLE users ADD user_id VARCHAR2(50);
ALTER TABLE users ADD dob DATE;
ALTER TABLE users ADD CONSTRAINT uniq_users_user_id UNIQUE (user_id);