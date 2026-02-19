# Requirements: GPF Years Multiple Records Fix

## Overview
Fix the GPF Years table to support multiple year records per GPF account instead of overriding existing records when saving new year closing balances.

## Problem Statement
Currently, the GPF_YEARS table uses PASS_NUMBER (GPF Account Number) as the primary key, which means only one record can exist per account. When users save a new year's closing balance for the same account, it overrides the previous record instead of creating a new entry.

## User Stories

### 1. Save Multiple Year Records
**As a** GPF administrator  
**I want to** save closing balances for multiple years for the same GPF account  
**So that** I can maintain a complete historical record of year-end balances

**Acceptance Criteria:**
- 1.1 System allows saving multiple year records for the same GPF account number
- 1.2 Each year's closing balance is stored as a separate record
- 1.3 Previously saved records remain intact when adding new year records
- 1.4 System prevents duplicate entries for the same account and year combination

### 2. View Historical Records
**As a** GPF administrator  
**I want to** view all saved year closing balance records for a selected employee  
**So that** I can see the complete history of their GPF account

**Acceptance Criteria:**
- 2.1 All saved year records for an account are displayed in the table
- 2.2 Records are sorted by year in descending order (newest first)
- 2.3 Each record shows year, closing balance, and account number
- 2.4 Table updates automatically after saving a new record

### 3. Data Integrity
**As a** system administrator  
**I want to** ensure data integrity for GPF year records  
**So that** the system maintains accurate and consistent data

**Acceptance Criteria:**
- 3.1 System prevents saving duplicate year records for the same account
- 3.2 All required fields (account number, year, closing balance) are validated
- 3.3 Closing balance must be a positive decimal value
- 3.4 Year must be a valid 4-digit number

## Technical Requirements

### Database Schema Changes
- Change primary key from single column (PASS_NUMBER) to composite key (PASS_NUMBER + GPF_YEARS)
- Add auto-generated ID column as primary key alternative
- Create unique constraint on (PASS_NUMBER, GPF_YEARS) combination

### Backend Changes
- Update GPFYears entity to use composite key or auto-generated ID
- Modify repository to check for existing year records before saving
- Update save endpoint to prevent duplicate year entries
- Ensure search returns all records for an account, sorted by year

### Frontend Changes
- No changes required (already displays records correctly)
- Verify table refreshes after successful save

## Out of Scope
- Editing existing year records
- Deleting year records
- Bulk import of year records
- Year-over-year comparison reports
