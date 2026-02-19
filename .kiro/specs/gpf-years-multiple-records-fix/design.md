# Design Document: GPF Years Multiple Records Fix

## Overview

This design addresses the limitation in the GPF_YEARS table where only one record can exist per GPF account number. The current implementation uses PASS_NUMBER as the primary key, which prevents storing multiple year records for the same account. The solution introduces an auto-generated ID as the primary key and adds a unique constraint on the (PASS_NUMBER, GPF_YEARS) combination to allow multiple year records while preventing duplicates.

## Architecture

### Current Architecture Issues

The existing GPF_YEARS table has the following structure:
- Primary Key: PASS_NUMBER (single column)
- Columns: PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE

This design flaw causes:
1. Only one record per account can exist
2. Saving a new year record overwrites the previous record
3. Historical data is lost

### Proposed Architecture

The new design introduces:
1. Auto-generated ID column as primary key
2. Unique constraint on (PASS_NUMBER, GPF_YEARS) combination
3. Updated entity model with composite key handling
4. Enhanced repository methods for duplicate detection
5. Controller validation to prevent duplicate year entries

## Components and Interfaces

### 1. Database Schema Changes

**New GPF_YEARS Table Structure:**
```sql
CREATE TABLE GPF_YEARS (
    ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PASS_NUMBER VARCHAR2(50) NOT NULL,
    GPF_YEARS NUMBER(10, 2) NOT NULL,
    CLOSING_BALANCE NUMBER(15, 2) NOT NULL,
    CONSTRAINT uk_gpf_years_pass_year UNIQUE (PASS_NUMBER, GPF_YEARS)
);
```

**Key Changes:**
- Add ID column with auto-generation
- Remove primary key from PASS_NUMBER
- Add unique constraint on (PASS_NUMBER, GPF_YEARS)
- Maintain existing indexes for performance

### 2. Entity Model (GPFYears.java)

**Updated Entity Structure:**
```java
@Entity
@Table(name = "GPF_YEARS", 
       uniqueConstraints = @UniqueConstraint(
           columnNames = {"PASS_NUMBER", "GPF_YEARS"}
       ))
public class GPFYears {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @Column(name = "PASS_NUMBER", nullable = false, length = 50)
    @Size(max = 50)
    @NotNull
    private String passNumber;
    
    @Column(name = "GPF_YEARS", nullable = false, precision = 10, scale = 2)
    @NotNull
    private BigDecimal gpfYears;
    
    @Column(name = "CLOSING_BALANCE", nullable = false, precision = 15, scale = 2)
    @NotNull
    private BigDecimal closingBalance;
}
```

**Key Changes:**
- Change @Id from passNumber to auto-generated id field
- Add unique constraint annotation
- Keep all existing fields and validation

### 3. Repository Interface (GPFYearsRepository.java)

**New Methods:**
```java
public interface GPFYearsRepository extends JpaRepository<GPFYears, Long> {
    
    // Find all records for a specific pass number, sorted by year descending
    List<GPFYears> findByPassNumberOrderByGpfYearsDesc(String passNumber);
    
    // Check if a record exists for specific pass number and year
    boolean existsByPassNumberAndGpfYears(String passNumber, BigDecimal gpfYears);
    
    // Find specific record by pass number and year
    Optional<GPFYears> findByPassNumberAndGpfYears(String passNumber, BigDecimal gpfYears);
    
    // Search by pass number (existing method, updated for multiple results)
    @Query("SELECT g FROM GPFYears g WHERE " +
           "LOWER(g.passNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "ORDER BY g.passNumber, g.gpfYears DESC")
    List<GPFYears> searchByPassNumber(@Param("searchTerm") String searchTerm);
}
```

**Key Changes:**
- Change primary key type from String to Long
- Add method to find all records for an account
- Add method to check for duplicate year entries
- Update search to return multiple records sorted by year

### 4. Controller Logic (GPFYearsController.java)

