# Quick Test Guide - GPF Years Implementation

## Backend is Running ✓
- Server: `http://localhost:8081`
- Status: Active

## Test the API

### 1. Open Browser and Test Search

**Test URL 1 - Search for PASS001:**
```
http://localhost:8081/api/gpf-years/search?query=PASS001
```

**Expected Response:**
```json
[
  {
    "passNumber": "PASS001",
    "gpfYears": 5.5,
    "closingBalance": 125000.00
  }
]
```

**Test URL 2 - Get All Records:**
```
http://localhost:8081/api/gpf-years/all
```

**Expected Response:**
```json
[
  {
    "passNumber": "PASS001",
    "gpfYears": 5.5,
    "closingBalance": 125000.00
  },
  {
    "passNumber": "PASS002",
    "gpfYears": 10.0,
    "closingBalance": 350000.00
  },
  {
    "passNumber": "PASS003",
    "gpfYears": 15.5,
    "closingBalance": 750000.00
  }
]
```

### 2. Test Frontend

**Start Frontend:**
```bash
cd drdo-FrontEnd
npm run dev
```

**Then:**
1. Open browser to `http://localhost:5173`
2. Navigate to "Add GPF Slips" page
3. In search bar, type: `PASS001`
4. Click "Search" button
5. You should see results table with:
   - Pass Number: PASS001
   - GPF Years: 5.5
   - Closing Balance: ₹1,25,000.00
6. Click "Select" button
7. Profile card appears on right showing the record details

## Verify Database

### Check if GPF_YEARS table exists:

**Option 1 - Using SQL Developer or SQL*Plus:**
```sql
-- Connect to database
-- Username: aditya
-- Password: aditya2468

-- Check table structure
DESC GPF_YEARS;

-- View all records
SELECT * FROM GPF_YEARS;
```

**Expected Output:**
```
PASS_NUMBER  GPF_YEARS  CLOSING_BALANCE
-----------  ---------  ---------------
PASS001      5.5        125000.00
PASS002      10.0       350000.00
PASS003      15.5       750000.00
```

### If No Data Exists:

Run this SQL to insert sample data:
```sql
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
VALUES ('PASS001', 5.5, 125000.00);

INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
VALUES ('PASS002', 10.0, 350000.00);

INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
VALUES ('PASS003', 15.5, 750000.00);

COMMIT;
```

## Troubleshooting

### If API returns 404 "No GPF Years records found"
1. Check if GPF_YEARS table exists: `SELECT * FROM GPF_YEARS;`
2. If table is empty, insert sample data (see above)
3. Verify Flyway migration ran: `SELECT * FROM flyway_schema_history;`

### If Backend won't start
1. Check if port 8081 is in use: `netstat -ano | findstr :8081`
2. Kill the process: `taskkill /F /PID <process_id>`
3. Restart backend

### If Frontend can't connect
1. Verify backend is running on port 8081
2. Check browser console for CORS errors
3. Verify API URL in AddGPFSlips.jsx is correct

## What Changed

### ✅ Created New Table
- Table name: `GPF_YEARS`
- Columns: PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE
- Sample data inserted

### ✅ Backend Files
- `GPFYears.java` - Entity
- `GPFYearsRepository.java` - Repository
- `GPFYearsController.java` - REST API
- `V8__revert_gpf_and_create_gpf_years.sql` - Migration

### ✅ Frontend Updated
- Search now uses `/api/gpf-years/search`
- Results show Pass Number, GPF Years, Closing Balance
- Profile card displays GPF Years record details

### ✅ Original GPF Table
- **NOT MODIFIED** - Remains unchanged
- Any accidentally added columns were removed by migration

## Next Steps

1. Test the API endpoints in browser
2. Test the frontend search functionality
3. Verify data in database
4. Add more records if needed
5. Customize as per your requirements

## Support

If you encounter any issues:
1. Check backend logs in the console
2. Verify database connection
3. Test API endpoints directly in browser
4. Check Flyway migration history
