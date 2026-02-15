# GPF Search Functionality Implementation

## Overview
This document describes the implementation of the GPF employee search functionality in the Add GPF Slips page.

## Backend Implementation

### 1. Entity Class: `GPF.java`
**Location:** `drdo-BackEnd/loginregister/src/main/java/com/adithya/loginregister/entity/GPF.java`

**Description:** JPA Entity that maps to the `GPF` table in Oracle database.

**Columns:**
- `EMPLOYEE_ID` (Primary Key) - Employee identification number
- `ACCOUNT_NO` (Unique) - GPF account number
- `NAME` - Employee full name
- `DESIGNATION` - Job designation
- `PHONE` - Contact phone number
- `DOB` - Date of birth
- `RETIREMENT_DATE` - Expected retirement date

### 2. Repository Interface: `GPFRepository.java`
**Location:** `drdo-BackEnd/loginregister/src/main/java/com/adithya/loginregister/repository/GPFRepository.java`

**Methods:**
- `searchEmployees(String searchTerm)` - Searches by Employee ID, Account Number, or Name (case-insensitive)
- `findByEmployeeId(String employeeId)` - Finds employee by exact Employee ID
- `findByAccountNo(String accountNo)` - Finds employee by exact Account Number

### 3. REST Controller: `GPFController.java`
**Location:** `drdo-BackEnd/loginregister/src/main/java/com/adithya/loginregister/controller/GPFController.java`

**Endpoints:**

#### GET `/api/gpf/search?query={searchTerm}`
- Searches employees by Employee ID, Account Number, or Name
- Returns list of matching employees
- Returns 404 if no matches found
- Returns 400 if query is empty

#### GET `/api/gpf/all`
- Returns all employees in the system
- Returns 404 if no employees exist

**CORS Configuration:**
- Allows requests from `http://localhost:3000` and `http://localhost:5173`
- Credentials enabled

## Frontend Implementation

### 1. React Component: `AddGPFSlips.jsx`
**Location:** `drdo-FrontEnd/src/components/AddGPFSlips.jsx`

**New Features:**
- Search bar with input field and search button
- Real-time search results dropdown table
- Employee profile card (sticky sidebar)
- Auto-populate form fields on employee selection
- Comprehensive error handling

**State Management:**
- `searchQuery` - Current search input
- `searchResults` - Array of search results
- `showResults` - Toggle results dropdown visibility
- `selectedEmployee` - Currently selected employee object
- `isSearching` - Loading state during API call

**Key Functions:**
- `handleSearch()` - Performs API call to search employees
- `handleSearchKeyPress()` - Triggers search on Enter key
- `handleSelectEmployee()` - Selects employee and populates form
- `formatDate()` - Formats date for display

### 2. Styling: `AddGPFSlips.css`
**Location:** `drdo-FrontEnd/src/components/AddGPFSlips.css`

**New Styles:**
- Two-column layout (form + employee profile)
- Search container with blue search button
- Results dropdown table with hover effects
- Employee profile card with grid layout
- Responsive design for mobile and tablet
- Smooth animations and transitions

## Database Setup

### Migration Script: `V7__create_gpf_table.sql`
**Location:** `drdo-BackEnd/loginregister/src/main/resources/db/migration/V7__create_gpf_table.sql`

**Creates:**
- GPF table with all required columns
- Indexes for optimized search performance
- Sample data for testing (3 employees)

**Sample Data:**
1. EMP001 - Rajesh Kumar (Senior Scientist)
2. EMP002 - Priya Sharma (Technical Officer)
3. EMP003 - Amit Patel (Research Associate)

## Configuration

### Backend Configuration
**File:** `drdo-BackEnd/loginregister/src/main/resources/application.properties`

```properties
# Server runs on port 8081
server.port=8081

# Flyway enabled for database migrations
spring.flyway.enabled=true

# Oracle Database connection
spring.datasource.url=jdbc:oracle:thin:@//localhost:1521/xe
spring.datasource.username=aditya
spring.datasource.password=aditya2468
```

