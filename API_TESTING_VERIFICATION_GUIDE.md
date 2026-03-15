# API Testing & Verification Guide

## Overview
This guide provides comprehensive testing for all GPF-related APIs to ensure data is being stored and fetched properly.

---

## 1. GPF User Details API (`/api/gpf-usr-details`)

### 1.1 Create/Save User Application
**Endpoint:** `POST http://localhost:8081/api/gpf-usr-details`

**Request Body:**
```json
{
  "persNo": 12345,
  "phoneNo": "9876543210",
  "presentBasicPay": 45000,
  "previousAdvanceAmount": 0,
  "monthDrawn": "01/2024",
  "purposeDrawn": "Medical",
  "outstandingAmount": 0,
  "gpfLoanType": "T",
  "purposeRequired": "Medical Treatment",
  "amountApplied": 50000,
  "enclosures": "Y",
  "finalWithdrawalDrawn": "N",
  "previousFinalAmount": 0,
  "previousFinalMonth": "",
  "applDate": "2024-01-15",
  "purpose": "Medical Treatment",
  "houseAddr": "123 Main St"
}
```

**Expected Response:** 
- Status: 201 Created
- Returns saved object with ID

**Test Steps:**
1. Open Postman/Insomnia
2. Set method to POST
3. Enter URL: `http://localhost:8081/api/gpf-usr-details`
4. Set Content-Type: application/json
5. Paste request body
6. Click Send
7. Verify response status is 201 and data is returned

---

### 1.2 Fetch All User Applications
**Endpoint:** `GET http://localhost:8081/api/gpf-usr-details/all`

**Expected Response:**
- Status: 200 OK
- Returns array of all saved applications

**Test Steps:**
1. Set method to GET
2. Enter URL: `http://localhost:8081/api/gpf-usr-details/all`
3. Click Send
4. Verify you see the data saved in step 1.1

---

### 1.3 Fetch Application by Personnel Number
**Endpoint:** `GET http://localhost:8081/api/gpf-usr-details/by-persno/{persno}`

**Example:** `GET http://localhost:8081/api/gpf-usr-details/by-persno/12345`

**Expected Response:**
- Status: 200 OK
- Returns applications for that personnel number

---

### 1.4 Fetch Application by GPF Type
**Endpoint:** `GET http://localhost:8081/api/gpf-usr-details/by-type/{gpfType}`

**Example:** `GET http://localhost:8081/api/gpf-usr-details/by-type/T` (T=Temporary, F=Final)

**Expected Response:**
- Status: 200 OK
- Returns applications of that type

---

### 1.5 Fetch Application by Date Range
**Endpoint:** `GET http://localhost:8081/api/gpf-usr-details/by-date-range?startDate=2024-01-01&endDate=2024-12-31`

**Expected Response:**
- Status: 200 OK
- Returns applications within date range

---

## 2. GPF Sanction Details API (`/api/gpf-sanction-details`)

### 2.1 Create Sanction Details
**Endpoint:** `POST http://localhost:8081/api/gpf-sanction-details`

**Request Body:**
```json
{
  "persNo": "12345",
  "gpfLoanType": "T",
  "applicationDate": "2024-01-15",
  "purpose": "Medical Treatment",
  "billNo": "BILL001",
  "billDate": "2024-01-16",
  "recoveryFromDate": "2024-02-01",
  "appliedAmount": 50000,
  "sanctionAmount": 45000,
  "sanctionDate": "2024-01-20",
  "noOfInstallments": 12,
  "installmentAmount": 3750
}
```

**Expected Response:**
- Status: 201 Created
- Returns saved sanction details

**Test Steps:**
1. Set method to POST
2. Enter URL: `http://localhost:8081/api/gpf-sanction-details`
3. Set Content-Type: application/json
4. Paste request body
5. Click Send
6. Verify response status is 201

---

### 2.2 Fetch All Sanction Details
**Endpoint:** `GET http://localhost:8081/api/gpf-sanction-details`

**Expected Response:**
- Status: 200 OK
- Returns all sanction details

---

### 2.3 Fetch Sanction Details by Personnel Number
**Endpoint:** `GET http://localhost:8081/api/gpf-sanction-details/pers-no/{persNo}`

**Example:** `GET http://localhost:8081/api/gpf-sanction-details/pers-no/12345`

**Expected Response:**
- Status: 200 OK
- Returns sanction details for that person

---

### 2.4 Fetch Sanction Details by Loan Type
**Endpoint:** `GET http://localhost:8081/api/gpf-sanction-details/loan-type/{loanType}`

**Example:** `GET http://localhost:8081/api/gpf-sanction-details/loan-type/T`

**Expected Response:**
- Status: 200 OK
- Returns sanction details of that type

---

## 3. GPF Years API (`/api/gpf-years`)

### 3.1 Search GPF Years
**Endpoint:** `GET http://localhost:8081/api/gpf-years/search?query={searchTerm}`

**Example:** `GET http://localhost:8081/api/gpf-years/search?query=12345`

**Expected Response:**
- Status: 200 OK
- Returns GPF year records matching the search

---

