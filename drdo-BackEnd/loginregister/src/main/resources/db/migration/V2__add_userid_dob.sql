-- Flyway migration: add user_id and dob to users table

ALTER TABLE users ADD COLUMN user_id VARCHAR(50) UNIQUE;
ALTER TABLE users ADD COLUMN dob DATE;