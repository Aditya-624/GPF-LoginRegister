# Add GPF Slips - User Details Table Implementation

## Overview
Modified the Add GPF Slips page to display user details in a table format. The table shows blank fields initially and fills with user data when they search and select a GPF account.

## Features

### 1. Search Functionality
- Search by GPF Account Number or Personnel Number
- Real-time search with dropdown results
- Select account from search results

### 2. User Details Table
- **Initially**: Shows empty table with blank fields (displays "-")
- **After Selection**: Fills with selected user's complete details
- **Clean Layout**: Single column layout with table below search

### 3. User Details Displayed
1. GPF Account Number
2. Personnel Number
3. Employee Name
4. Designation
5. Date of Birth (formatted)
6. Date of Retirement (formatted)
7. Basic Pay (formatted with ₹ symbol)
8. Phone Number

## Backend Implementation

### 1. Entity: `GPF.java`
Maps to the GPF table with 8 columns:
- `gpfAccountNumber` (BigDecimal) - Primary Key
- `persNumber` (String)
- `employeeName` (String)
- `designation` (String)
- `dob` (LocalDate)
- `dateOfRetirement` (LocalDate)
- `basicPay` (BigDecimal)
- `phoneNumber` (String)

### 2. Repository: `GPFRepository.java`
Methods:
- `searchByAccountOrPersNumber(String)` - Search by account or personnel number
- `findByGpfAccountNumber(BigDecimal)` - Find by exact account number
- `findByPersNumber(String)` - Find by personnel number

### 3. Controller: `GPFController.java`
Endpoints:

#### GET `/api/gpf/search?query={searchTerm}`
Search GPF accounts by account number or personnel number

**Example Request:**
```
GET http://localhost:8081/api/gpf/search?query=12345
```

**Example Response:**
```json
[
  {
    "gpfAccountNumber": 12345,
    "persNumber": "PERS001",
    "employeeName": "John Doe",
    "designation": "Senior Scientist",
    "dob": "1985-05-15",
    "dateOfRetirement": "2045-05-31",
    "basicPay": 75000,
    "phoneNumber": "9876543210"
  }
]
```

#### GET `/api/gpf/account/{accountNumber}`
Get specific GPF account by account number

#### GET `/api/gpf/all`
Get all GPF accounts

## Frontend Implementation

### Component: `AddGPFSlips.jsx`

**New State:**
- `userDetails` - Stores selected user's data for display in table

**Updated Functions:**
- `handleSearch()` - Searches GPF accounts via API
- `handleSelectEmployee()` - Sets user details and populates form
- `handleReset()` - Clears user details table

**UI Structure:**
```
┌─────────────────────────────────────┐
│  Search GPF Account                 │
│  [Input] [Search Button]            │
│  └─ Dropdown Results (when shown)   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  User Details Table                 │
│  ┌───────────────────┬─────────────┐│
│  │ Label             │ Value       ││
│  ├───────────────────┼─────────────┤│
│  │ GPF Account No    │ 12345       ││
│  │ Personnel Number  │ PERS001     ││
│  │ Employee Name     │ John Doe    ││
│  │ ...               │ ...         ││
│  └───────────────────┴─────────────┘│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  GPF Slip Form                      │
│  (Employee Information, Period, etc)│
└─────────────────────────────────────┘
```

### Styling: `AddGPFSlips.css`

**New Styles:**
- `.user-details-container` - Container for user details table
- `.user-details-table` - Table styling
- `.detail-label` - Label column (bold, uppercase)
- `.detail-value` - Value column (formatted data)

**Features:**
- Hover effects on table rows
- Responsive design for mobile
- Clean, professional appearance
- Proper spacing and borders

## User Flow

### Step 1: Initial State
```
User Details Table shows:
┌──────────────────────┬───────┐
│ GPF Account Number:  │   -   │
│ Personnel Number:    │   -   │
│ Employee Name:       │   -   │
│ Designation:         │   -   │
│ Date of Birth:       │   -   │
│ Date of Retirement:  │   -   │
│ Basic Pay:           │   -   │
│ Phone Number:        │   -   │
└──────────────────────┴───────┘
```

### Step 2: User Searches
1. User enters account number (e.g., "12345")
2. Clicks "Search" or presses Enter
3. Dropdown shows matching results

