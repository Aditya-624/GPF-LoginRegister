# Diagnostic Report: Data Fetch Issues

**Date:** March 11, 2026  
**Status:** Issues Identified and Solutions Provided

---

## Summary
Your project has several configuration and code issues preventing data from being fetched properly. The main problems are:

1. **Database Connection Issues** - Oracle database not connecting properly
2. **CORS Configuration** - Frontend cannot communicate with backend
3. **Missing Test Data** - No data in database tables
4. **API Endpoint Issues** - Some endpoints not properly configured
5. **Frontend Configuration** - Environment variables not properly set

---

## Issues Found

### 1. ❌ CORS Configuration Problem
**File:** `drdo-BackEnd/loginregister/src/main/java/com/adithya/loginregister/controller/GPFController.java`

**Issue:** CORS is configured for specific ports but may not match your frontend URL
```java
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
```

**Problem:** If your frontend is running on a different port, requests will be blocked.

**Solution:** Update CORS to accept all localhost origins:
```java
@CrossOrigin(origins = {"http://localhost:*"}, allowCredentials = "true")
```

---

### 2. ❌ Database Connection Not Verified
**File:** `drdo-BackEnd/loginregister/src/main/resources/application.properties`

**Current Configuration:**
```properties
spring.datasource.url=jdbc:oracle:thin:@//localhost:1521/xe
spring.datasource.username=aditya
spring.datasource.password=aditya2468
```

**Issues to Check:**
- Is Oracle database running on your PC?
- Is the database accessible at `localhost:1521`?
- Are the credentials correct?
- Does the database `xe` exist?

**How to Verify:**
1. Open SQL*Plus or Oracle SQL Developer
2. Try connecting with: `sqlplus aditya/aditya2468@xe`
3. If connection fails, the backend cannot fetch data

---

### 3. ❌ No Test Data in Database
**Issue:** Even if the database connects, there's no GPF data to fetch

**Current State:**
- GPF table is created by Flyway migration (V7__create_gpf_table.sql)
- But NO test data is inserted
- When frontend calls `/api/gpf/all`, it returns empty list

**Solution:** Insert test data into GPF table

---

### 4. ❌ Frontend Environment Variable Issue
**File:** `drdo-FrontEnd/.env`

**Current:**
```
VITE_API_BASE_URL=http://localhost:8081
```

**Issue:** If backend is not running on port 8081, all API calls will fail

**How to Verify:**
1. Check what port your Spring Boot backend is running on
2. Update `.env` if needed
3. Restart frontend dev server

---

### 5. ❌ Missing Phone Number Column in Migration
**File:** `drdo-BackEnd/loginregister/src/main/resources/db/migration/V7__create_gpf_table.sql`

**Issue:** The GPF entity has `phoneNumber` field, but the migration doesn't create this column

**Current Migration:**
```sql
CREATE TABLE GPF (
    GPF_ACCOUNTNUMBER NUMBER NOT NULL,
    PERS_NUMBER VARCHAR2(20),
    EMPLOYEE_NAME VARCHAR2(50),
    DESIGNATION VARCHAR2(400),
    DOB DATE,
    DATE_OF_RETIREMENT DATE,
    BASIC_PAY NUMBER,
    CONSTRAINT pk_gpf PRIMARY KEY (GPF_ACCOUNTNUMBER)
);
```

**Missing:** `PHONE_NUMBER VARCHAR2(20)` column

---

### 6. ❌ API Endpoints Not Fully Tested
**Endpoints to Test:**
- `GET /api/auth/test` - Should return "Backend is working!"
- `GET /api/gpf/all` - Should return all GPF records
- `GET /api/gpf/search?query=123` - Should search GPF records

---

## Step-by-Step Troubleshooting Guide

### Step 1: Verify Backend is Running
```bash
# Check if Spring Boot is running on port 8081
# Open browser and go to: http://localhost:8081/api/auth/test
# Should see: {"message":"Backend is working!","timestamp":"..."}
```

### Step 2: Verify Database Connection
```bash
# In SQL*Plus or SQL Developer, run:
SELECT COUNT(*) FROM GPF;
# Should return: 0 (if no data) or number of records
```

