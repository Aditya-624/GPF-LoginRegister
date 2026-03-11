# Verification Checklist - Data Fetch Issues

Use this checklist to verify each component is working correctly.

---

## 1. Database Verification

### Check Oracle Database Connection
- [ ] Oracle database is installed and running
- [ ] Can connect using: `sqlplus aditya/aditya2468@xe`
- [ ] Database `xe` exists and is accessible
- [ ] No connection timeout errors

### Check GPF Table Structure
```sql
-- Run this in SQL*Plus or SQL Developer
DESC GPF;
```

Expected columns:
- [ ] GPF_ACCOUNTNUMBER (NUMBER, PRIMARY KEY)
- [ ] PERS_NUMBER (VARCHAR2)
- [ ] EMPLOYEE_NAME (VARCHAR2)
- [ ] DESIGNATION (VARCHAR2)
- [ ] DOB (DATE)
- [ ] DATE_OF_RETIREMENT (DATE)
- [ ] BASIC_PAY (NUMBER)
- [ ] PHONE_NUMBER (VARCHAR2) ← **NEW**

### Check Test Data
```sql
-- Run this in SQL*Plus or SQL Developer
SELECT COUNT(*) FROM GPF;
```

- [ ] Returns: 10 (or more if you added additional data)
- [ ] If returns 0, run: `INSERT_TEST_GPF_DATA.sql`

---

## 2. Backend Verification

### Check Spring Boot is Running
- [ ] Backend started without errors
- [ ] Console shows: "Started LoginregisterApplication"
- [ ] Console shows: "Tomcat started on port(s): 8081"
- [ ] No SQL errors in logs

### Test Backend API Endpoints

#### Test 1: Health Check
```bash
curl http://localhost:8081/api/auth/test
```
- [ ] Returns: `{"message":"Backend is working!","timestamp":"..."}`
- [ ] Status code: 200

#### Test 2: Get All GPF Records
```bash
curl http://localhost:8081/api/gpf/all
```
- [ ] Returns: Array of GPF records
- [ ] Status code: 200
- [ ] Records contain: gpfAccountNumber, employeeName, etc.

#### Test 3: Search GPF Records
```bash
curl "http://localhost:8081/api/gpf/search?query=1001"
```
- [ ] Returns: Array with matching records
- [ ] Status code: 200
- [ ] Found record with account number 1001

#### Test 4: Get Specific Account
```bash
curl http://localhost:8081/api/gpf/account/1001
```
- [ ] Returns: Single GPF record
- [ ] Status code: 200
- [ ] Record has all fields populated

### Check CORS Configuration
- [ ] No CORS errors in browser console
- [ ] Backend accepts requests from frontend origin
- [ ] Response includes: `Access-Control-Allow-Origin: http://localhost:*`

---

## 3. Frontend Verification

### Check Environment Configuration
- [ ] File: `drdo-FrontEnd/.env` exists
- [ ] Contains: `VITE_API_BASE_URL=http://localhost:8081`
- [ ] No typos in URL

### Check Frontend is Running
- [ ] Frontend started without errors
- [ ] Console shows: "VITE v..." and "ready in X ms"
- [ ] Frontend accessible at: `http://localhost:5173`

### Test Frontend Components

#### Test 1: Login Page
- [ ] Login page loads
- [ ] Can enter credentials
- [ ] No console errors

#### Test 2: Dashboard
- [ ] After login, dashboard appears
- [ ] No network errors in console
- [ ] User session is stored

#### Test 3: GPF Menu
- [ ] GPF menu page loads
- [ ] All menu cards display
- [ ] No console errors

#### Test 4: Add GPF Slips Page
- [ ] Page loads successfully
- [ ] Dropdown shows employee list
- [ ] Can search for employees
- [ ] No "Cannot connect to backend" errors

#### Test 5: Search Functionality
- [ ] Can search for GPF account "1001"
- [ ] Results display in table
- [ ] Can select employee
- [ ] User details table populates

---

## 4. Network Verification

### Check Browser Console
- [ ] No CORS errors
- [ ] No 404 errors for API calls
- [ ] No 500 errors from backend
- [ ] No network timeouts

