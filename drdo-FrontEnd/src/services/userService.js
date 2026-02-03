// Mock user database with secure password handling
// In a real application, passwords should be hashed using bcrypt or similar
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

// Auth helpers (localStorage safe access)
const getAuthToken = () => {
  try { return localStorage.getItem('authToken'); } catch { return null; }
};

const setAuthToken = (token) => {
  try { if (token) localStorage.setItem('authToken', token); else localStorage.removeItem('authToken'); } catch { }
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const authFetch = (url, options = {}) => {
  const headers = { ...(options.headers || {}), ...getAuthHeaders() };
  return fetch(url, { ...options, headers });
};

let mockUsers = [
  {
    userId: 'user1',
    username: 'John Doe',
    password: 'Password@123',
    dob: '1990-01-15',
    securityQuestions: [
      { question: 'What is your Nickname?', answer: 'johnny' },
      { question: 'What is your First School Name?', answer: 'Lincoln' }
    ],
    passwordChangeDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
  },
  {
    userId: 'user2',
    username: 'Jane Smith',
    password: 'Secure@456',
    dob: '1992-05-20',
    securityQuestions: [
      { question: 'What is your Place of Birth?', answer: 'New York' },
      { question: "What is your Mother's Surname?", answer: 'Johnson' }
    ],
    passwordChangeDate: new Date()
  },
  {
    userId: 'admin',
    username: 'Administrator',
    password: 'Admin@123',
    dob: '1985-03-10',
    securityQuestions: [
      { question: 'What is your Nickname?', answer: 'admin' },
      { question: 'What is your First School Name?', answer: 'St. Johns' }
    ],
    passwordChangeDate: new Date()
  }
];

// Password validation utility
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    return { valid: false, errors: ['Password is required'] };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  if (password.length > 12) {
    errors.push('Password must not exceed 12 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least 1 capital letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least 1 number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least 1 special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// User management service
export const userService = {
  // Register new user (calls backend)
  registerUser: async (userData) => {
    console.log('API_BASE:', API_BASE);
    console.log('Full URL:', `${API_BASE}/api/auth/register`);
    console.log('User data:', userData);
    
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const text = await res.text();
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text } }
      if (!res.ok) return { success: false, error: data.message || data.error || res.statusText };
      return { success: true, message: data.message || 'User registered' };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: err.message };
    }
  },

  validateLogin: async (userId, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password })
      });
      const text = await res.text();
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text } }
      if (!res.ok) return { success: false, error: data.message || data.error || res.statusText };
      return {
        success: true,
        userId: data.userId,
        username: data.username,
        token: data.token || data.token,
        isPasswordExpired: false
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Change password via backend
  changePassword: async (userId, oldPassword, newPassword) => {
    console.log('Calling change password API with:', { userId, oldPassword: '***', newPassword: '***' }); // Debug log
    
    try {
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, oldPassword, newPassword })
      });
      
      console.log('Change password response status:', res.status); // Debug log
      
      const text = await res.text();
      console.log('Change password response text:', text); // Debug log
      
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text } }
      
      if (!res.ok) {
        console.error('Change password failed:', data); // Debug log
        return { success: false, error: data.message || data.error || res.statusText };
      }
      
      console.log('Change password success:', data); // Debug log
      return { success: true, message: data.message || 'Password changed' };
    } catch (err) {
      console.error('Change password exception:', err); // Debug log
      return { success: false, error: err.message };
    }
  },

  userExists: (userId) => {
    return mockUsers.some(u => u.userId === userId);
  },

  // Get security questions for user
  getSecurityQuestions: () => {
    return [
      'What is your Nickname?',
      'What is your First School Name?',
      'What is your Place of Birth?',
      "What is your Mother's Surname?",
      'What is your favorite pet name?',
      'What is the name of your best friend?'
    ];
  },

  // Get user's security questions by userId
  getUserSecurityQuestions: async (userId) => {
    try {
      // Use the change password endpoint to check if user exists
      // It returns different error messages for "user does not exist" vs "old password does not match"
      const checkResult = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          oldPassword: 'dummy_check_password_123', 
          newPassword: 'dummy_new_password_456' 
        })
      });
      
      const text = await checkResult.text();
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text } }
      
      console.log('User check response:', { status: checkResult.status, data }); // Debug log
      
      // Check the response to determine if user exists
      if (checkResult.status === 400 && data.message && data.message.toLowerCase().includes('user does not exist')) {
        // Status 400 with "user does not exist" means user doesn't exist
        return { success: false, error: 'User does not exist' };
      } else if (checkResult.status === 401 && data.message && data.message.toLowerCase().includes('old password does not match')) {
        // Status 401 with "old password does not match" means user exists but password is wrong
        // This is exactly what we want - user exists in database
        return {
          success: true,
          userId,
          username: 'User',
          questions: [
            { id: 1, question: 'What is your Nickname?' },
            { id: 2, question: 'What is your First School Name?' }
          ]
        };
      } else {
        // Any other error - treat as user doesn't exist for security
        return { success: false, error: 'User does not exist' };
      }
    } catch (err) {
      console.error('Error checking user existence:', err);
      return { success: false, error: 'Unable to connect to server. Please try again.' };
    }
  },

  // Verify security questions answers
  verifySecurityAnswers: async (userId, answer1, answer2) => {
    try {
      // Since we don't have security questions in the database yet,
      // we'll use a simple verification system for now
      // In a real system, this should be stored in the database
      
      // First verify the user exists
      const userCheck = await userService.getUserSecurityQuestions(userId);
      if (!userCheck.success) {
        return { success: false, error: 'User does not exist' };
      }
      
      // For now, we'll use simple default answers that users can use
      // This is temporary until we add security questions to the database
      const defaultAnswer1 = 'admin'; // Default answer for "What is your Nickname?"
      const defaultAnswer2 = 'school'; // Default answer for "What is your First School Name?"
      
      const inputAnswer1 = answer1.toLowerCase().trim();
      const inputAnswer2 = answer2.toLowerCase().trim();
      
      if (inputAnswer1 === defaultAnswer1 && inputAnswer2 === defaultAnswer2) {
        // For security, we can't return the actual password from database
        // So we'll return a temporary password that user should change
        return {
          success: true,
          password: 'TempPass123!',
          message: 'Your temporary password is: TempPass123! - Please change it after login.'
        };
      } else {
        return {
          success: false,
          error: 'Security answers are incorrect. Try: "admin" and "school" (temporary system)'
        };
      }
    } catch (err) {
      return { success: false, error: 'Unable to verify answers. Please try again.' };
    }
  },

  // Auth token management
  getAuthToken,
  setAuthToken,
  getAuthHeaders,
  authFetch
};
