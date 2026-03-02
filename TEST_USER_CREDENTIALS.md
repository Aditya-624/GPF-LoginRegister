# Test User Credentials and Expected Results

## 🔐 Login Credentials

### User 1: Senior Officer
```
Username: rajesh.kumar
Password: Test@1234
User ID: OFF001
Work Status: OFFICER
```

### User 2: Industrial Worker
```
Username: priya.sharma
Password: Test@1234
User ID: IND001
Work Status: INDUSTRIAL
```

### User 3: Non-Industrial Staff
```
Username: amit.patel
Password: Test@1234
User ID: NON001
Work Status: NON_INDUSTRIAL
```

## 📊 Expected Data for Each User

### User 1: Rajesh Kumar (OFF001)

#### Personal Details:
- **Name**: Rajesh Kumar
- **Designation**: SENIOR TECHNICAL OFFICER
- **DOB**: 15/05/1985
- **Date of Retirement**: 31/05/2045
- **Basic Pay**: ₹75,000
- **Phone**: 9876543210
- **GPF Account**: 100001

#### GPF Years Closing Balances:
| Year | Closing Balance |
|------|----------------|
| 2022 | ₹8,50,000 |
| 2023 | ₹9,20,000 |
| 2024 | ₹10,50,000 |
| 2025 | ₹11,50,000 |

#### Applications:
**Pending:**
- Type: Temporary Advance
- Purpose: Medical Emergency
- Amount: ₹50,000
- Date: 15/02/2025

**Approved:**
- Type: Final Withdrawal
- Purpose: House Construction
- Amount: ₹2,00,000
- Date: 20/11/2024

---

### User 2: Priya Sharma (IND001)

#### Personal Details:
- **Name**: Priya Sharma
- **Designation**: INDUSTRIAL WORKER GRADE-II
- **DOB**: 22/08/1990
- **Date of Retirement**: 31/08/2050
- **Basic Pay**: ₹45,000
- **Phone**: 9876543211
- **GPF Account**: 100002

#### GPF Years Closing Balances:
| Year | Closing Balance |
|------|----------------|
| 2022 | ₹4,50,000 |
| 2023 | ₹5,20,000 |
| 2024 | ₹5,80,000 |
| 2025 | ₹6,50,000 |

#### Applications:
**Pending:**
- Type: Temporary Advance
- Purpose: Education of Children
- Amount: ₹30,000
- Date: 20/02/2025

**Approved:**
- Type: Temporary Advance
- Purpose: Marriage Expenses
- Amount: ₹25,000
- Date: 15/10/2024

---

### User 3: Amit Patel (NON001)

#### Personal Details:
- **Name**: Amit Patel
- **Designation**: NON-INDUSTRIAL STAFF
- **DOB**: 10/12/1988
- **Date of Retirement**: 31/12/2048
- **Basic Pay**: ₹35,000
- **Phone**: 9876543212
- **GPF Account**: 100003

#### GPF Years Closing Balances:
| Year | Closing Balance |
|------|----------------|
| 2022 | ₹3,20,000 |
| 2023 | ₹3,80,000 |
| 2024 | ₹4,25,000 |
| 2025 | ₹4,80,000 |

#### Applications:
**Pending:**
- Type: Final Withdrawal
- Purpose: Marriage of Self/Children
- Amount: ₹1,00,000
- Date: 25/02/2025

**Approved:**
- Type: Temporary Advance
- Purpose: House Repair and Renovation
- Amount: ₹20,000
- Date: 10/12/2024

---

## 🧪 Testing Scenarios

### Scenario 1: Login as Rajesh Kumar (Officer)

1. **Login**
   - Username: `rajesh.kumar`
   - Password: `Test@1234`
   - ✅ Expected: Successful login, redirected to Dashboard

2. **Navigate to GPF Slip Details**
   - ✅ Expected User Details Display:
     - Name: Rajesh Kumar
     - Designation: SENIOR TECHNICAL OFFICER
     - DOB: 15/05/1985
     - ID: OFF001
   
   - Select Financial Year: 2024-25
   - Select Work Status: OFFICER
   - Click "Fetch Details"
   - ✅ Expected: Shows Rajesh Kumar with closing balance ₹11,50,000

3. **Navigate to User Application GPF**
   - ✅ Expected User Info:
     - rajesh.kumar | SENIOR TECHNICAL OFFICER | DOB: 15/05/1985 | ID: OFF001
   
   - ✅ Expected GPF Accumulation Section:
     - Can enter closing balance: 1150000
     - Can enter GPF subscription
     - Can enter refunds
     - Can enter recovery
     - Total (A) calculates automatically
   
   - ✅ Expected GPF Withdrawals Section:
     - Can enter approved amount
     - Total (B) calculates automatically
     - Total (A-B) calculates automatically
   
   - Select Loan Type: TEMPORARY
   - ✅ Expected: Purpose dropdown shows:
     - Medical Emergency
     - Education of Children
     - House Repair and Renovation
     - Purchase of Consumer Durables
     - Marriage Expenses
     - Travel and Tourism
     - Debt Repayment
     - Other Personal Needs
   
   - Select Loan Type: FINAL
   - ✅ Expected: Purpose dropdown shows:
     - House Construction
     - Purchase of House/Flat
     - Marriage of Self/Children
     - Higher Education
     - Medical Treatment
     - Starting Business
     - Retirement Settlement
     - Other Approved Purposes

