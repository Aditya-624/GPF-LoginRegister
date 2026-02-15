# GPF Years Table Implementation

## Overview
This implementation creates a new `GPF_YEARS` table without modifying the existing `GPF` table. The new table contains 3 columns for tracking GPF years and closing balances.

## Database Changes

### New Table: GPF_YEARS

**Table Name:** `GPF_YEARS`

**Columns:**
1. `PASS_NUMBER` (VARCHAR2(50)) - Primary Key - Unique pass number identifier
2. `GPF_YEARS` (NUMBER(10,2)) - Number of GPF years (supports decimal values like 5.5, 10.0)
3. `CLOSING_BALANCE` (NUMBER(15,2)) - Closing balance amount in rupees

**Migration Script:** `V8__revert_gpf_and_create_gpf_years.sql`
- Removes any columns that were accidentally added to GPF table
- Creates the new GPF_YEARS table
- Adds index for better search performance
- Inserts 3 sample records for testing

**Sample Data:**
```
PASS001 | 5.5 years  | ₹125,000.00
PASS002 | 10.0 years | ₹350,000.00
PASS003 | 15.5 years | ₹750,000.00
```

## Backend Implementation

### 1. Entity Class: `GPFYears.java`
**Location:** `drdo-BackEnd/loginregister/src/main/java/com/adithya/loginregister/entity/GPFYears.java`

**Fields:**
- `passNumber` (String) - Primary key
- `gpfYears` (BigDecimal) - GPF years with decimal precision
- `closingBalance` (BigDecimal) - Closing balance with 2 decimal places

### 2. Repository Interface: `GPFYearsRepository.java`
**Location:** `drdo-BackEnd/loginregister/src/main/java/com/adithya/loginregister/repository/GPFYearsRepository.java`

**Methods:**
- `searchByPassNumber(String searchTerm)` - Searches by pass number (case-insensitive, partial match)
- `findByPassNumber(String passNumber)` - Finds exact match by pass number

### 3. REST Controller: `GPFYearsController.java`
**Location:** `drdo-BackEnd/loginregister/src/main/java/com/adithya/loginregister/controller/GPFYearsController.java`

**Endpoints:**

#### GET `/api/gpf-years/search?query={searchTerm}`
- Searches GPF Years records by Pass Number
- Returns list of matching records
- Returns 404 if no matches found
- Returns 400 if query is empty

**Example Request:**
```
GET http://localhost:8081/api/gpf-years/search?query=PASS001
```

**Example Response:**
```json
[
  {
    "passNumber": "PASS001",
    "gpfYears": 5.5,
    "closingBalance": 125000.00
  }
]
```

#### GET `/api/gpf-years/all`
- Returns all GPF Years records
- Returns 404 if no records exist

**Example Request:**
```
GET http://localhost:8081/api/gpf-years/all
```

**CORS Configuration:**
- Allows requests from `http://localhost:3000` and `http://localhost:5173`
- Credentials enabled

## Frontend Implementation

### Updated Component: `AddGPFSlips.jsx`
**Location:** `drdo-FrontEnd/src/components/AddGPFSlips.jsx`

**Changes:**
- Updated API endpoint from `/api/gpf/search` to `/api/gpf-years/search`
- Modified search placeholder to "Enter Pass Number"
- Updated results table columns:
  - Pass Number
  - GPF Years
  - Closing Balance (formatted with ₹ symbol and Indian number format)
- Updated profile card to show GPF Years record details
- Changed error messages to reference "GPF Years record"

**Search Results Table:**
```
| Pass Number | GPF Years | Closing Balance | Action |
|-------------|-----------|-----------------|--------|
| PASS001     | 5.5       | ₹1,25,000.00   | Select |
```

**Profile Card Display:**
- Pass Number
- GPF Years
- Closing Balance (formatted with Indian currency format)

### Styling: `AddGPFSlips.css`
No changes required - existing styles work with the new implementation.

## API Testing

### Test Search Endpoint

**Search by Pass Number:**
```bash
curl "http://localhost:8081/api/gpf-years/search?query=PASS001"
```

**Search by Partial Match:**
```bash
curl "http://localhost:8081/api/gpf-years/search?query=PASS"
```

### Test Get All Endpoint

```bash
curl "http://localhost:8081/api/gpf-years/all"
```

### Expected Response Format

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

## Manual Database Operations

### Insert New Record
```sql
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
VALUES ('PASS004', 20.0, 1000000.00);
COMMIT;
```

