# GPF_PURPOSE_F Table Implementation

## Overview
Created a new database table `GPF_PURPOSE_F` to store GPF purpose codes with their associated rules and percentages.

## Database Schema

### Table: GPF_PURPOSE_F

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| CODE | NUMBER | PRIMARY KEY, NOT NULL | Unique purpose code identifier |
| PURPOSE | VARCHAR2(20) | - | Purpose description (max 20 characters) |
| PERCENTAGE | NUMBER | - | Percentage value associated with the purpose |
| RULE | VARCHAR2(20) | - | Rule description (max 20 characters) |

### Sample Data
The migration includes sample data:
1. House Construction - 90% - Rule 1
2. Education - 50% - Rule 2
3. Medical Emergency - 100% - Rule 3
4. Marriage - 50% - Rule 4
5. Other Purpose - 25% - Rule 5

## Backend Implementation

### 1. Migration File
**File:** `V12__create_gpf_purpose_f_table.sql`
- Creates the GPF_PURPOSE_F table
- Adds table and column comments
- Inserts sample data
- Located in: `src/main/resources/db/migration/`

### 2. Entity Class
**File:** `GPFPurposeF.java`
- JPA Entity mapping to GPF_PURPOSE_F table
- Uses BigDecimal for numeric fields
- Includes validation annotations
- Full getters/setters and toString method

### 3. Repository Interface
**File:** `GPFPurposeFRepository.java`
- Extends JpaRepository
- Custom query methods:
  - `findByCode(BigDecimal code)` - Find by code
  - `findByPurposeContainingIgnoreCase(String purpose)` - Search by purpose name
  - `findByRuleContainingIgnoreCase(String rule)` - Search by rule
  - `findByPercentageRange(BigDecimal min, BigDecimal max)` - Find by percentage range
  - `findAllOrderByCode()` - Get all ordered by code

### 4. REST Controller
**File:** `GPFPurposeFController.java`
- Base URL: `/api/gpf-purpose`
- CORS enabled for localhost:3000 and localhost:5173

## API Endpoints

### GET /api/gpf-purpose/all
Get all GPF purposes ordered by code
- **Response:** Array of GPFPurposeF objects
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Error)

### GET /api/gpf-purpose/{code}
Get specific GPF purpose by code
- **Parameters:** code (path variable)
- **Response:** GPFPurposeF object
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Error)

### GET /api/gpf-purpose/search?query={searchTerm}
Search GPF purposes by purpose name
- **Parameters:** query (query parameter)
- **Response:** Array of matching GPFPurposeF objects
- **Status Codes:** 200 (OK), 400 (Bad Request), 404 (Not Found), 500 (Error)

### POST /api/gpf-purpose/create
Create new GPF purpose
- **Request Body:** GPFPurposeF object
- **Response:** Created GPFPurposeF object
- **Status Codes:** 201 (Created), 400 (Bad Request), 409 (Conflict), 500 (Error)

**Example Request:**
```json
{
  "code": 6,
  "purpose": "Vehicle Purchase",
  "percentage": 75,
  "rule": "Rule 6"
}
```

### PUT /api/gpf-purpose/update/{code}
Update existing GPF purpose
- **Parameters:** code (path variable)
- **Request Body:** GPFPurposeF object
- **Response:** Updated GPFPurposeF object
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Error)

### DELETE /api/gpf-purpose/delete/{code}
Delete GPF purpose
- **Parameters:** code (path variable)
- **Response:** Success message
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Error)

## Testing

### Using cURL

1. **Get all purposes:**
```bash
curl http://localhost:8081/api/gpf-purpose/all
```

2. **Get purpose by code:**
```bash
curl http://localhost:8081/api/gpf-purpose/1
```

3. **Search purposes:**
```bash
curl "http://localhost:8081/api/gpf-purpose/search?query=House"
```

4. **Create new purpose:**
```bash
curl -X POST http://localhost:8081/api/gpf-purpose/create \
  -H "Content-Type: application/json" \
  -d '{"code":6,"purpose":"Vehicle","percentage":75,"rule":"Rule 6"}'
```

5. **Update purpose:**
```bash
curl -X PUT http://localhost:8081/api/gpf-purpose/update/6 \
  -H "Content-Type: application/json" \
  -d '{"purpose":"Vehicle Purchase","percentage":80,"rule":"Rule 6A"}'
```

6. **Delete purpose:**
```bash
curl -X DELETE http://localhost:8081/api/gpf-purpose/delete/6
```

## Migration Steps

1. **Stop the application** (if running)
2. **Run the migration:**
   - Flyway will automatically run V12 migration on next startup
   - Or manually run: `mvn flyway:migrate`
3. **Start the application**
4. **Verify table creation:**
   ```sql
   SELECT * FROM GPF_PURPOSE_F;
   ```

## Notes

- The CODE field is the primary key
- All numeric fields use BigDecimal for precision
- VARCHAR2 fields have a maximum length of 20 characters
- Sample data is included for testing purposes
- CORS is configured for local development
- All endpoints include proper error handling

## Future Enhancements

- Add validation for percentage range (0-100)
- Add audit fields (created_date, modified_date)
- Add user tracking (created_by, modified_by)
- Add soft delete functionality
- Add pagination for large datasets
