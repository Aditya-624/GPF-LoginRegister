# Database Integration Status

## Overview
This document outlines the database table connections and their integration with the frontend pages.

## Database Tables

### 1. USERS Table
- **Primary Key**: `id` (auto-generated)
- **Unique Keys**: `username`, `user_id`
- **Fields**: username, user_id, work_status, password, dob, security questions, password expiry
- **Entity**: `User.java`
- **Repository**: `UserRepository.java`
- **Controller**: `AuthController.java`

### 2. GPF Table
- **Primary Key**: `GPF_ACCOUNTNUMBER`
- **Fields**: PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER
- **Entity**: `GPF.java`
- **Repository**: `GPFRepository.java`
- **Controller**: `GPFController.java`
- **Endpoints**:
  - `GET /api/gpf/all` - Get all GPF records
  - `GET /api/gpf/search?query={term}` - Search by account/pers number/name
  - `GET /api/gpf/{accountNumber}` - Get by account number
  - `POST /api/gpf` - Create new GPF record
  - `PUT /api/gpf/{accountNumber}` - Update GPF record
  - `DELETE /api/gpf/{accountNumber}` - Delete GPF record

### 3. GPF_YEARS Table
- **Primary Key**: `ID` (auto-generated)
- **Unique Constraint**: (PASS_NUMBER, GPF_YEARS)
- **Fields**: PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE
- **Entity**: `GPFYears.java`
- **Repository**: `GPFYearsRepository.java`
- **Controller**: `GPFYearsController.java`
- **Endpoints**:
  - `GET /api/gpf-years/all` - Get all records
  - `GET /api/gpf-years/pass/{passNumber}` - Get all years for a pass number
  - `GET /api/gpf-years/search?query={term}` - Search by pass number
  - `POST /api/gpf-years` - Create new record
  - `PUT /api/gpf-years/{id}` - Update record
  - `DELETE /api/gpf-years/{id}` - Delete record

### 4. GPF_USR_DETAILS Table
- **Primary Key**: `ID` (auto-generated)
- **Fields**: APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE
- **Entity**: `GPFUsrDetails.java`
- **Repository**: `GPFUsrDetailsRepository.java`
- **Controller**: `GPFUsrDetailsController.java`
- **Endpoints**:
  - `GET /api/gpf-usr-details/all` - Get all records
  - `GET /api/gpf-usr-details/{id}` - Get by ID
  - `GET /api/gpf-usr-details/persno/{persno}` - Get by personnel number
  - `POST /api/gpf-usr-details` - Create new record
  - `PUT /api/gpf-usr-details/{id}` - Update record
  - `DELETE /api/gpf-usr-details/{id}` - Delete record

### 5. GPF_PURPOSE_E Table (Temporary Advances)
- **Primary Key**: `CODE`
- **Fields**: CODE, PURPOSE
- **Entity**: `GPFPurposeE.java`
- **Repository**: `GPFPurposeERepository.java`
- **Controller**: `GPFPurposeEController.java`
- **Endpoints**:
  - `GET /api/gpf-purpose-e/all` - Get all purposes
  - `GET /api/gpf-purpose-e/{code}` - Get by code
  - `POST /api/gpf-purpose-e` - Create new purpose
  - `PUT /api/gpf-purpose-e/{code}` - Update purpose
  - `DELETE /api/gpf-purpose-e/{code}` - Delete purpose

### 6. GPF_PURPOSE_F Table (Final Withdrawals)
- **Primary Key**: `CODE`
- **Fields**: CODE, PURPOSE
- **Entity**: `GPFPurposeF.java`
- **Repository**: `GPFPurposeFRepository.java`
- **Controller**: `GPFPurposeFController.java`
- **Endpoints**:
  - `GET /api/gpf-purpose/all` - Get all purposes
  - `GET /api/gpf-purpose/{code}` - Get by code
  - `POST /api/gpf-purpose` - Create new purpose
  - `PUT /api/gpf-purpose/{code}` - Update purpose
  - `DELETE /api/gpf-purpose/{code}` - Delete purpose

## Frontend Page Integrations

### GPFSlipDetails.jsx
**Current Integrations:**
✅ **USERS** - Gets user session data (userId, username, workStatus, dob)
✅ **GPF** - Fetches GPF details by userId/persNumber
✅ **GPF_YEARS** - Fetches closing balance for financial years
❌ **GPF_USR_DETAILS** - NOT YET INTEGRATED
❌ **GPF_PURPOSE_E** - NOT YET INTEGRATED
❌ **GPF_PURPOSE_F** - NOT YET INTEGRATED

**What's Working:**
- User details display from session storage
- GPF account information fetched from GPF table
- Financial year closing balances from GPF_YEARS table
- 4x4 grid layout for user details

**What's Missing:**
- No connection to GPF_USR_DETAILS for application history
- No connection to purpose tables for displaying purpose descriptions