---

### Scenario 2: Login as Priya Sharma (Industrial)

1. **Login**
   - Username: `priya.sharma`
   - Password: `Test@1234`
   - ✅ Expected: Successful login

2. **Navigate to GPF Slip Details**
   - Select Work Status: INDUSTRIAL
   - ✅ Expected: Shows Priya Sharma with closing balance ₹6,50,000

3. **Navigate to User Application GPF**
   - ✅ Expected: All form fields work
   - ✅ Expected: Purpose dropdowns populate correctly
   - ✅ Expected: Calculations work (Total A, B, A-B)

---

### Scenario 3: Login as Amit Patel (Non-Industrial)

1. **Login**
   - Username: `amit.patel`
   - Password: `Test@1234`
   - ✅ Expected: Successful login

2. **Navigate to GPF Slip Details**
   - Select Work Status: NON_INDUSTRIAL
   - ✅ Expected: Shows Amit Patel with closing balance ₹4,80,000

3. **Navigate to User Application GPF**
   - ✅ Expected: All features work correctly

---

## 🔍 Verification Checklist

### After Inserting Test Data:

#### Backend Verification:
- [ ] Start Spring Boot application
- [ ] Check H2 Console: http://localhost:8080/h2-console
- [ ] Run verification queries from SQL script
- [ ] Verify 3 users in USERS table
- [ ] Verify 3 GPF accounts in GPF table
- [ ] Verify 12 year records in GPF_YEARS table (4 per user)
- [ ] Verify 8 purposes in GPF_PURPOSE_E table
- [ ] Verify 8 purposes in GPF_PURPOSE_F table
- [ ] Verify 6 applications in GPF_USR_DETAILS table (2 per user)

#### Frontend Verification:
- [ ] Start React application
- [ ] Login with each user
- [ ] Check session storage has user data
- [ ] Navigate to GPF Slip Details
- [ ] Verify user details display correctly
- [ ] Verify closing balances display correctly
- [ ] Navigate to User Application GPF
- [ ] Verify user info displays correctly
- [ ] Verify purpose dropdowns populate
- [ ] Verify calculations work
- [ ] Test all 3 users

#### API Endpoint Testing:
```bash
# Test GPF Search (after login)
GET http://localhost:8080/api/gpf/search?query=OFF001

# Test GPF Years
GET http://localhost:8080/api/gpf-years/search?query=OFF001

# Test Purpose E
GET http://localhost:8080/api/gpf-purpose-e/all

# Test Purpose F
GET http://localhost:8080/api/gpf-purpose/all

# Test User Details
GET http://localhost:8080/api/gpf-usr-details/persno/100001
```

---

## 📝 Test Calculation Examples

### Example 1: Rajesh Kumar's GPF Calculation

**Inputs:**
- Closing Balance (2024-25): ₹11,50,000
- GPF Subscription (Mar 2025 - Feb 2026): ₹60,000
- GPF Refund: ₹0
- Recovery from Arrears: ₹5,000

**Expected Calculations:**
- Total (A) = 1150000 + 60000 - 0 - 5000 = ₹12,05,000

**Withdrawals:**
- Approved: ₹50,000

**Expected Calculations:**
- Total (B) = ₹50,000
- Total (A-B) = 1205000 - 50000 = ₹11,55,000

---

### Example 2: Priya Sharma's GPF Calculation

**Inputs:**
- Closing Balance (2024-25): ₹6,50,000
- GPF Subscription: ₹36,000
- GPF Refund: ₹10,000
- Recovery from Arrears: ₹0

**Expected Calculations:**
- Total (A) = 650000 + 36000 - 10000 - 0 = ₹6,76,000

**Withdrawals:**
- Approved: ₹30,000

**Expected Calculations:**
- Total (B) = ₹30,000
- Total (A-B) = 676000 - 30000 = ₹6,46,000

---

## 🎯 Success Criteria

### ✅ All Tests Pass If:
1. All 3 users can login successfully
2. Session storage contains correct user data
3. GPF Slip Details shows correct closing balances for each user
4. User Application GPF displays correct user information
5. Purpose dropdowns populate with correct data
6. All calculations (Total A, B, A-B) work correctly
7. No console errors in browser
8. No errors in Spring Boot logs
9. All API calls return 200 status
10. Data persists across page refreshes

---

## 🚨 Troubleshooting

### If Login Fails:
- Check if Spring Boot is running on port 8080
- Check if users table has data
- Check password hash is correct
- Check CORS configuration

### If Data Doesn't Display:
- Check browser console for API errors
- Check Network tab for failed requests
- Verify session storage has user data
- Check Spring Boot logs for errors

### If Calculations Don't Work:
- Check browser console for JavaScript errors
- Verify input fields accept numbers
- Check state updates in React DevTools

---

## 📞 Support

If you encounter any issues:
1. Check browser console (F12)
2. Check Spring Boot logs
3. Verify database has test data
4. Check API endpoints in Network tab
5. Verify session storage in Application tab