### Check Network Tab (DevTools)
- [ ] API requests show status 200
- [ ] Response headers include CORS headers
- [ ] Response body contains expected data
- [ ] No failed requests

### Check API Response Format
```json
// Expected format for /api/gpf/all
[
  {
    "gpfAccountNumber": 1001,
    "persNumber": "P001",
    "employeeName": "John Doe",
    "designation": "Senior Software Engineer",
    "dob": "1990-01-15",
    "dateOfRetirement": "2025-12-31",
    "basicPay": 75000,
    "phoneNumber": "9876543210"
  }
]
```

- [ ] Response is valid JSON
- [ ] All fields are present
- [ ] Data types are correct

---

## 5. Integration Verification

### End-to-End Test
1. [ ] Start Oracle database
2. [ ] Start Spring Boot backend
3. [ ] Start React frontend
4. [ ] Open browser to http://localhost:5173
5. [ ] Login with test credentials
6. [ ] Navigate to GPF section
7. [ ] Search for GPF account "1001"
8. [ ] Verify data displays correctly
9. [ ] No errors in console or backend logs

### Data Flow Verification
- [ ] Frontend sends request to backend
- [ ] Backend queries Oracle database
- [ ] Database returns GPF records
- [ ] Backend returns JSON response
- [ ] Frontend displays data in UI

---

## 6. Error Scenarios

### Scenario 1: Database Not Running
- [ ] Backend shows connection error
- [ ] Frontend shows "Cannot connect to backend"
- [ ] **Fix:** Start Oracle database

### Scenario 2: No Test Data
- [ ] Backend returns empty array
- [ ] Frontend shows "No records found"
- [ ] **Fix:** Run INSERT_TEST_GPF_DATA.sql

### Scenario 3: CORS Error
- [ ] Browser console shows CORS error
- [ ] Network tab shows failed request
- [ ] **Fix:** Verify CORS configuration in controllers

### Scenario 4: Wrong API URL
- [ ] Frontend shows network error
- [ ] Backend logs show no requests
- [ ] **Fix:** Check .env file for correct API_BASE_URL

### Scenario 5: Port Conflict
- [ ] Backend fails to start on 8081
- [ ] Frontend fails to start on 5173
- [ ] **Fix:** Change port in application.properties or vite.config.js

---

## 7. Performance Verification

### Response Time
- [ ] API responses return in < 1 second
- [ ] Frontend renders data in < 2 seconds
- [ ] No timeout errors

### Data Volume
- [ ] Can handle 10+ GPF records
- [ ] Search works with large datasets
- [ ] No memory issues

---

## 8. Security Verification

### CORS Configuration
- [ ] Only localhost origins allowed
- [ ] Credentials allowed in requests
- [ ] No overly permissive settings

### Database Credentials
- [ ] Credentials not exposed in frontend
- [ ] Credentials not logged in console
- [ ] Only backend accesses database

### API Security
- [ ] No sensitive data in URLs
- [ ] Proper error messages (no stack traces)
- [ ] Input validation on backend

---

## Summary

### All Checks Passed ✅
If all items are checked, your system is working correctly:
- Database is connected
- Backend APIs are responding
- Frontend is fetching data
- No errors in console or logs
- Data displays correctly in UI

### Some Checks Failed ❌
If some items are not checked:
1. Identify which component is failing
2. Check the troubleshooting section
3. Review the DIAGNOSTIC_REPORT_DATA_FETCH_ISSUES.md
4. Check backend logs and browser console
5. Verify all services are running on correct ports

---

## Quick Reference

| Component | Port | Status |
|-----------|------|--------|
| Oracle Database | 1521 | ✅ Running |
| Spring Boot Backend | 8081 | ✅ Running |
| React Frontend | 5173 | ✅ Running |
| Browser | - | ✅ No Errors |

---

## Next Steps

1. Go through each section of this checklist
2. Mark items as you verify them
3. If all items are checked, your system is ready
4. If any items fail, refer to the troubleshooting guide
5. Contact support if issues persist

