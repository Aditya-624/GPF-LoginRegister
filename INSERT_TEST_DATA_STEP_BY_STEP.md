# Step-by-Step Guide to Insert Test Data

## 🚀 Quick Start

### Option 1: Using H2 Console (Recommended)

1. **Start Spring Boot Application**
   ```bash
   cd drdo-BackEnd/loginregister
   mvnw spring-boot:run
   ```

2. **Open H2 Console**
   - Open browser: http://localhost:8080/h2-console
   - JDBC URL: `jdbc:h2:./data/testdb`
   - Username: `sa`
   - Password: (leave empty)
   - Click "Connect"

3. **Insert Test Data**
   - Open the file `COMPLETE_TEST_DATA.sql`
   - Copy all SQL statements
   - Paste into H2 Console SQL editor
   - Click "Run" button
   - ✅ You should see "Success" messages

4. **Verify Data**
   - Run verification queries at the end of the SQL file
   - Check that all tables have data

### Option 2: Using SQL File Directly

If your application supports SQL file execution:

```bash
# From the project root directory
cd drdo-BackEnd/loginregister
# Run the SQL file (if you have H2 command line tools)
java -cp h2*.jar org.h2.tools.RunScript -url jdbc:h2:./data/testdb -script ../../COMPLETE_TEST_DATA.sql
```

---

## 📋 Manual Insertion (If Needed)

If you prefer to insert data manually, follow this order:

### Step 1: Insert Users (Required First)
```sql
INSERT INTO users (user_id, username, work_status, password, dob, security_question_1, security_answer_1, security_question_2, security_answer_2, password_expiry_days, last_password_change_date) 
VALUES 
('OFF001', 'rajesh.kumar', 'OFFICER', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1985-05-15', 'What is your favorite color?', 'blue', 'What is your pet name?', 'tommy', 90, CURRENT_DATE);

INSERT INTO users (user_id, username, work_status, password, dob, security_question_1, security_answer_1, security_question_2, security_answer_2, password_expiry_days, last_password_change_date) 
VALUES 
('IND001', 'priya.sharma', 'INDUSTRIAL', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1990-08-22', 'What is your favorite color?', 'red', 'What is your pet name?', 'fluffy', 90, CURRENT_DATE);

INSERT INTO users (user_id, username, work_status, password, dob, security_question_1, security_answer_1, security_question_2, security_answer_2, password_expiry_days, last_password_change_date) 
VALUES 
('NON001', 'amit.patel', 'NON_INDUSTRIAL', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1988-12-10', 'What is your favorite color?', 'green', 'What is your pet name?', 'buddy', 90, CURRENT_DATE);
```

### Step 2: Insert GPF Accounts
```sql
INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
VALUES 
(100001, 'OFF001', 'Rajesh Kumar', 'SENIOR TECHNICAL OFFICER', '1985-05-15', '2045-05-31', 75000.00, '9876543210');

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
VALUES 
(100002, 'IND001', 'Priya Sharma', 'INDUSTRIAL WORKER GRADE-II', '1990-08-22', '2050-08-31', 45000.00, '9876543211');

INSERT INTO GPF (GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION, DOB, DATE_OF_RETIREMENT, BASIC_PAY, PHONE_NUMBER)
VALUES 
(100003, 'NON001', 'Amit Patel', 'NON-INDUSTRIAL STAFF', '1988-12-10', '2048-12-31', 35000.00, '9876543212');
```

### Step 3: Insert GPF Years (4 years per user)
```sql
-- Rajesh Kumar
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('OFF001', 2022, 850000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('OFF001', 2023, 920000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('OFF001', 2024, 1050000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('OFF001', 2025, 1150000.00);

-- Priya Sharma
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('IND001', 2022, 450000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('IND001', 2023, 520000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('IND001', 2024, 580000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('IND001', 2025, 650000.00);

-- Amit Patel
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('NON001', 2022, 320000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('NON001', 2023, 380000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('NON001', 2024, 425000.00);
INSERT INTO GPF_YEARS (PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE) VALUES ('NON001', 2025, 480000.00);
```

### Step 4: Insert Purpose Tables
```sql
-- Temporary Purposes
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE) VALUES (1, 'Medical Emergency');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE) VALUES (2, 'Education of Children');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE) VALUES (3, 'House Repair and Renovation');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE) VALUES (4, 'Purchase of Consumer Durables');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE) VALUES (5, 'Marriage Expenses');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE) VALUES (6, 'Travel and Tourism');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE) VALUES (7, 'Debt Repayment');
INSERT INTO GPF_PURPOSE_E (CODE, PURPOSE) VALUES (8, 'Other Personal Needs');

-- Final Purposes
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE) VALUES (1, 'House Construction');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE) VALUES (2, 'Purchase of House/Flat');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE) VALUES (3, 'Marriage of Self/Children');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE) VALUES (4, 'Higher Education');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE) VALUES (5, 'Medical Treatment');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE) VALUES (6, 'Starting Business');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE) VALUES (7, 'Retirement Settlement');
INSERT INTO GPF_PURPOSE_F (CODE, PURPOSE) VALUES (8, 'Other Approved Purposes');
```

