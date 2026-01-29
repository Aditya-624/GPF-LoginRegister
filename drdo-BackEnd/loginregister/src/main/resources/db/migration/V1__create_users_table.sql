CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  CONSTRAINT uniq_users_username UNIQUE (username),
  CONSTRAINT uniq_users_email UNIQUE (email)
);