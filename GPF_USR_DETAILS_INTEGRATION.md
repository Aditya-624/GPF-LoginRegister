# GPF_USR_DETAILS Table Integration Guide

## Overview
The GPF_USR_DETAILS table has been successfully integrated with both the "Add GPF Slips" page and the "GPF Slip Details" page. This integration allows the system to:

1. Store GPF application details when users submit applications
2. Display closing balance from GPF_YEARS table
3. Show application status in the GPF Slip Details page

## Database Structure

### GPF_USR_DETAILS Table
```sql
CREATE TABLE GPF_USR_DETAILS (
    ID NUMBER PRIMARY KEY,
    APPL_AMT NUMBER NOT NULL,           -- Application Amount
    APPL_DATE DATE NOT NULL,            -- Application Date
    ENCLOSERS CHAR(1),                  -- Enclosers flag (Y/N)
    GPF_TYPE CHAR(1),                   -- GPF Type (F/E)
    HOUSE_ADDR VARCHAR2(200),           -- House Address (optional)
    PERSNO NUMBER NOT NULL,             -- Personnel Number
    PURPOSE NUMBER NOT NULL             -- Purpose code
);
```

## Backend API Endpoints

### GPFUsrDetailsController

#### 1. Get All Applications
```
GET /api/gpf-usr-details/all
```
Returns all GPF applications ordered by application date (descending).

#### 2. Get Application by ID
```
GET /api/gpf-usr-details/{id}
```
Returns a specific application by its ID.

#### 3. Get Applications by Personnel Number
```
GET /api/gpf-usr-details/by-persno/{persno}
```
Returns all applications for a specific personnel number.

#### 4. Get Applications by GPF Type
```
GET /api/gpf-usr-details/by-type/{gpfType}
```
Returns applications filtered by GPF type (F or E).

#### 5. Get Applications by Date Range
```
GET /api/gpf-usr-details/by-date-range?startDate=2024-01-01&endDate=2024-12-31
```
Returns applications within a specific date range.

#### 6. Create New Application
```
POST /api/gpf-usr-details/create
```
Creates a new GPF application.

**Request Body:**
```json
{
  "applAmt": 50000,
  "applDate": "2024-03-02",
  "enclosers": "Y",
  "gpfType": "F",
  "houseAddr": "123 Main Street",
  "persno": 1001,
  "purpose": 1
}
```

#### 7. Update Application
```
PUT /api/gpf-usr-details/update/{id}
```
Updates an existing application.

#### 8. Delete Application
```
DELETE /api/gpf-usr-details/delete/{id}
```
Deletes an application by ID.

#### 9. Get Application with Balance (NEW)
```
GET /api/gpf-usr-details/with-balance/{persno}?year={year}
```
Returns application details along with employee information and closing balance for a specific year.

**Response:**
```json
{
  "employee": {
    "gpfAccountNumber": "GPF001",
    "persNumber": "1001",
    "employeeName": "John Doe",
    "designation": "OFFICER",
    "basicPay": 50000
  },
  "applications": [
    {
      "id": 1,
      "applAmt": 50000,
      "applDate": "2024-03-02",
      "gpfType": "F",
      "purpose": 1
    }
  ],
  "closingBalance": 150000,
  "year": 2024
}
```

#### 10. Get All Applications with Balance (NEW)
```
GET /api/gpf-usr-details/all-with-balance?year={year}&workStatus={OFFICER|INDUSTRIAL|NON_INDUSTRIAL}
```
Returns all applications with employee details and closing balance, optionally filtered by work status.

## Frontend Integration

### Add GPF Slips Page (AddGPFSlips.jsx)

**Current Features:**
1. Search and select employees
2. Display employee details in a 4x4 grid
3. Add GPF Year closing balance
4. View saved GPF Years records

**Integration Points:**
- The page already saves closing balance to GPF_YEARS table
- Employee details are fetched from GPF table
- Ready to integrate GPF_USR_DETAILS form for application submission

**Next Steps for Full Integration:**
Add a form section to submit GPF application details:
```jsx
<form onSubmit={handleApplicationSubmit}>
  <input name="applAmt" placeholder="Application Amount" />
  <input name="applDate" type="date" />
  <select name="gpfType">
    <option value="F">Final (F)</option>
    <option value="E">Emergency (E)</option>
  </select>
  <select name="purpose">
    <option value="1">Purpose 1</option>
    <option value="2">Purpose 2</option>
  </select>
  <input name="houseAddr" placeholder="House Address" />
  <select name="enclosers">
    <option value="Y">Yes</option>
    <option value="N">No</option>
  </select>
  <button type="submit">Submit Application</button>
</form>
```

### GPF Slip Details Page (GPFSlipDetails.jsx)

**Updated Features:**
1. Filter by Designation Type (OFFICER/INDUSTRIAL/NON_INDUSTRIAL)
2. Filter by GPF Year
3. Display employees with closing balance
4. **NEW:** Show application status for each employee

**Integration:**
- Fetches data from both GPF_YEARS and GPF_USR_DETAILS tables
- Merges data to show which employees have submitted applications
- Displays "✓ Applied" or "No Application" status badge