### Step 5: Insert Sample Applications (Optional)
```sql
-- Applications for testing
INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (50000.00, '2025-02-15', 'Y', 'T', '123 MG Road, Bangalore', 100001, 1);

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (30000.00, '2025-02-20', 'Y', 'T', '456 Park Street, Mumbai', 100002, 2);

INSERT INTO GPF_USR_DETAILS (APPL_AMT, APPL_DATE, ENCLOSERS, GPF_TYPE, HOUSE_ADDR, PERSNO, PURPOSE)
VALUES (100000.00, '2025-02-25', 'Y', 'F', '789 Lake View, Delhi', 100003, 3);
```

---

## ✅ Verification Steps

### 1. Check Users Table
```sql
SELECT user_id, username, work_status, dob FROM users ORDER BY user_id;
```
Expected: 3 rows (OFF001, IND001, NON001)

### 2. Check GPF Table
```sql
SELECT GPF_ACCOUNTNUMBER, PERS_NUMBER, EMPLOYEE_NAME, DESIGNATION FROM GPF ORDER BY PERS_NUMBER;
```
Expected: 3 rows (100001, 100002, 100003)

### 3. Check GPF_YEARS Table
```sql
SELECT PASS_NUMBER, GPF_YEARS, CLOSING_BALANCE FROM GPF_YEARS ORDER BY PASS_NUMBER, GPF_YEARS;
```
Expected: 12 rows (4 years × 3 users)

### 4. Check Purpose Tables
```sql
SELECT COUNT(*) as count FROM GPF_PURPOSE_E;
SELECT COUNT(*) as count FROM GPF_PURPOSE_F;
```
Expected: 8 rows each

### 5. Check Applications
```sql
SELECT ID, PERSNO, APPL_AMT, GPF_TYPE FROM GPF_USR_DETAILS ORDER BY PERSNO;
```
Expected: 6 rows (2 per user)

---

## 🧪 Test the Application

### 1. Start Backend
```bash
cd drdo-BackEnd/loginregister
mvnw spring-boot:run
```
Wait for: "Started LoginregisterApplication"

### 2. Start Frontend
```bash
cd drdo-FrontEnd
npm run dev
```
Open: http://localhost:5173

### 3. Login with Test User
```
Username: rajesh.kumar
Password: Test@1234
```

### 4. Navigate to Pages
- Click "GPF Slip Details"
- Check if data displays
- Click "User Application GPF"
- Check if form works

---

## 🎯 Expected Results After Data Insertion

### Login Page:
- ✅ Can login with any of the 3 test users
- ✅ Password: Test@1234 works for all

### Dashboard:
- ✅ Shows user name
- ✅ Shows navigation buttons

### GPF Slip Details:
- ✅ Shows user details in 4x4 grid
- ✅ Financial year dropdown has years
- ✅ Work status dropdown has options
- ✅ Fetch Details shows employees with closing balances

### User Application GPF:
- ✅ Shows user information
- ✅ Shows GPF account details
- ✅ Loan type dropdown works
- ✅ Purpose dropdown populates based on loan type
- ✅ All form fields accept input
- ✅ Calculations work (Total A, B, A-B)

---

## 🔧 Troubleshooting

### Problem: Data not inserting
**Solution:**
- Check if Spring Boot is running
- Check H2 console connection
- Verify JDBC URL is correct
- Check for unique constraint violations

### Problem: Login fails
**Solution:**
- Verify users table has data
- Check password hash is correct
- Clear browser cache
- Check CORS configuration

### Problem: Data not displaying
**Solution:**
- Check browser console for errors
- Verify API endpoints are accessible
- Check session storage has user data
- Verify database has data

### Problem: Calculations not working
**Solution:**
- Check browser console for JavaScript errors
- Verify input fields accept numbers
- Check React state updates

---

## 📞 Quick Reference

### Test User Credentials:
| Username | Password | User ID | Work Status |
|----------|----------|---------|-------------|
| rajesh.kumar | Test@1234 | OFF001 | OFFICER |
| priya.sharma | Test@1234 | IND001 | INDUSTRIAL |
| amit.patel | Test@1234 | NON001 | NON_INDUSTRIAL |

### Database Access:
- **H2 Console**: http://localhost:8080/h2-console
- **JDBC URL**: jdbc:h2:./data/testdb
- **Username**: sa
- **Password**: (empty)

### Application URLs:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080
- **API Base**: http://localhost:8080/api

---

## ✨ You're Ready to Test!

After inserting the test data, you can:
1. Login with any of the 3 test users
2. Navigate to both pages
3. See real data from the database
4. Test all features
5. Verify calculations work correctly

Good luck with testing! 🚀
