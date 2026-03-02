# Frontend Error Troubleshooting Guide

## Common Errors and Solutions

### Error 1: "Cannot read property 'map' of undefined"
**Cause:** Trying to map over data that hasn't loaded yet

**Solution:** Check if data exists before mapping
```javascript
// In UserApplicationGPF.jsx or GPFSlipDetails.jsx
{purposeOptions && purposeOptions.map(...)}
// or
{purposeOptions?.map(...)}
```

### Error 2: "gpfWithdrawals is not defined"
**Cause:** Missing state initialization

**Solution:** Already fixed in the code. Check if this line exists:
```javascript
const [gpfWithdrawals, setGpfWithdrawals] = useState({
  approved: 0
});
```

### Error 3: "calculateTotalB is not a function"
**Cause:** Function not defined

**Solution:** Already fixed. Check if these functions exist:
```javascript
const calculateTotalB = () => {
  return gpfWithdrawals.approved;
};

const calculateTotalAMinusB = () => {
  return calculateTotalA() - calculateTotalB();
};
```

### Error 4: "handleWithdrawalsChange is not a function"
**Cause:** Handler function not defined

**Solution:** Already fixed. Check if this exists:
```javascript
const handleWithdrawalsChange = (field, value) => {
  setGpfWithdrawals(prev => ({
    ...prev,
    [field]: parseFloat(value) || 0
  }));
};
```

### Error 5: Module not found errors
**Cause:** Missing dependencies

**Solution:**
```bash
cd drdo-FrontEnd
npm install
```

### Error 6: Port already in use
**Cause:** Another process using port 5173

**Solution:**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change port in vite.config.js
```

### Error 7: CORS errors
**Cause:** Backend not allowing frontend requests

**Solution:** Check backend CORS configuration in controllers:
```java
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
```

### Error 8: "Failed to fetch" or Network errors
**Cause:** Backend not running or wrong URL

**Solution:**
1. Check if Spring Boot is running on port 8080
2. Check API URLs in frontend code
3. Check browser Network tab for failed requests

## How to Debug

### Step 1: Open Browser Console
- Press F12
- Go to Console tab
- Look for red error messages
- Copy the exact error text

### Step 2: Check Network Tab
- Press F12
- Go to Network tab
- Reload page
- Look for failed requests (red)
- Click on failed request to see details

### Step 3: Check React DevTools
- Install React DevTools extension
- Check component state
- Check props being passed

### Step 4: Check Backend Logs
- Look at Spring Boot console
- Check for any errors or exceptions
- Verify API endpoints are accessible

## Quick Fixes

### Fix 1: Clear Cache and Restart
```bash
# Stop frontend (Ctrl+C)
cd drdo-FrontEnd
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

### Fix 2: Check Environment
```bash
# Verify Node version
node --version  # Should be 16+

# Verify npm version
npm --version   # Should be 8+
```

### Fix 3: Rebuild
```bash
cd drdo-FrontEnd
npm run build
npm run preview
```

## Specific Component Checks

### UserApplicationGPF.jsx
Check these are defined:
- [ ] `gpfAccumulation` state
- [ ] `gpfWithdrawals` state
- [ ] `calculateTotalA()` function
- [ ] `calculateTotalB()` function
- [ ] `calculateTotalAMinusB()` function
- [ ] `handleAccumulationChange()` function
- [ ] `handleWithdrawalsChange()` function

### GPFSlipDetails.jsx
Check these are defined:
- [ ] `userSession` state
- [ ] `gpfDetails` state
- [ ] `fetchGPFDetails()` function
- [ ] `handleFetchDetails()` function

## Common React Errors

### "React is not defined"
**Solution:** Check imports at top of file:
```javascript
import { useState, useEffect } from 'react';
```

### "useNavigate is not defined"
**Solution:** Check import:
```javascript
import { useNavigate } from 'react-router-dom';
```

### "Cannot find module"
**Solution:** Check all imports are correct and files exist

## If Error Persists

Please provide:
1. **Exact error message** from browser console
2. **Screenshot** of the error
3. **Which page** you're on when error occurs
4. **What action** triggers the error
5. **Browser** you're using
6. **Node version** (`node --version`)
7. **npm version** (`npm --version`)

## Emergency Reset

If nothing works:
```bash
# 1. Stop all processes
# 2. Delete node_modules
cd drdo-FrontEnd
rm -rf node_modules
rm -rf dist
rm package-lock.json

# 3. Reinstall
npm install

# 4. Restart
npm run dev
```

## Contact Points

Check these files if you need to verify code:
- `drdo-FrontEnd/src/components/UserApplicationGPF.jsx`
- `drdo-FrontEnd/src/components/GPFSlipDetails.jsx`
- `drdo-FrontEnd/src/services/userService.js`
- `drdo-FrontEnd/src/App.jsx`