**Updated Save Endpoint:**
```java
@PostMapping("/save")
public ResponseEntity<?> saveGPFYear(@RequestBody GPFYears gpfYear) {
    // Validate required fields
    if (gpfYear.getPassNumber() == null || gpfYear.getPassNumber().trim().isEmpty()) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("Pass Number is required"));
    }
    
    if (gpfYear.getGpfYears() == null) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("GPF Year is required"));
    }
    
    if (gpfYear.getClosingBalance() == null || 
        gpfYear.getClosingBalance().compareTo(BigDecimal.ZERO) <= 0) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("Closing Balance must be a positive value"));
    }
    
    // Check for duplicate year entry
    if (gpfYearsRepository.existsByPassNumberAndGpfYears(
            gpfYear.getPassNumber(), gpfYear.getGpfYears())) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ErrorResponse(
                "A record for year " + gpfYear.getGpfYears() + 
                " already exists for account " + gpfYear.getPassNumber()));
    }
    
    // Save new record
    GPFYears savedRecord = gpfYearsRepository.save(gpfYear);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedRecord);
}
```

**Updated Search Endpoint:**
```java
@GetMapping("/search")
public ResponseEntity<?> searchGPFYears(@RequestParam(required = false) String query) {
    if (query == null || query.trim().isEmpty()) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("Search query cannot be empty"));
    }
    
    List<GPFYears> results = gpfYearsRepository.searchByPassNumber(query.trim());
    
    if (results.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("No GPF Years records found matching: " + query));
    }
    
    return ResponseEntity.ok(results);
}
```

**Key Changes:**
- Add duplicate year validation before saving
- Return HTTP 409 Conflict for duplicate entries
- Validate closing balance is positive
- Search returns all records for matching accounts, sorted by year

## Data Models

### GPFYears Entity

**Fields:**
- `id` (Long): Auto-generated primary key
- `passNumber` (String): GPF account number (max 50 chars)
- `gpfYears` (BigDecimal): Year value (precision 10, scale 2)
- `closingBalance` (BigDecimal): Year-end balance (precision 15, scale 2)

**Constraints:**
- id: Primary key, auto-generated
- passNumber: Not null, max 50 characters
- gpfYears: Not null, numeric
- closingBalance: Not null, must be positive
- Unique constraint: (passNumber, gpfYears) combination

**Validation Rules:**
- passNumber cannot be empty or null
- gpfYears cannot be null
- closingBalance must be positive (> 0)
- Year must be a valid 4-digit number (validated at frontend)

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Unique Year Per Account
*For any* GPF account number and year combination, the system should allow saving only one record. Attempting to save a duplicate year for the same account should be rejected with a conflict error.

**Validates: Requirements 1.4, 3.1**

### Property 2: Multiple Years Per Account
*For any* GPF account number, the system should allow saving multiple records with different years. Each year's record should be stored independently without overwriting previous records.

**Validates: Requirements 1.1, 1.2, 1.3**

### Property 3: Record Retrieval Completeness
*For any* GPF account number with multiple year records, searching by that account number should return all saved records sorted by year in descending order.

**Validates: Requirements 2.1, 2.2**

### Property 4: Data Validation
*For any* save request, the system should validate that all required fields (passNumber, gpfYears, closingBalance) are present and that closingBalance is a positive value. Invalid requests should be rejected with appropriate error messages.

**Validates: Requirements 3.2, 3.3**

### Property 5: Data Persistence
*For any* successfully saved GPF year record, retrieving records for that account should include the newly saved record with all field values preserved exactly as submitted.

**Validates: Requirements 1.2, 2.3**

## Error Handling

### Database Constraint Violations

**Duplicate Year Entry:**
- Scenario: Attempting to save a record with existing (passNumber, gpfYears) combination
- Detection: Repository method `existsByPassNumberAndGpfYears()` check before save
- Response: HTTP 409 Conflict with message "A record for year X already exists for account Y"
- Recovery: User must choose a different year or update existing record (future feature)