### Frontend Configuration
**API Base URL:** `http://localhost:8081/api/gpf`

**Dependencies:**
- axios (for HTTP requests)
- react-router-dom (for navigation)

## Usage Instructions

### 1. Start Backend Server
```bash
cd drdo-BackEnd/loginregister
./mvnw.cmd spring-boot:run
```
Backend will start on `http://localhost:8081`

### 2. Start Frontend Server
```bash
cd drdo-FrontEnd
npm run dev
```
Frontend will start on `http://localhost:5173`

### 3. Using the Search Feature

1. Navigate to "Add GPF Slips" page
2. Enter search term in the search bar:
   - Employee ID (e.g., "EMP001")
   - Account Number (e.g., "GPF001")
   - Name (e.g., "Rajesh" or "Kumar")
3. Click "Search" button or press Enter
4. View results in the dropdown table
5. Click "Select" on desired employee
6. Employee profile appears on the right side
7. Form fields auto-populate with employee data
8. Fill remaining GPF slip details
9. Submit the form

## Error Handling

### Backend Errors
- Empty query → 400 Bad Request
- No results found → 404 Not Found
- Database errors → 500 Internal Server Error

### Frontend Errors
- Empty search → Alert message
- No results → Alert "No employee found"
- Backend connection failure → Alert "Cannot connect to backend"
- API errors → Display error message from backend

## API Response Examples

### Successful Search Response
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

### Error Response
```json
{
  "message": "No employees found matching: XYZ123",
  "timestamp": 1708012345678
}
```

## Testing

### Test Search Queries
1. Search by Employee ID: "EMP001"
2. Search by Account Number: "GPF002"
3. Search by Full Name: "Amit Patel"
4. Search by Partial Name: "Priya"
5. Search by Invalid Term: "INVALID123" (should show error)

### Expected Behavior
- ✅ Case-insensitive search
- ✅ Partial matching supported
- ✅ Multiple results displayed in table
- ✅ Selected employee shown in profile card
- ✅ Form auto-populated on selection
- ✅ Clear selection removes profile card
- ✅ Reset form clears all data

## Security Notes

- CORS configured for localhost development
- Authentication disabled for development (`app.security.disable-auth=true`)
- **Important:** Enable authentication before production deployment
- Update CORS origins for production environment

## Future Enhancements

1. Add pagination for large result sets
2. Implement advanced filters (designation, date range)
3. Add export functionality for search results
4. Implement caching for frequently searched employees
5. Add autocomplete suggestions
6. Implement debouncing for search input

## Troubleshooting

### Backend not starting
- Check Oracle database is running
- Verify database credentials in application.properties
- Ensure port 8081 is not in use

### Frontend cannot connect to backend
- Verify backend is running on port 8081
- Check CORS configuration in GPFController
- Verify axios is installed: `npm install axios`

### No search results
- Verify GPF table exists in database
- Check sample data was inserted
- Review backend logs for SQL errors

### Flyway migration errors
- Check if migration V7 already executed
- Verify database user has CREATE TABLE permissions
- Review Flyway migration history table

## Files Modified/Created

### Backend Files Created
1. `GPF.java` - Entity class
2. `GPFRepository.java` - Repository interface
3. `GPFController.java` - REST controller
4. `V7__create_gpf_table.sql` - Database migration

### Frontend Files Modified
1. `AddGPFSlips.jsx` - Added search functionality
2. `AddGPFSlips.css` - Added search and profile styles

### Configuration Files Modified
1. `application.properties` - Enabled Flyway
2. `package.json` - Added axios dependency

## Support

For issues or questions, please refer to:
- Spring Boot Documentation: https://spring.io/projects/spring-boot
- React Documentation: https://react.dev
- Axios Documentation: https://axios-http.com
- Oracle Database Documentation: https://docs.oracle.com