### Step 3: User Selects Account
1. User clicks "Select" on desired account
2. User Details Table fills with data:
```
┌──────────────────────┬──────────────────┐
│ GPF Account Number:  │ 12345            │
│ Personnel Number:    │ PERS001          │
│ Employee Name:       │ John Doe         │
│ Designation:         │ Senior Scientist │
│ Date of Birth:       │ 15-May-1985      │
│ Date of Retirement:  │ 31-May-2045      │
│ Basic Pay:           │ ₹75,000          │
│ Phone Number:        │ 9876543210       │
└──────────────────────┴──────────────────┘
```
3. Form fields auto-populate with Employee ID and Name
4. User can now fill remaining GPF slip details

### Step 4: Reset
- Click "Reset Form" button
- User Details Table clears back to "-"
- All form fields clear

## Data Formatting

### Date Format
- Input: `"1985-05-15"`
- Display: `"15-May-1985"` (Indian format)

### Currency Format
- Input: `75000`
- Display: `"₹75,000"` (Indian rupee with comma separator)

### Empty Values
- Display: `"-"` for null or empty fields

## API Testing

### Test Search
```bash
# Search by account number
curl "http://localhost:8081/api/gpf/search?query=12345"

# Search by personnel number
curl "http://localhost:8081/api/gpf/search?query=PERS001"

# Get all accounts
curl "http://localhost:8081/api/gpf/all"
```

### Test with Sample Data

First, insert sample data:
```sql
INSERT INTO GPF (
    GPF_ACCOUNTNUMBER,
    PERS_NUMBER,
    EMPLOYEE_NAME,
    DESIGNATION,
    DOB,
    DATE_OF_RETIREMENT,
    BASIC_PAY,
    PHONE_NUMBER
) VALUES (
    12345,
    'PERS001',
    'John Doe',
    'Senior Scientist',
    TO_DATE('1985-05-15', 'YYYY-MM-DD'),
    TO_DATE('2045-05-31', 'YYYY-MM-DD'),
    75000,
    '9876543210'
);

COMMIT;
```

Then test the search:
```
http://localhost:8081/api/gpf/search?query=12345
```

## Error Handling

### Frontend Alerts:
- Empty search query → "Please enter an Account Number or Personnel Number"
- No results found → "No GPF account found matching your search"
- Backend connection error → "Cannot connect to backend server..."
- API error → Displays error message from backend

### Backend Responses:
- 400 Bad Request → Empty query or invalid format
- 404 Not Found → No matching accounts
- 500 Internal Server Error → Database or server error

## Mobile Responsive

### Mobile View:
- Search bar stacks vertically
- User details table adjusts font sizes
- Labels and values remain readable
- Form fields stack in single column

### Tablet View:
- Optimized spacing
- Comfortable touch targets
- Readable text sizes

## Files Modified/Created

### Backend Files Created:
1. `GPF.java` - Entity for GPF table
2. `GPFRepository.java` - Repository with search methods
3. `GPFController.java` - REST API endpoints

### Frontend Files Modified:
1. `AddGPFSlips.jsx` - Added user details table and search
2. `AddGPFSlips.css` - Styled user details table

## Key Differences from Previous Implementation

### Before:
- Searched GPF_YEARS table (Pass Number, GPF Years, Closing Balance)
- Showed profile card on right side
- Two-column layout

### After:
- Searches GPF table (Account Number, Personnel Number, Employee details)
- Shows user details table below search
- Single-column layout
- Table shows blank fields initially, fills on selection

## Benefits

1. **Clear Visual Feedback**: User sees exactly what data is loaded
2. **Clean Layout**: Single column is easier to scan
3. **Professional Appearance**: Table format is familiar and organized
4. **Responsive**: Works well on all screen sizes
5. **Intuitive**: Blank fields → Search → Filled fields flow is natural

## Next Steps

1. Add sample data to GPF table for testing
2. Test search functionality with various queries
3. Verify data formatting (dates, currency)
4. Test on mobile devices
5. Add validation for form submission

## Troubleshooting

### No search results:
1. Verify GPF table has data: `SELECT * FROM GPF;`
2. Check account numbers match search query
3. Review backend logs for errors

### Table shows "-" after selection:
1. Check browser console for errors
2. Verify API response contains data
3. Check field names match between backend and frontend

### Backend not starting:
1. Verify port 8081 is available
2. Check Oracle database is running
3. Review application logs

## Support

Backend running on: `http://localhost:8081`
Frontend running on: `http://localhost:5173`

Test the search at: Add GPF Slips page → Search bar → Enter account number → Select result
