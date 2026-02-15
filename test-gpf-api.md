# GPF API Testing Guide

## Test the API Endpoints

### 1. Test Search Endpoint

Open your browser or use curl/Postman to test:

**Search by Employee ID:**
```
http://localhost:8081/api/gpf/search?query=EMP001
```

**Search by Account Number:**
```
http://localhost:8081/api/gpf/search?query=GPF002
```

**Search by Name:**
```
http://localhost:8081/api/gpf/search?query=Rajesh
```

**Search by Partial Name:**
```
http://localhost:8081/api/gpf/search?query=Kumar
```

### 2. Test Get All Endpoint

```
http://localhost:8081/api/gpf/all
```

### 3. Using curl (Command Line)

**Search:**
```bash
curl "http://localhost:8081/api/gpf/search?query=EMP001"
```

**Get All:**
```bash
curl "http://localhost:8081/api/gpf/all"
```

### 4. Expected Response Format

```json
[
  {
    "employeeId": "EMP001",
    "accountNo": "GPF001",
    "name": "Rajesh Kumar",
    "designation": "Senior Scientist",
    "phone": "9876543210",
    "dob": "1985-05-15",
    "retirementDate": "2045-05-31"
  }
]
```

## Manual Database Verification

If you need to manually insert data into the GPF table, use SQL Developer or SQL*Plus:

```sql
-- Connect to your Oracle database
-- Username: aditya
-- Password: aditya2468

-- Insert sample employees
INSERT INTO GPF (EMPLOYEE_ID, ACCOUNT_NO, NAME, DESIGNATION, PHONE, DOB, RETIREMENT_DATE)
VALUES ('EMP001', 'GPF001', 'Rajesh Kumar', 'Senior Scientist', '9876543210', 
        TO_DATE('1985-05-15', 'YYYY-MM-DD'), TO_DATE('2045-05-31', 'YYYY-MM-DD'));

INSERT INTO GPF (EMPLOYEE_ID, ACCOUNT_NO, NAME, DESIGNATION, PHONE, DOB, RETIREMENT_DATE)
VALUES ('EMP002', 'GPF002', 'Priya Sharma', 'Technical Officer', '9876543211', 
        TO_DATE('1990-08-20', 'YYYY-MM-DD'), TO_DATE('2050-08-31', 'YYYY-MM-DD'));

INSERT INTO GPF (EMPLOYEE_ID, ACCOUNT_NO, NAME, DESIGNATION, PHONE, DOB, RETIREMENT_DATE)
VALUES ('EMP003', 'GPF003', 'Amit Patel', 'Research Associate', '9876543212', 
        TO_DATE('1988-03-10', 'YYYY-MM-DD'), TO_DATE('2048-03-31', 'YYYY-MM-DD'));

COMMIT;

-- Verify data
SELECT * FROM GPF;
```

## Frontend Testing

1. Start the frontend: `npm run dev` in drdo-FrontEnd folder
2. Navigate to Add GPF Slips page
3. Try searching for:
   - "EMP001"
   - "Rajesh"
   - "GPF002"
4. Click "Select" on a result
5. Verify employee profile appears on the right
6. Verify form fields are populated

## Troubleshooting

### If no data appears:
1. Check if backend is running on port 8081
2. Verify GPF table exists: `SELECT * FROM GPF;`
3. Check backend logs for errors
4. Verify Flyway migration ran successfully

### If search returns empty:
1. Manually insert data using SQL above
2. Check table name is uppercase: `GPF` not `gpf`
3. Verify column names match entity class