### UserApplicationGPF.jsx
**Current Integrations:**
✅ **USERS** - Gets user session data (userId, username, workStatus, dob)
✅ **GPF** - Fetches GPF details by userId
✅ **GPF_PURPOSE_E** - Fetches temporary advance purposes for dropdown
✅ **GPF_PURPOSE_F** - Fetches final withdrawal purposes for dropdown
❌ **GPF_YEARS** - NOT YET INTEGRATED (needed for closing balance)
❌ **GPF_USR_DETAILS** - NOT YET INTEGRATED (for saving/loading applications)

**What's Working:**
- User details display from session storage
- GPF account information display
- Dynamic purpose dropdowns based on loan type selection
- Form fields for application data
- GPF Accumulation calculations (Total A)
- GPF Withdrawals calculations (Total B, Total A-B)

**What's Missing:**
- No auto-population of closing balance from GPF_YEARS
- No saving of application data to GPF_USR_DETAILS
- No loading of existing applications from GPF_USR_DETAILS
- No display of pending/approved applications from GPF_USR_DETAILS

## Relationship Mapping

```
USERS (user_id) 
  ↓
GPF (PERS_NUMBER) ← Links via user_id/PERS_NUMBER
  ↓
GPF_YEARS (PASS_NUMBER) ← Links via PERS_NUMBER
  ↓
GPF_USR_DETAILS (PERSNO) ← Links via PERS_NUMBER
  ↓
GPF_PURPOSE_E (CODE) ← Links via PURPOSE field (for temporary)
GPF_PURPOSE_F (CODE) ← Links via PURPOSE field (for final)
```

## Required Integrations

### For GPFSlipDetails.jsx:
1. ✅ Fetch user session data
2. ✅ Fetch GPF details by persNumber
3. ✅ Fetch GPF_YEARS closing balances
4. ❌ **TODO**: Fetch GPF_USR_DETAILS applications for the user
5. ❌ **TODO**: Display purpose descriptions from GPF_PURPOSE_E/F tables

### For UserApplicationGPF.jsx:
1. ✅ Fetch user session data
2. ✅ Fetch GPF details by persNumber
3. ✅ Fetch purpose options from GPF_PURPOSE_E/F
4. ❌ **TODO**: Fetch latest closing balance from GPF_YEARS
5. ❌ **TODO**: Save application data to GPF_USR_DETAILS
6. ❌ **TODO**: Fetch pending applications from GPF_USR_DETAILS
7. ❌ **TODO**: Fetch approved applications from GPF_USR_DETAILS

## API Endpoints Summary

### Base URL: `http://localhost:8080`

| Table | Endpoint | Method | Description |
|-------|----------|--------|-------------|
| USERS | `/api/auth/login` | POST | Login user |
| USERS | `/api/auth/register` | POST | Register user |
| GPF | `/api/gpf/search?query={term}` | GET | Search GPF records |
| GPF | `/api/gpf/{accountNumber}` | GET | Get GPF by account |
| GPF_YEARS | `/api/gpf-years/pass/{passNumber}` | GET | Get years by pass number |
| GPF_YEARS | `/api/gpf-years/search?query={term}` | GET | Search by pass number |
| GPF_USR_DETAILS | `/api/gpf-usr-details/persno/{persno}` | GET | Get applications by persno |
| GPF_USR_DETAILS | `/api/gpf-usr-details` | POST | Create application |
| GPF_PURPOSE_E | `/api/gpf-purpose-e/all` | GET | Get all temporary purposes |
| GPF_PURPOSE_F | `/api/gpf-purpose/all` | GET | Get all final purposes |

## Testing Checklist

### Backend Testing:
- [ ] All tables created in database
- [ ] All entities properly mapped
- [ ] All repositories have required methods
- [ ] All controllers expose correct endpoints
- [ ] CORS configured for frontend access
- [ ] Test data inserted in all tables

### Frontend Testing:
- [ ] User session storage working
- [ ] GPF details fetching working
- [ ] GPF_YEARS data displaying correctly
- [ ] Purpose dropdowns populating correctly
- [ ] Form submissions saving to database
- [ ] Application lists displaying correctly

## Next Steps

1. **Complete GPF_YEARS Integration in UserApplicationGPF**
   - Auto-fetch closing balance for current financial year
   - Display in "Closing Balance as per GPF-DS Statements" field

2. **Complete GPF_USR_DETAILS Integration**
   - Add save functionality to store application data
   - Add fetch functionality to load pending applications
   - Add fetch functionality to load approved applications
   - Display in respective tables

3. **Add Purpose Description Display**
   - Join GPF_USR_DETAILS with GPF_PURPOSE_E/F
   - Display purpose descriptions instead of codes

4. **Test End-to-End Flow**
   - User logs in → Session stored
   - Navigate to pages → Data loads from all tables
   - Submit application → Saves to GPF_USR_DETAILS
   - View applications → Displays from GPF_USR_DETAILS

## Status: ⚠️ PARTIALLY INTEGRATED

**Working**: User authentication, GPF data display, Purpose dropdowns, Basic calculations
**Pending**: GPF_YEARS auto-population, GPF_USR_DETAILS CRUD operations, Application history display