### 3.2 Fetch All GPF Years
**Endpoint:** `GET http://localhost:8081/api/gpf-years/all`

**Expected Response:**
- Status: 200 OK
- Returns all GPF year records

---

### 3.3 Save GPF Year Closing Balance
**Endpoint:** `POST http://localhost:8081/api/gpf-years/save`

**Request Body:**
```json
{
  "passNumber": "12345",
  "gpfYears": 2024,
  "closingBalance": 500000
}
```

**Expected Response:**
- Status: 201 Created
- Returns saved record

---

### 3.4 Get Employees by Work Status
**Endpoint:** `GET http://localhost:8081/api/gpf-years/by-work-status?workStatus=OFFICER&year=2024`

**Expected Response:**
- Status: 200 OK
- Returns employees with their closing balance

---

## 4. Frontend Integration Testing

### 4.1 Test UserApplicationGPF Save
**Steps:**
1. Navigate to User Application GPF page
2. Fill in all form fields
3. Click "Save" button
4. Check browser console for success message
5. Verify in database that data was saved

**Expected Behavior:**
- Alert shows "User GPF Application saved successfully!"
- Data appears in GPF_USR_DETAILS table

---

### 4.2 Test TemporaryAdvance Data Fetch
**Steps:**
1. Navigate to Temporary Advance page
2. Observe the user dropdown
3. Should show users from GPF_USR_DETAILS table
4. Select a user
5. Verify user details populate correctly

**Expected Behavior:**
- User list loads from database
- Selected user details display
- Form fields auto-populate with saved data

---

### 4.3 Test FinalWithdrawal Data Fetch
**Steps:**
1. Navigate to Final Withdrawal page
2. Observe the user dropdown
3. Should show users from GPF_USR_DETAILS table
4. Select a user
5. Verify user details populate correctly

**Expected Behavior:**
- User list loads from database
- Selected user details display
- Form fields auto-populate with saved data

---

## 5. Database Verification

### 5.1 Check GPF_USR_DETAILS Table
```sql
SELECT * FROM GPF_USR_DETAILS;
```

**Expected:** Should show records saved from UserApplicationGPF page

---

### 5.2 Check GPF_SANCTION_DETAILS Table
```sql
SELECT * FROM GPF_SANCTION_DETAILS;
```

**Expected:** Should show records saved from TemporaryAdvance/FinalWithdrawal pages

---

### 5.3 Check GPF_YEARS Table
```sql
SELECT * FROM GPF_YEARS;
```

**Expected:** Should show year-wise closing balance records

---

## 6. Common Issues & Solutions

### Issue: 404 Not Found
**Solution:** 
- Verify backend is running on port 8081
- Check endpoint URL spelling
- Ensure CORS is enabled

### Issue: 400 Bad Request
**Solution:**
- Verify all required fields are present
- Check data types match (number vs string)
- Validate date format (YYYY-MM-DD)

### Issue: 500 Internal Server Error
**Solution:**
- Check backend logs for detailed error
- Verify database connection
- Check for null pointer exceptions

### Issue: Data Not Appearing in Frontend
**Solution:**
- Verify API endpoint is correct
- Check browser console for fetch errors
- Verify CORS headers are set
- Check if data exists in database

---

## 7. Testing Checklist

- [ ] UserApplicationGPF Save API works
- [ ] GPF_USR_DETAILS data saves to database
- [ ] TemporaryAdvance fetches user data
- [ ] FinalWithdrawal fetches user data
- [ ] GPF Sanction Details API works
- [ ] GPF Years API works
- [ ] All CRUD operations work (Create, Read, Update, Delete)
- [ ] Error handling works properly
- [ ] CORS is enabled for frontend
- [ ] Database queries return correct data

---

## 8. Quick Test Commands

### Using cURL:

**Save User Application:**
```bash
curl -X POST http://localhost:8081/api/gpf-usr-details \
  -H "Content-Type: application/json" \
  -d '{
    "persNo": 12345,
    "phoneNo": "9876543210",
    "presentBasicPay": 45000,
    "gpfLoanType": "T",
    "purposeRequired": "Medical",
    "amountApplied": 50000,
    "applDate": "2024-01-15"
  }'
```

**Fetch All Applications:**
```bash
curl http://localhost:8081/api/gpf-usr-details/all
```

**Fetch by Personnel Number:**
```bash
curl http://localhost:8081/api/gpf-usr-details/by-persno/12345
```

---

## 9. Expected Data Flow

```
UserApplicationGPF Page
    ↓ (Save)
GPF_USR_DETAILS Table
    ↓ (Fetch)
TemporaryAdvance Page (User Dropdown)
    ↓ (Select User & Submit)
GPF_SANCTION_DETAILS Table
    ↓ (Fetch)
Display in Tables Section
```

---

## 10. Success Criteria

✅ All APIs return correct HTTP status codes
✅ Data saves to database without errors
✅ Data fetches correctly from database
✅ Frontend displays fetched data properly
✅ No console errors in browser
✅ No errors in backend logs
✅ CORS works for frontend-backend communication
✅ All form validations work
✅ Error messages display correctly