### Step 3: Insert Test Data
Run this SQL to add test GPF records:
```sql
INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
VALUES (1001, 'P001', 'John Doe', 'Senior Engineer', TO_DATE('1990-01-15', 'YYYY-MM-DD'), TO_DATE('2025-12-31', 'YYYY-MM-DD'), 75000, '9876543210');

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
VALUES (1002, 'P002', 'Jane Smith', 'Project Manager', TO_DATE('1992-05-20', 'YYYY-MM-DD'), TO_DATE('2026-06-30', 'YYYY-MM-DD'), 85000, '9876543211');

COMMIT;
```

### Step 4: Test API Endpoints
```bash
# Test search endpoint
curl "http://localhost:8081/api/gpf/search?query=1001"

# Test get all endpoint
curl "http://localhost:8081/api/gpf/all"
```

### Step 5: Check Frontend Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab to see API responses

---

## Required Fixes

### Fix 1: Update CORS Configuration
**File:** `drdo-BackEnd/loginregister/src/main/java/com/adithya/loginregister/controller/GPFController.java`

Change line 11 from:
```java
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
```

To:
```java
@CrossOrigin(origins = {"http://localhost:*"}, allowCredentials = "true")
```

Also update `AuthController.java` similarly.

---

### Fix 2: Add Phone Number Column to Migration
**File:** `drdo-BackEnd/loginregister/src/main/resources/db/migration/V7__create_gpf_table.sql`

Add this line after `BASIC_PAY NUMBER,`:
```sql
PHONE_NUMBER VARCHAR2(20),
```

---

### Fix 3: Create New Migration for Phone Number (If DB Already Created)
Create new file: `drdo-BackEnd/loginregister/src/main/resources/db/migration/V16__add_phone_number_to_gpf.sql`

```sql
ALTER TABLE GPF ADD (PHONE_NUMBER VARCHAR2(20));
COMMIT;
```

---

### Fix 4: Verify Frontend Environment
**File:** `drdo-FrontEnd/.env`

Ensure it matches your backend port:
```
VITE_API_BASE_URL=http://localhost:8081
```

---

## Checklist to Get Data Fetching Working

- [ ] Oracle database is running and accessible
- [ ] Spring Boot backend is running on port 8081
- [ ] Database has test data in GPF table
- [ ] CORS configuration allows frontend origin
- [ ] Frontend `.env` has correct API_BASE_URL
- [ ] Phone number column exists in GPF table
- [ ] Frontend dev server is running (port 5173 or 3000)
- [ ] No errors in browser console
- [ ] No errors in backend logs

---

## Common Error Messages and Solutions

### Error: "Cannot connect to backend server"
**Cause:** Backend not running or wrong port  
**Solution:** Start Spring Boot: `mvn spring-boot:run`

### Error: "No GPF records found"
**Cause:** Database has no data  
**Solution:** Insert test data using SQL provided above

### Error: "CORS error" or "Access-Control-Allow-Origin"
**Cause:** CORS not configured properly  
**Solution:** Update CORS configuration in controllers

### Error: "Network request failed"
**Cause:** Frontend URL doesn't match backend  
**Solution:** Check `.env` file and backend port

---

## Next Steps

1. **Verify Database Connection** - Test Oracle connection
2. **Insert Test Data** - Add sample GPF records
3. **Apply Fixes** - Update CORS and migrations
4. **Restart Backend** - Rebuild and run Spring Boot
5. **Test APIs** - Use curl or Postman to test endpoints
6. **Check Frontend** - Verify data appears in UI

---

## Files That Need Updates

1. ✏️ `drdo-BackEnd/loginregister/src/main/java/com/adithya/loginregister/controller/GPFController.java` - CORS fix
2. ✏️ `drdo-BackEnd/loginregister/src/main/java/com/adithya/loginregister/controller/AuthController.java` - CORS fix
3. ✏️ `drdo-BackEnd/loginregister/src/main/resources/db/migration/V7__create_gpf_table.sql` - Add phone number
4. ✏️ `drdo-FrontEnd/.env` - Verify API URL

---

## Support Information

If you're still having issues after these fixes:
1. Check backend logs for SQL errors
2. Check browser console for JavaScript errors
3. Verify database connectivity with SQL client
4. Ensure all services are running on correct ports
5. Clear browser cache and restart dev servers

