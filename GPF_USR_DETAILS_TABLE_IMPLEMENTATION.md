# GPF_USR_DETAILS Table Implementation

## Overview
Created a new database table `GPF_USR_DETAILS` to store GPF user application details including application amount, date, purpose, and other relevant information.

## Database Schema

### Table: GPF_USR_DETAILS

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| ID | NUMBER | PRIMARY KEY, AUTO-INCREMENT | Auto-generated unique identifier |
| APPL_AMT | NUMBER | NOT NULL | Application amount |
| APPL_DATE | DATE | NOT NULL | Application date |
| ENCLOSERS | CHAR(1) | - | Enclosers flag (Y/N) |
| GPF_TYPE | CHAR(1) | - | GPF type (F=Final, E=Emergency) |
| HOUSE_ADDR | VARCHAR2(200) | NULLABLE | House address (optional) |
| PERSNO | NUMBER | NOT NULL | Personnel number |
| PURPOSE | NUMBER | NOT NULL | Purpose code (references GPF_PURPOSE_F or GPF_PURPOSE_E) |

### Indexes
- `idx_gpf_usr_persno` - Index on PERSNO for faster personnel-based queries
- `idx_gpf_usr_appl_date` - Index on APPL_DATE for date range queries
- `idx_gpf_usr_purpose` - Index on PURPOSE for purpose-based filtering

### Sample Data
The migration includes 3 sample records:
1. Application for 50,000 with enclosers, Type F, Purpose 1
2. Application for 25,000 without enclosers, Type E, Purpose 1
3. Application for 75,000 with enclosers, Type F, Purpose 2

## Backend Implementation

### 1. Migration File
**File:** `V14__create_gpf_usr_details_table.sql`
- Creates the GPF_USR_DETAILS table with auto-increment ID
- Adds table and column comments
- Creates performance indexes
- Inserts sample data
- Located in: `src/main/resources/db/migration/`

### 2. Entity Class
**File:** `GPFUsrDetails.java`
- JPA Entity mapping to GPF_USR_DETAILS table
- Uses BigDecimal for numeric fields
- Uses LocalDate for date fields
- Auto-generated ID using IDENTITY strategy
- Includes validation annotations
- Full getters/setters and toString method

### 3. Repository Interface
**File:** `GPFUsrDetailsRepository.java`
- Extends JpaRepository
- Custom query methods:
  - `findByPersno(BigDecimal persno)` - Find by personnel number
  - `findByGpfType(String gpfType)` - Find by GPF type (F/E)
  - `findByPurpose(BigDecimal purpose)` - Find by purpose code
  - `findByApplDateBetween(LocalDate start, LocalDate end)` - Date range search
  - `findByPersnoAndGpfType(BigDecimal persno, String gpfType)` - Combined filter
  - `findByEnclosers(String enclosers)` - Find by enclosers flag
  - `findAllOrderByApplDateDesc()` - Get all ordered by date
  - `findByApplAmtBetween(BigDecimal min, BigDecimal max)` - Amount range search

### 4. REST Controller
**File:** `GPFUsrDetailsController.java`
- Base URL: `/api/gpf-usr-details`
- CORS enabled for localhost:3000 and localhost:5173
- Full CRUD operations with validation

## API Endpoints

### GET /api/gpf-usr-details/all
Get all GPF applications ordered by date (newest first)
- **Response:** Array of GPFUsrDetails objects
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Error)

### GET /api/gpf-usr-details/{id}
Get specific application by ID
- **Parameters:** id (path variable)
- **Response:** GPFUsrDetails object
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Error)

### GET /api/gpf-usr-details/by-persno/{persno}
Get all applications for a specific personnel number
- **Parameters:** persno (path variable)
- **Response:** Array of GPFUsrDetails objects
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Error)

### GET /api/gpf-usr-details/by-type/{gpfType}
Get applications by GPF type
- **Parameters:** gpfType (path variable) - F or E
- **Response:** Array of GPFUsrDetails objects
- **Status Codes:** 200 (OK), 400 (Bad Request), 404 (Not Found), 500 (Error)

### GET /api/gpf-usr-details/by-date-range
Get applications within a date range
- **Parameters:** 
  - startDate (query parameter) - Format: YYYY-MM-DD
  - endDate (query parameter) - Format: YYYY-MM-DD
- **Response:** Array of GPFUsrDetails objects
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Error)

**Example:**
```
GET /api/gpf-usr-details/by-date-range?startDate=2024-01-01&endDate=2024-12-31
```

### POST /api/gpf-usr-details/create
Create new GPF application
- **Request Body:** GPFUsrDetails object
- **Response:** Created GPFUsrDetails object
- **Status Codes:** 201 (Created), 400 (Bad Request), 500 (Error)