**Unique Constraint Violation (Fallback):**
- Scenario: Database-level unique constraint violation if application check fails
- Detection: DataIntegrityViolationException from JPA
- Response: HTTP 409 Conflict with generic duplicate entry message
- Recovery: Same as above

### Validation Errors

**Missing Required Fields:**
- Scenario: passNumber, gpfYears, or closingBalance is null or empty
- Detection: Controller validation before save
- Response: HTTP 400 Bad Request with specific field error message
- Recovery: User must provide all required fields

**Invalid Closing Balance:**
- Scenario: closingBalance is zero or negative
- Detection: Controller validation
- Response: HTTP 400 Bad Request with message "Closing Balance must be a positive value"
- Recovery: User must provide positive value

### Search Errors

**Empty Search Query:**
- Scenario: Search endpoint called without query parameter
- Detection: Controller validation
- Response: HTTP 400 Bad Request with message "Search query cannot be empty"
- Recovery: User must provide search term

**No Results Found:**
- Scenario: Search returns no matching records
- Detection: Empty result list from repository
- Response: HTTP 404 Not Found with message "No GPF Years records found matching: X"
- Recovery: User should try different search term

### System Errors

**Database Connection Failure:**
- Scenario: Database is unavailable or connection fails
- Detection: Exception during repository operation
- Response: HTTP 500 Internal Server Error with generic error message
- Recovery: Retry after database is available

**Unexpected Exceptions:**
- Scenario: Any unhandled exception during processing
- Detection: Catch-all exception handler
- Response: HTTP 500 Internal Server Error with error details
- Recovery: Log error for investigation, user should retry or contact support

## Testing Strategy

### Unit Testing

Unit tests will focus on specific scenarios and edge cases:

**Entity Tests:**
- Test entity creation with valid data
- Test validation annotations
- Test toString() method

**Repository Tests:**
- Test findByPassNumberOrderByGpfYearsDesc() returns records in correct order
- Test existsByPassNumberAndGpfYears() correctly identifies duplicates
- Test searchByPassNumber() returns all matching records
- Test saving records with same passNumber but different years
- Test unique constraint violation when saving duplicate year

**Controller Tests:**
- Test save endpoint with valid data returns 201 Created
- Test save endpoint rejects duplicate year with 409 Conflict
- Test save endpoint validates required fields
- Test save endpoint validates positive closing balance
- Test search endpoint returns all records for an account
- Test search endpoint returns 404 for no matches
- Test error handling for various exception scenarios

### Property-Based Testing

Property tests will verify universal correctness across randomized inputs:

**Test Configuration:**
- Use JUnit 5 with jqwik library for property-based testing
- Minimum 100 iterations per property test
- Each test tagged with feature name and property reference

**Property Test 1: Unique Year Per Account**
```java
@Property
@Tag("Feature: gpf-years-multiple-records-fix, Property 1: Unique Year Per Account")
void shouldRejectDuplicateYearForSameAccount(
    @ForAll @AlphaChars @StringLength(min = 1, max = 50) String passNumber,
    @ForAll @BigRange(min = "2000", max = "2100") BigDecimal year,
    @ForAll @BigRange(min = "1", max = "10000000") BigDecimal balance1,
    @ForAll @BigRange(min = "1", max = "10000000") BigDecimal balance2) {
    
    // Save first record
    GPFYears first = new GPFYears(passNumber, year, balance1);
    repository.save(first);
    
    // Attempt to save duplicate year
    GPFYears duplicate = new GPFYears(passNumber, year, balance2);
    boolean exists = repository.existsByPassNumberAndGpfYears(passNumber, year);
    
    assertThat(exists).isTrue();
}
```

