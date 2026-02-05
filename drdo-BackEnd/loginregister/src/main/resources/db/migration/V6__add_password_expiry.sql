-- Flyway migration: add password expiry date to users table

ALTER TABLE users ADD password_expiry_days NUMBER(10);
ALTER TABLE users ADD last_password_change_date DATE;