**Example Request:**
```json
{
  "applAmt": 100000,
  "applDate": "2024-03-15",
  "enclosers": "Y",
  "gpfType": "F",
  "houseAddr": "789 Park Lane, Village",
  "persno": 1004,
  "purpose": 1
}
```

### PUT /api/gpf-usr-details/update/{id}
Update existing GPF application
- **Parameters:** id (path variable)
- **Request Body:** GPFUsrDetails object
- **Response:** Updated GPFUsrDetails object
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Error)

### DELETE /api/gpf-usr-details/delete/{id}
Delete GPF application
- **Parameters:** id (path variable)
- **Response:** Success message
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Error)

## Field Validations

### Required Fields
- `applAmt` - Application amount (must be provided)
- `applDate` - Application date (must be provided)
- `persno` - Personnel number (must be provided)
- `purpose` - Purpose code (must be provided)

### Optional Fields
- `enclosers` - Y or N (if provided, must be Y or N)
- `gpfType` - F or E (if provided, must be F or E)
- `houseAddr` - Can be null or up to 200 characters

## Testing

### Using cURL

1. **Get all applications:**
```bash
curl http://localhost:8081/api/gpf-usr-details/all
```

2. **Get application by ID:**
```bash
curl http://localhost:8081/api/gpf-usr-details/1
```

3. **Get applications by personnel number:**
```bash
curl http://localhost:8081/api/gpf-usr-details/by-persno/1001
```

4. **Get applications by type:**
```bash
curl http://localhost:8081/api/gpf-usr-details/by-type/F
```

5. **Get applications by date range:**
```bash
curl "http://localhost:8081/api/gpf-usr-details/by-date-range?startDate=2024-01-01&endDate=2024-12-31"
```

6. **Create new application:**
```bash
curl -X POST http://localhost:8081/api/gpf-usr-details/create \
  -H "Content-Type: application/json" \
  -d '{
    "applAmt": 100000,
    "applDate": "2024-03-15",
    "enclosers": "Y",
    "gpfType": "F",
    "houseAddr": "789 Park Lane",
    "persno": 1004,
    "purpose": 1
  }'
```

7. **Update application:**
```bash
curl -X PUT http://localhost:8081/api/gpf-usr-details/update/1 \
  -H "Content-Type: application/json" \
  -d '{
    "applAmt": 120000,
    "applDate": "2024-03-15",
    "enclosers": "Y",
    "gpfType": "F",
    "houseAddr": "Updated Address",
    "persno": 1001,
    "purpose": 1
  }'
```

8. **Delete application:**
```bash
curl -X DELETE http://localhost:8081/api/gpf-usr-details/delete/1
```

## Manual Table Creation

If Flyway is not working, run the SQL script manually:

```bash
sqlplus aditya/aditya2468@localhost:1521/xe @create_gpf_usr_details_manual.sql
```

Or execute the commands from `create_gpf_usr_details_manual.sql` in SQL Developer.

## Relationships

### Purpose Code Reference
The `PURPOSE` field references:
- `GPF_PURPOSE_F.CODE` when `GPF_TYPE = 'F'`
- `GPF_PURPOSE_E.CODE` when `GPF_TYPE = 'E'`

### Personnel Number Reference
The `PERSNO` field should reference:
- `GPF.PERS_NUMBER` (existing GPF employee records)

## Use Cases

1. **User Application Submission**
   - User fills application form
   - System creates record in GPF_USR_DETAILS
   - Links to purpose code and personnel number

2. **Application Tracking**
   - View all applications by personnel number
   - Filter by date range
   - Filter by GPF type (F or E)

3. **Application Management**
   - Update application details
   - Delete cancelled applications
   - Search by various criteria

4. **Reporting**
   - Applications by date range
   - Applications by purpose
   - Applications by amount range

## Notes

- ID is auto-generated using Oracle IDENTITY column
- APPL_DATE stores date without time component
- ENCLOSERS and GPF_TYPE are single character fields
- HOUSE_ADDR is optional and can store up to 200 characters
- All numeric fields use BigDecimal for precision
- Indexes improve query performance for common searches
- CORS is configured for local development
- All endpoints include proper error handling and validation

## Future Enhancements

- Add foreign key constraints to PURPOSE and PERSNO
- Add application status field (PENDING, APPROVED, REJECTED)
- Add approval workflow fields (approved_by, approved_date)
- Add audit fields (created_by, created_date, modified_by, modified_date)
- Add soft delete functionality
- Add pagination for large datasets
- Add file attachment support for enclosers
- Add notification system for application status changes