**Property Test 2: Multiple Years Per Account**
```java
@Property
@Tag("Feature: gpf-years-multiple-records-fix, Property 2: Multiple Years Per Account")
void shouldAllowMultipleYearsForSameAccount(
    @ForAll @AlphaChars @StringLength(min = 1, max = 50) String passNumber,
    @ForAll @Size(min = 2, max = 10) List<@BigRange(min = "2000", max = "2100") BigDecimal> uniqueYears,
    @ForAll @BigRange(min = "1", max = "10000000") BigDecimal balance) {
    
    // Save multiple records with different years
    List<GPFYears> saved = uniqueYears.stream()
        .map(year -> repository.save(new GPFYears(passNumber, year, balance)))
        .collect(Collectors.toList());
    
    // Retrieve all records
    List<GPFYears> retrieved = repository.findByPassNumberOrderByGpfYearsDesc(passNumber);
    
    assertThat(retrieved).hasSize(uniqueYears.size());
    assertThat(retrieved).extracting(GPFYears::getPassNumber)
        .containsOnly(passNumber);
}
```

**Property Test 3: Record Retrieval Completeness**
```java
@Property
@Tag("Feature: gpf-years-multiple-records-fix, Property 3: Record Retrieval Completeness")
void shouldReturnAllRecordsSortedByYearDescending(
    @ForAll @AlphaChars @StringLength(min = 1, max = 50) String passNumber,
    @ForAll @Size(min = 2, max = 10) List<@BigRange(min = "2000", max = "2100") BigDecimal> years,
    @ForAll @BigRange(min = "1", max = "10000000") BigDecimal balance) {
    
    // Save records in random order
    years.forEach(year -> repository.save(new GPFYears(passNumber, year, balance)));
    
    // Retrieve records
    List<GPFYears> retrieved = repository.findByPassNumberOrderByGpfYearsDesc(passNumber);
    
    // Verify all records returned
    assertThat(retrieved).hasSize(years.size());
    
    // Verify descending order
    List<BigDecimal> retrievedYears = retrieved.stream()
        .map(GPFYears::getGpfYears)
        .collect(Collectors.toList());
    assertThat(retrievedYears).isSortedAccordingTo(Comparator.reverseOrder());
}
```

**Property Test 4: Data Validation**
```java
@Property
@Tag("Feature: gpf-years-multiple-records-fix, Property 4: Data Validation")
void shouldRejectInvalidClosingBalance(
    @ForAll @AlphaChars @StringLength(min = 1, max = 50) String passNumber,
    @ForAll @BigRange(min = "2000", max = "2100") BigDecimal year,
    @ForAll @BigRange(min = "-10000000", max = "0") BigDecimal invalidBalance) {
    
    GPFYears record = new GPFYears(passNumber, year, invalidBalance);
    
    // Validation should fail for non-positive balance
    ResponseEntity<?> response = controller.saveGPFYear(record);
    
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
}
```

**Property Test 5: Data Persistence**
```java
@Property
@Tag("Feature: gpf-years-multiple-records-fix, Property 5: Data Persistence")
void shouldPersistAllFieldsExactly(
    @ForAll @AlphaChars @StringLength(min = 1, max = 50) String passNumber,
    @ForAll @BigRange(min = "2000", max = "2100") BigDecimal year,
    @ForAll @BigRange(min = "1", max = "10000000") BigDecimal balance) {
    
    // Save record
    GPFYears original = new GPFYears(passNumber, year, balance);
    GPFYears saved = repository.save(original);
    
    // Retrieve record
    Optional<GPFYears> retrieved = repository.findByPassNumberAndGpfYears(passNumber, year);
    
    assertThat(retrieved).isPresent();
    assertThat(retrieved.get().getPassNumber()).isEqualTo(passNumber);
    assertThat(retrieved.get().getGpfYears()).isEqualByComparingTo(year);
    assertThat(retrieved.get().getClosingBalance()).isEqualByComparingTo(balance);
}
```

### Integration Testing

Integration tests will verify end-to-end functionality:
- Test complete save flow from HTTP request to database
- Test search flow returns correct data
- Test database migration applies correctly
- Test unique constraint enforcement at database level
- Test concurrent save attempts for same account/year combination

### Manual Testing Scenarios

1. Save multiple year records for same account
2. Attempt to save duplicate year and verify error
3. Search for account and verify all years displayed
4. Verify records sorted by year descending
5. Test with edge cases (very old years, very large balances)
6. Test with special characters in pass numbers