### Query Records
```sql
-- Get all records
SELECT * FROM GPF_YEARS;

-- Search by pass number
SELECT * FROM GPF_YEARS WHERE PASS_NUMBER LIKE '%PASS%';

-- Get specific record
SELECT * FROM GPF_YEARS WHERE PASS_NUMBER = 'PASS001';
```

### Update Record
```sql
UPDATE GPF_YEARS 
SET GPF_YEARS = 6.0, CLOSING_BALANCE = 150000.00
WHERE PASS_NUMBER = 'PASS001';
COMMIT;
```

### Delete Record
```sql
DELETE FROM GPF_YEARS WHERE PASS_NUMBER = 'PASS001';
COMMIT;
```

## Usage Instructions

### 1. Start Backend Server
```bash
cd drdo-BackEnd/loginregister
./mvnw.cmd spring-boot:run
```
Backend will start on `http://localhost:8081`

The Flyway migration will automatically:
- Remove any accidentally added columns from GPF table
- Create the GPF_YEARS table
- Insert sample data

### 2. Start Frontend Server
```bash
cd drdo-FrontEnd
npm run dev
```
Frontend will start on `http://localhost:5173`

### 3. Using the Search Feature

1. Navigate to "Add GPF Slips" page
2. Enter pass number in search bar (e.g., "PASS001")
3. Click "Search" or press Enter
4. View results in dropdown table
5. Click "Select" on desired record
6. GPF Years record appears in profile card on right
7. Form fields auto-populate
8. Fill remaining GPF slip details
9. Submit the form

## Important Notes

### GPF Table Unchanged
- The original GPF table structure remains intact
- No columns were permanently added or modified
- The migration script removes any temporary columns that Hibernate may have added

### Data Types
- `GPF_YEARS` uses `NUMBER(10,2)` to support decimal values (e.g., 5.5 years)
- `CLOSING_BALANCE` uses `NUMBER(15,2)` to support large amounts with 2 decimal places
- Frontend formats closing balance with Indian currency format (₹1,25,000.00)

### Error Handling
- Empty search query → Alert message
- No results found → 404 error with message
- Backend connection failure → Connection error alert
- Database errors → 500 error with details

## Files Created/Modified

### Backend Files Created
1. `GPFYears.java` - Entity class for GPF_YEARS table
2. `GPFYearsRepository.java` - Repository interface
3. `GPFYearsController.java` - REST controller
4. `V8__revert_gpf_and_create_gpf_years.sql` - Database migration

### Backend Files Deleted
1. `GPF.java` - Removed (not modifying GPF table)
2. `GPFRepository.java` - Removed
3. `GPFController.java` - Removed
4. `V7__create_gpf_table.sql` - Removed

### Frontend Files Modified
1. `AddGPFSlips.jsx` - Updated to use GPF_YEARS API

### Configuration Files
- `application.properties` - Flyway enabled

## Troubleshooting

### Migration Errors
If you see Flyway errors about V7 migration:
1. The V7 migration file has been deleted
2. If Flyway already ran V7, it's recorded in `flyway_schema_history` table
3. The V8 migration will clean up any changes from V7

### Table Already Exists
If GPF_YEARS table already exists:
```sql
DROP TABLE GPF_YEARS;
```
Then restart the backend to run migration again.

### No Sample Data
If sample data is missing:
```sql
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
VALUES ('PASS001', 5.5, 125000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
VALUES ('PASS002', 10.0, 350000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
VALUES ('PASS003', 15.5, 750000.00);
COMMIT;
```

### Backend Not Starting
- Check Oracle database is running
- Verify database credentials in application.properties
- Check port 8081 is available
- Review backend logs for errors

## Future Enhancements

1. Add relationship between GPF and GPF_YEARS tables
2. Implement CRUD operations (Create, Update, Delete)
3. Add validation for GPF years (must be positive)
4. Add validation for closing balance (must be non-negative)
5. Implement pagination for large datasets
6. Add date tracking (created_date, updated_date)
7. Add audit trail for balance changes

## Security Considerations

- Authentication is currently disabled for development
- Enable authentication before production deployment
- Update CORS origins for production environment
- Add authorization checks for sensitive operations
- Implement input validation and sanitization
- Add rate limiting for API endpoints

## Support

For issues or questions:
- Check backend logs in console
- Verify database connection
- Test API endpoints using curl or Postman
- Review Flyway migration history: `SELECT * FROM flyway_schema_history;`
