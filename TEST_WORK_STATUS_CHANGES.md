# Test Work Status Changes

## Summary of Changes
✅ Backend compiles successfully
✅ Frontend builds successfully  
✅ No diagnostic errors found
✅ Database migration file created and improved

## Pre-Testing Checklist

### 1. Backup Database (Important!)
Before running the migration, backup your database:
```sql
-- Export users table
SELECT * FROM users;
```

### 2. Check Current Database State
```sql
-- Check if users table has email column
DESC users;

-- Count existing users
SELECT COUNT(*) FROM users;
```

## Testing Steps

### Step 1: Start Backend
```bash
cd drdo-BackEnd/loginregister
./mvnw.cmd spring-boot:run
```

**Expected Output:**
- Flyway migration V11 should execute successfully
- Application should start without errors
- Check logs for: "Migrating schema ... to version 11"

### Step 2: Verify Database Changes
```sql
-- Check new table structure
DESC users;

-- Verify work_status column exists
SELECT column_name, data_type, nullable 
FROM user_tab_columns 
WHERE table_name = 'USERS' AND column_name = 'WORK_STATUS';

-- Check constraint
SELECT constraint_name, constraint_type, search_condition 
FROM user_constraints 
WHERE table_name = 'USERS' AND constraint_name = 'CHK_WORK_STATUS';

-- Verify email column is gone
SELECT column_name 
FROM user_tab_columns 
WHERE table_name = 'USERS' AND column_name = 'EMAIL';
-- Should return no rows
```

### Step 3: Test Backend API
```bash
# Test registration endpoint
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "testuser123",
    "username": "testuser123",
    "workStatus": "OFFICER",
    "password": "Test@1234",
    "dob": "1990-01-01",
    "passwordExpiryDays": 30,
    "securityQuestion1": "What is your Nickname?",
    "securityAnswer1": "test",
    "securityQuestion2": "What is your First School Name?",
    "securityAnswer2": "school"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered"
}
```

### Step 4: Start Frontend
```bash
cd drdo-FrontEnd
npm run dev
```

### Step 5: Test Registration UI

1. **Navigate to Registration Page**
   - Open browser: http://localhost:5173
   - Click "Register" or navigate to registration

2. **Verify Work Status Field**
   - [ ] Field label shows "Employee Work Status *"
   - [ ] Icon shows 👔 (tie emoji)
   - [ ] Dropdown shows placeholder "-- Select Work Status --"
   - [ ] Three options available:
     - Government Officer
     - Industrial
     - Non Industrial

3. **Test Form Validation**
   - [ ] Try submitting without selecting work status → Should show error
   - [ ] Select a work status → Error should clear

4. **Complete Registration**
   - Fill all required fields:
     - Username: testuser456
     - Work Status: Select "Government Officer"
     - Date of Birth: Select a valid date
     - Password: Test@1234
     - Confirm Password: Test@1234
     - Password Expiry: 30
     - Security Questions: Answer both
   - [ ] Click "Create Account"
   - [ ] Should show success message
   - [ ] Should redirect to login page

5. **Verify in Database**
```sql
SELECT user_id, username, work_status, dob 
FROM users 
WHERE user_id = 'testuser456';
```

**Expected Result:**
```
USER_ID      USERNAME     WORK_STATUS  DOB
testuser456  testuser456  OFFICER      1990-01-01
```

### Step 6: Test Login
1. Login with newly created user
2. Verify dashboard loads correctly
3. Check profile page displays correctly

## Test Different Work Status Values

### Test 1: OFFICER
```json
{
  "userId": "officer001",
  "username": "officer001",
  "workStatus": "OFFICER",
  ...
}
```

### Test 2: INDUSTRIAL
```json
{
  "userId": "industrial001",
  "username": "industrial001",
  "workStatus": "INDUSTRIAL",
  ...
}
```

### Test 3: NON_INDUSTRIAL
```json
{
  "userId": "nonindustrial001",
  "username": "nonindustrial001",
  "workStatus": "NON_INDUSTRIAL",
  ...
}
```

### Test 4: Invalid Value (Should Fail)
```json
{
  "userId": "invalid001",
  "username": "invalid001",
  "workStatus": "INVALID_STATUS",
  ...
}
```

**Expected:** Database constraint violation error

## Validation Tests

### Frontend Validation
- [ ] Empty work status shows error
- [ ] Valid selection clears error
- [ ] Dropdown is keyboard accessible
- [ ] Dropdown works on mobile

### Backend Validation
- [ ] NULL work_status rejected
- [ ] Invalid work_status values rejected
- [ ] Valid values accepted

## Error Scenarios to Test

1. **Missing Work Status**
   - Don't select work status
   - Try to submit
   - Should show: "Work Status is required"

2. **Database Constraint**
   - Try to insert invalid value directly via SQL
   - Should fail with constraint violation

3. **Existing Functionality**
   - [ ] Login still works
   - [ ] Password change still works
   - [ ] Password recovery still works
   - [ ] Profile page still works

## Rollback Plan (If Issues Found)

If you encounter issues:

1. **Stop the application**

2. **Create rollback migration** (V12__rollback_work_status.sql):
```sql
-- Add email column back
ALTER TABLE users ADD email VARCHAR2(100);

-- Drop work_status column
ALTER TABLE users DROP COLUMN work_status;

-- Add unique constraint back
ALTER TABLE users ADD CONSTRAINT uniq_users_email UNIQUE (email);
```

3. **Revert code changes** using git:
```bash
git checkout HEAD -- drdo-BackEnd/loginregister/src/main/java/com/adithya/loginregister/entity/User.java
git checkout HEAD -- drdo-BackEnd/loginregister/src/main/java/com/adithya/loginregister/payload/RegisterRequest.java
git checkout HEAD -- drdo-BackEnd/loginregister/src/main/java/com/adithya/loginregister/service/AuthenticationService.java
git checkout HEAD -- drdo-BackEnd/loginregister/src/main/java/com/adithya/loginregister/controller/AuthController.java
git checkout HEAD -- drdo-FrontEnd/src/components/Registration.jsx
```

## Success Criteria

✅ All tests pass
✅ No errors in backend logs
✅ No errors in frontend console
✅ Users can register with work status
✅ Work status is saved correctly
✅ All existing functionality works

## Known Issues / Notes

1. **Existing Users**: If you have existing users, they will be assigned "OFFICER" as default work status during migration.

2. **No Email**: Email field is completely removed. Password recovery relies only on security questions.

3. **Database Constraint**: Only three values are allowed: OFFICER, INDUSTRIAL, NON_INDUSTRIAL.

## Files Changed

### Backend
- ✅ V11__replace_email_with_work_status.sql
- ✅ User.java
- ✅ RegisterRequest.java
- ✅ AuthenticationService.java
- ✅ AuthController.java

### Frontend
- ✅ Registration.jsx

## Compilation Status

- ✅ Backend: BUILD SUCCESS (4.236s)
- ✅ Frontend: Built successfully (6.23s)
- ✅ No diagnostic errors