## Migration Strategy

### Database Migration (Flyway)

**Migration File: V10__add_id_to_gpf_years.sql**

```sql
-- Step 1: Create new table with correct structure
CREATE TABLE GPF_YEARS_NEW (
    ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PASS_NUMBER VARCHAR2(50) NOT NULL,
    GPF_YEARS NUMBER(10, 2) NOT NULL,
    CLOSING_BALANCE NUMBER(15, 2) NOT NULL,
    CONSTRAINT uk_gpf_years_pass_year UNIQUE (PASS_NUMBER, GPF_YEARS)
);

-- Step 2: Copy existing data
INSERT INTO GPF_YEARS_NEW (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE)
SELECT PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE
FROM GPF_YEARS;

-- Step 3: Drop old table
DROP TABLE GPF_YEARS;

-- Step 4: Rename new table
ALTER TABLE GPF_YEARS_NEW RENAME TO GPF_YEARS;

-- Step 5: Create index for performance
CREATE INDEX idx_gpf_years_pass_number ON GPF_YEARS(PASS_NUMBER);
CREATE INDEX idx_gpf_years_year ON GPF_YEARS(GPF_YEARS);

COMMIT;
```

**Migration Considerations:**
- Existing data will be preserved
- Single record per account will remain (current state)
- New records can be added after migration
- No data loss during migration
- Rollback plan: Keep backup of old table structure

### Code Deployment

**Deployment Order:**
1. Apply database migration (V10)
2. Deploy updated backend code
3. Verify existing functionality works
4. Test new multiple record functionality
5. Monitor for errors

**Rollback Plan:**
- Keep previous version deployed
- Database rollback script available
- Can revert to single-record-per-account if needed

## Frontend Impact

### No Changes Required

The frontend (AddGPFSlips.jsx) already handles multiple records correctly:
- Displays all records in a table
- Refreshes table after save
- Shows year, closing balance, and pass number columns

### Verification Steps

1. Verify table displays multiple records for same account
2. Verify records sorted by year (newest first)
3. Verify error message displayed for duplicate year
4. Verify success message after saving new year
5. Verify table refreshes automatically after save

## Performance Considerations

### Database Indexes

**Existing Index:**
- idx_gpf_years_pass_number on PASS_NUMBER

**New Index:**
- idx_gpf_years_year on GPF_YEARS column

**Query Performance:**
- Search by pass number: O(log n) with index
- Find by pass number and year: O(log n) with composite unique constraint
- Sort by year: Efficient with index on GPF_YEARS

### Expected Load

- Low to medium transaction volume
- Primarily read operations (search)
- Occasional write operations (save year records)
- No performance concerns with current design

### Optimization Opportunities

- Consider composite index on (PASS_NUMBER, GPF_YEARS) if search performance degrades
- Add caching layer if read volume increases significantly
- Implement pagination if result sets become large

## Security Considerations

### Input Validation

- All user inputs validated at controller level
- SQL injection prevented by JPA parameterized queries
- No direct SQL execution with user input

### Data Integrity

- Unique constraint prevents duplicate entries
- Not null constraints ensure required data
- Positive balance validation prevents invalid data

### Access Control

- Existing CORS configuration maintained
- Authentication/authorization handled by existing security layer
- No changes to security model required

## Future Enhancements

### Out of Current Scope

1. **Edit Existing Records**: Allow updating year records after creation
2. **Delete Records**: Allow removing incorrect year entries
3. **Bulk Import**: Import multiple year records from CSV/Excel
4. **Year Comparison**: Compare balances across years
5. **Audit Trail**: Track who created/modified records and when
6. **Validation Rules**: Business rules for year progression (e.g., closing balance of year N should match opening balance of year N+1)

### Potential Future Features

- Export year records to PDF/Excel
- Year-over-year growth calculations
- Graphical visualization of balance trends
- Automated year-end closing process
- Integration with payroll system for automatic balance updates
