-- V20: Add SERVICE_DATE column to GPF table
-- Used in CFA report para 2: "completed service on <date>"
ALTER TABLE GPF ADD SERVICE_DATE DATE;