**Table Columns:**
- S.No
- PERS No.
- Name
- Designation
- GPF Account No.
- Closing Balance
- **Application Status** (NEW)

## Data Flow

### Saving Closing Balance (Add GPF Slips Page)
```
User selects employee
  ↓
User enters year and closing balance
  ↓
Submit → POST /api/gpf-years/save
  ↓
Data saved to GPF_YEARS table
  ↓
Table refreshes to show saved records
```

### Viewing Details (GPF Slip Details Page)
```
User selects Designation Type and Year
  ↓
Fetch from /api/gpf-years/by-work-status
  ↓
Fetch from /api/gpf-usr-details/all-with-balance
  ↓
Merge data to show application status
  ↓
Display in table with closing balance and status
```

### Submitting Application (To be implemented)
```
User fills application form
  ↓
Submit → POST /api/gpf-usr-details/create
  ↓
Data saved to GPF_USR_DETAILS table
  ↓
Success message shown
```

## Testing the Integration

### 1. Test Closing Balance Display
```bash
# Start Spring Boot backend
cd drdo-BackEnd/loginregister
mvnw spring-boot:run

# Start React frontend
cd drdo-FrontEnd
npm run dev
```

### 2. Test Data Flow
1. Go to "Add GPF Slips" page
2. Select an employee
3. Add closing balance for a year
4. Go to "GPF Slip Details" page
5. Select the same designation type and year
6. Verify the closing balance is displayed

### 3. Test Application Status
1. Create a test application using Postman:
```bash
POST http://localhost:8081/api/gpf-usr-details/create
Content-Type: application/json

{
  "applAmt": 50000,
  "applDate": "2024-03-02",
  "enclosers": "Y",
  "gpfType": "F",
  "houseAddr": "123 Main Street",
  "persno": 1001,
  "purpose": 1
}
```

2. Go to "GPF Slip Details" page
3. Select filters
4. Verify "✓ Applied" status shows for the employee

## Database Setup

If the table doesn't exist in your database, run:

```sql
-- Create sequence
CREATE SEQUENCE GPF_USR_DETAILS_SEQ
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

-- Create table
CREATE TABLE GPF_USR_DETAILS (
    ID NUMBER PRIMARY KEY,
    APPL_AMT NUMBER NOT NULL,
    APPL_DATE DATE NOT NULL,
    ENCLOSERS CHAR(1),
    GPF_TYPE CHAR(1),
    HOUSE_ADDR VARCHAR2(200),
    PERSNO NUMBER NOT NULL,
    PURPOSE NUMBER NOT NULL
);

-- Create trigger for auto-increment
CREATE OR REPLACE TRIGGER GPF_USR_DETAILS_TRG
BEFORE INSERT ON GPF_USR_DETAILS
FOR EACH ROW
BEGIN
    IF :NEW.ID IS NULL THEN
        SELECT GPF_USR_DETAILS_SEQ.NEXTVAL INTO :NEW.ID FROM DUAL;
    END IF;
END;
/

-- Create indexes
CREATE INDEX idx_gpf_usr_persno ON GPF_USR_DETAILS(PERSNO);
CREATE INDEX idx_gpf_usr_appl_date ON GPF_USR_DETAILS(APPL_DATE);
CREATE INDEX idx_gpf_usr_purpose ON GPF_USR_DETAILS(PURPOSE);

-- Insert test data
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE) 
VALUES (50000, SYSDATE, 'Y', 'F', '123 Main Street, City', 1001, 1);

COMMIT;
```

## Next Steps

1. **Add Application Form to Add GPF Slips Page**
   - Create form UI for GPF application submission
   - Integrate with POST /api/gpf-usr-details/create endpoint
   - Add validation and error handling

2. **Enhance GPF Slip Details Page**
   - Add ability to view application details on click
   - Show application history for each employee
   - Add export functionality

3. **Add Purpose Tables Integration**
   - Link PURPOSE field to GPF_PURPOSE_F and GPF_PURPOSE_E tables
   - Display purpose descriptions instead of codes

4. **Add Reporting Features**
   - Generate reports by year and designation
   - Export to PDF/Excel
   - Summary statistics

## Files Modified

### Backend
- `GPFUsrDetailsController.java` - Added new endpoints for integration
- `GPFUsrDetailsRepository.java` - Already has required methods
- `GPFUsrDetails.java` - Entity is complete

### Frontend
- `GPFSlipDetails.jsx` - Added application status display
- `GPFSlipDetails.css` - Added status badge styles

### Database
- `create_gpf_usr_details_compatible.sql` - Compatible SQL script for older Oracle versions

## Summary

The GPF_USR_DETAILS table is now integrated with the system:
- ✅ Backend API endpoints created
- ✅ Database table structure defined
- ✅ GPF Slip Details page shows application status
- ✅ Closing balance from GPF_YEARS displayed correctly
- ⏳ Application form in Add GPF Slips page (to be implemented)

The system can now track GPF applications and display them alongside closing balance information for each year and employee.
