# GPF Year Closing Balance Implementation

## Overview
Added a GPF Year Closing Balance section below the user details table in the Add GPF Slips page. This allows users to enter and save the closing balance for a specific GPF year.

## Backend Changes

### GPFYearsController.java
Added a new POST endpoint to save GPF year data:

**Endpoint:** `POST /api/gpf-years/save`

**Request Body:**
```json
{
  "passNumber": "GPF123456",
  "gpfYears": 2024,
  "closingBalance": 150000.00
}
```

**Response:**
- Success (201): Returns the saved GPFYears object
- Error (400): Validation errors for missing fields
- Error (500): Server errors

**Validations:**
- Pass Number is required
- GPF Year is required
- Closing Balance is required

## Frontend Changes

### AddGPFSlips.jsx

**New State Variables:**
- `gpfYearData`: Stores year and closing balance input
- `isSavingGpfYear`: Loading state for submit button

**New Functions:**
- `handleGpfYearChange()`: Handles input changes for year and closing balance
- `handleGpfYearSubmit()`: Submits the GPF year data to the backend

**UI Components:**
The GPF Year section appears only when a user is selected and includes:
1. **GPF Year Input**: Number input for the year (defaults to current year)
2. **Closing Balance Input**: Number input with bold label for entering the balance
3. **Submit Button**: Saves the data to the database

### AddGPFSlips.css

**New Styles:**
- `.gpf-year-container`: Container styling matching user details table
- `.gpf-year-form`: Form layout
- `.gpf-year-inputs`: Flexbox layout for inputs and button
- `.gpf-year-field`: Individual field styling
- `.gpf-year-label`: Label styling with bold support
- `.gpf-year-input`: Input field styling with focus effects
- `.btn-gpf-year-submit`: Green submit button with hover effects

**Responsive Design:**
- Desktop: Horizontal layout with all fields in one row
- Mobile: Vertical stacked layout with full-width button

## Features

1. **Conditional Display**: Section only shows when an employee is selected
2. **Auto-fill Year**: Defaults to current year
3. **Validation**: 
   - Checks if employee is selected
   - Validates closing balance is positive
   - Required fields validation
4. **User Feedback**: 
   - Loading state during submission
   - Success/error alerts
   - Form reset after successful submission
5. **Styling**: Matches the existing design system with glassmorphism effects

## Database Table

**Table:** `GPF_YEARS`

**Columns:**
- `PASS_NUMBER` (VARCHAR, Primary Key): GPF Account Number
- `GPF_YEARS` (DECIMAL): The year
- `CLOSING_BALANCE` (DECIMAL): The closing balance amount

## Usage Flow

1. User searches and selects an employee
2. User details table displays employee information
3. GPF Year section appears below the table
4. User enters/modifies the year (defaults to current year)
5. User enters the closing balance amount
6. User clicks Submit button
7. Data is saved to GPF_YEARS table
8. Success message is shown
9. Form resets for next entry

## API Integration

**Base URL:** `http://localhost:8081`

**Save Endpoint:** `/api/gpf-years/save`
- Method: POST
- Content-Type: application/json
- Uses the selected employee's GPF Account Number as passNumber

## Error Handling

- Backend connection errors
- Validation errors
- Database errors
- User-friendly error messages displayed via alerts
