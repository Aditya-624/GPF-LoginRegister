# GPF_PURPOSE_E Table Implementation

## Overview
Created a new database table `GPF_PURPOSE_E` to store GPF purpose codes (E category) with their associated rules and percentages.

## Database Schema

### Table: GPF_PURPOSE_E

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| CODE | NUMBER | PRIMARY KEY, NOT NULL | Unique purpose code identifier |
| PURPOSE | VARCHAR2(20) | - | Purpose description (max 20 characters) |
| PERCENTAGE | NUMBER | - | Percentage value associated with the purpose |
| RULE | VARCHAR2(20) | - | Rule description (max 20 characters) |

### Sample Data
The migration includes sample data for E category:
1. Emergency Medical - 100% - Rule E1
2. Education Loan - 60% - Rule E2
3. Home Repair - 75% - Rule E3
4. Vehicle Repair - 40% - Rule E4
5. Personal Loan - 30% - Rule E5

## Backend Implementation

### 1. Migration File
**File:** `V13__create_gpf_purpose_e_table.sql`
- Creates the GPF_PURPOSE_E table
- Adds table and column comments
- Inserts sample data
- Located in: `src/main/resources/db/migration/`

### 2. Entity Class
**File:** `GPFPurposeE.java`
- JPA Entity mapping to GPF_PURPOSE_E table
- Uses BigDecimal for numeric fields
- Includes validation annotations
- Full getters/setters and toString method

### 3. Repository Interface
**File:** `GPFPurposeERepository.java`
- Extends JpaRepository
- Custom query methods:
  - `findByCode(BigDecimal code)` - Find by code
  - `findByPurposeContainingIgnoreCase(String purpose)` - Search by purpose name
  - `findByRuleContainingIgnoreCase(String rule)` - Search by rule
  - `findByPercentageRange(BigDecimal min, BigDecimal max)` - Find by percentage range
  - `findAllOrderByCode()` - Get all ordered by code

### 4. REST Controller
**File:** `GPFPurposeEController.java`
- Base URL: `/api/gpf-purpose-e`
- CORS enabled for localhost:3000 and localhost:5173

## API Endpoints

### GET /api/gpf-purpose-e/all
Get all GPF purposes (E category) ordered by code
- **Response:** Array of GPFPurposeE objects
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Error)

### GET /api/gpf-purpose-e/{code}
Get specific GPF purpose by code
- **Parameters:** code (path variable)
- **Response:** GPFPurposeE object
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Error)

### GET /api/gpf-purpose-e/search?query={searchTerm}
Search GPF purposes by purpose name
- **Parameters:** query (query parameter)
- **Response:** Array of matching GPFPurposeE objects
- **Status Codes:** 200 (OK), 400 (Bad Request), 404 (Not Found), 500 (Error)

### POST /api/gpf-purpose-e/create
Create new GPF purpose
- **Request Body:** GPFPurposeE object
- **Response:** Created GPFPurposeE object
- **Status Codes:** 201 (Created), 400 (Bad Request), 409 (Conflict), 500 (Error)

**Example Request:**
```json
{
  "code": 6,
  "purpose": "Travel Advance",
  "percentage": 50,
  "rule": "Rule E6"
}
```

### PUT /api/gpf-purpose-e/update/{code}
Update existing GPF purpose
- **Parameters:** code (path variable)
- **Request Body:** GPFPurposeE object
- **Response:** Updated GPFPurposeE object
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Error)

### DELETE /api/gpf-purpose-e/delete/{code}
Delete GPF purpose
- **Parameters:** code (path variable)
- **Response:** Success message
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Error)

## Testing

### Using cURL

1. **Get all purposes (E category):**
```bash
curl http://localhost:8081/api/gpf-purpose-e/all
```

2. **Get purpose by code:**
```bash
curl http://localhost:8081/api/gpf-purpose-e/1
```

3. **Search purposes:**
```bash
curl "http://localhost:8081/api/gpf-purpose-e/search?query=Medical"
```

4. **Create new purpose:**
```bash
curl -X POST http://localhost:8081/api/gpf-purpose-e/create \
  -H "Content-Type: application/json" \
  -d '{"code":6,"purpose":"Travel Advance","percentage":50,"rule":"Rule E6"}'
```

5. **Update purpose:**
```bash
curl -X PUT http://localhost:8081/api/gpf-purpose-e/update/6 \
  -H "Content-Type: application/json" \
  -d '{"purpose":"Travel Emergency","percentage":55,"rule":"Rule E6A"}'
```

6. **Delete purpose:**
```bash
curl -X DELETE http://localhost:8081/api/gpf-purpose-e/delete/6
```

## Comparison: GPF_PURPOSE_F vs GPF_PURPOSE_E

| Feature | GPF_PURPOSE_F | GPF_PURPOSE_E |
|---------|---------------|---------------|
| Table Name | GPF_PURPOSE_F | GPF_PURPOSE_E |
| API Base URL | /api/gpf-purpose | /api/gpf-purpose-e |
| Category | F (Final) | E (Emergency) |
| Sample Purposes | House, Education, Medical, Marriage | Emergency Medical, Education Loan, Home Repair |
| Migration Version | V12 | V13 |

## Migration Steps

1. **The migration will run automatically** when Spring Boot restarts
2. **Verify table creation:**
   ```sql
   SELECT * FROM GPF_PURPOSE_E;
   ```
3. **Check both tables:**
   ```sql
   SELECT 'F' as CATEGORY, CODE, PURPOSE, PERCENTAGE, RULE FROM GPF_PURPOSE_F
   UNION ALL
   SELECT 'E' as CATEGORY, CODE, PURPOSE, PERCENTAGE, RULE FROM GPF_PURPOSE_E
   ORDER BY CATEGORY, CODE;
   ```

## Notes

- Both tables (F and E) have identical structure
- They serve different categories of GPF purposes
- The CODE field is the primary key in both tables
- All numeric fields use BigDecimal for precision
- VARCHAR2 fields have a maximum length of 20 characters
- Sample data is included for testing purposes
- CORS is configured for local development
- All endpoints include proper error handling

## Use Cases

### GPF_PURPOSE_F (Final/Formal)
- Long-term investments
- Major life events
- Planned withdrawals
- Higher percentages typically

### GPF_PURPOSE_E (Emergency)
- Urgent needs
- Short-term requirements
- Emergency situations
- Variable percentages based on urgency

## Future Enhancements

- Add validation for percentage range (0-100)
- Add audit fields (created_date, modified_date)
- Add user tracking (created_by, modified_by)
- Add soft delete functionality
- Add pagination for large datasets
- Create a unified API to query both tables
- Add category-based filtering
