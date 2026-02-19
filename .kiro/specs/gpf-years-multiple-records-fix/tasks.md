# Implementation Plan: GPF Years Multiple Records Fix

## Overview

This implementation plan addresses the limitation where the GPF_YEARS table only allows one record per GPF account. The fix introduces an auto-generated ID as the primary key and adds a unique constraint on (PASS_NUMBER, GPF_YEARS) to enable multiple year records per account while preventing duplicates.

## Tasks

- [x] 1. Create database migration script
  - Create Flyway migration file V10__add_id_to_gpf_years.sql
  - Add ID column with auto-generation as new primary key
  - Add unique constraint on (PASS_NUMBER, GPF_YEARS) combination
  - Migrate existing data to new structure
  - Create indexes for performance optimization
  - _Requirements: Technical Requirements - Database Schema Changes_

- [ ] 2. Update GPFYears entity model
  - [x] 2.1 Modify entity to use auto-generated ID as primary key
    - Change @Id annotation from passNumber to new id field
    - Add @GeneratedValue with IDENTITY strategy
    - Add unique constraint annotation for (passNumber, gpfYears)
    - Keep all existing fields and validation annotations
    - _Requirements: Technical Requirements - Backend Changes_
  
  - [ ]* 2.2 Write unit tests for entity validation
    - Test entity creation with valid data
    - Test validation constraints (NotNull, Size)
    - Test toString() method
    - _Requirements: 3.2, 3.3, 3.4_

- [ ] 3. Update GPFYearsRepository interface
  - [x] 3.1 Change primary key type and add new query methods
    - Change JpaRepository generic type from String to Long
    - Add findByPassNumberOrderByGpfYearsDesc() method
    - Add existsByPassNumberAndGpfYears() method
    - Add findByPassNumberAndGpfYears() method
    - Update searchByPassNumber() query to sort by year descending
    - _Requirements: Technical Requirements - Backend Changes, 2.1, 2.2_
  
  - [ ]* 3.2 Write unit tests for repository methods
    - Test findByPassNumberOrderByGpfYearsDesc() returns correct order
    - Test existsByPassNumberAndGpfYears() detects duplicates
    - Test searchByPassNumber() returns all matching records sorted
    - Test saving multiple records with same passNumber but different years
    - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [ ] 4. Update GPFYearsController save endpoint
  - [x] 4.1 Add duplicate year validation
    - Add validation for positive closing balance
    - Check for existing year using existsByPassNumberAndGpfYears()
    - Return HTTP 409 Conflict for duplicate year entries
    - Return HTTP 400 Bad Request for invalid closing balance
    - Keep existing required field validations
    - _Requirements: 1.4, 3.1, 3.2, 3.3_
  
  - [ ]* 4.2 Write unit tests for save endpoint validation
    - Test save with valid data returns 201 Created
    - Test duplicate year returns 409 Conflict with appropriate message
    - Test missing required fields return 400 Bad Request
    - Test zero/negative closing balance returns 400 Bad Request
    - Test successful save of multiple years for same account
    - _Requirements: 1.1, 1.2, 1.4, 3.1, 3.2, 3.3_

- [ ] 5. Checkpoint - Verify core functionality
  - Run all unit tests and ensure they pass
  - Manually test saving multiple year records for same account
  - Verify duplicate year validation works correctly
  - Ask the user if questions arise

- [ ]* 6. Implement property-based tests
  - [ ]* 6.1 Set up jqwik dependency for property-based testing
    - Add jqwik dependency to pom.xml or build.gradle
    - Configure test framework for property tests
    - _Requirements: Testing Strategy_
  
  - [ ]* 6.2 Write property test for unique year per account
    - **Property 1: Unique Year Per Account**
    - Generate random passNumber, year, and balances
    - Save first record, attempt duplicate year
    - Verify existsByPassNumberAndGpfYears() returns true
    - Configure minimum 100 iterations
    - **Validates: Requirements 1.4, 3.1**
  
  - [ ]* 6.3 Write property test for multiple years per account
    - **Property 2: Multiple Years Per Account**
    - Generate random passNumber and list of unique years
    - Save multiple records with different years
    - Verify all records retrieved correctly
    - Configure minimum 100 iterations
    - **Validates: Requirements 1.1, 1.2, 1.3**
  
  - [ ]* 6.4 Write property test for record retrieval completeness
    - **Property 3: Record Retrieval Completeness**
    - Generate random passNumber and multiple years
    - Save records in random order
    - Verify all records returned sorted by year descending
    - Configure minimum 100 iterations
    - **Validates: Requirements 2.1, 2.2**
  
  - [ ]* 6.5 Write property test for data validation
    - **Property 4: Data Validation**
    - Generate random invalid closing balances (zero or negative)
    - Verify controller rejects with 400 Bad Request
    - Configure minimum 100 iterations
    - **Validates: Requirements 3.2, 3.3**
  
  - [ ]* 6.6 Write property test for data persistence
    - **Property 5: Data Persistence**
    - Generate random passNumber, year, and balance
    - Save record and retrieve it
    - Verify all fields preserved exactly
    - Configure minimum 100 iterations
    - **Validates: Requirements 1.2, 2.3**

- [x] 7. Update search endpoint to handle multiple records
  - Verify searchByPassNumber() returns all records for an account
  - Ensure records are sorted by year descending
  - Test with accounts having multiple year records
  - _Requirements: 2.1, 2.2, 2.3_

- [ ]* 8. Write integration tests
  - Test complete save flow from HTTP request to database
  - Test search flow returns correct sorted data
  - Test database unique constraint enforcement
  - Test concurrent save attempts for same account/year
  - _Requirements: 1.1, 1.2, 1.4, 2.1, 2.2_

- [x] 9. Final checkpoint - End-to-end verification
  - Apply database migration to test environment
  - Run all tests (unit, property, integration)
  - Manually test complete workflow:
    - Save multiple year records for same account
    - Attempt duplicate year and verify error message
    - Search and verify all years displayed in correct order
    - Test with edge cases (old years, large balances)
  - Verify frontend displays multiple records correctly
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property-based tests require jqwik library (or similar PBT framework for Java)
- Database migration must be applied before deploying code changes
- Existing frontend code requires no changes
- All existing functionality must continue to work after changes
