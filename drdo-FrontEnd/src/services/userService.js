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
      // Transform security questions array to individual fields for backend
      const payload = {
        userId: userData.userId,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        dob: userData.dob,
        passwordExpiryDays: userData.passwordExpiryDays,
        securityQuestion1: userData.securityQuestions[0].question,
        securityAnswer1: userData.securityQuestions[0].answer,
        securityQuestion2: userData.securityQuestions[1].question,
        securityAnswer2: userData.securityQuestions[1].answer
      };
      
      console.log('Transformed payload:', payload);
      
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
        isPasswordExpired: data.passwordExpired || false
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
      const res = await fetch(`${API_BASE}/api/auth/security-questions/${userId}`);
      const text = await res.text();
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text } }
      
      if (!res.ok) {
        return { success: false, error: data.error || 'User does not exist' };
      }
      
      return {
        success: true,
        userId: data.userId,
        username: 'User',
        questions: [
          { id: 1, question: data.question1 },
          { id: 2, question: data.question2 }
        ]
      };
    } catch (err) {
      console.error('Error fetching security questions:', err);
      return { success: false, error: 'Unable to connect to server. Please try again.' };
    }
  },

  // Verify security questions answers
  verifySecurityAnswers: async (userId, answer1, answer2) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-security-answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, answer1, answer2 })
      });
      
      const text = await res.text();
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text } }
      
      if (!res.ok) {
        return { success: false, error: data.error || 'Security answers are incorrect' };
      }
      
      return {
        success: true,
        password: data.temporaryPassword,
        message: data.message
      };
    } catch (err) {
      console.error('Error verifying security answers:', err);
      return { success: false, error: 'Unable to verify answers. Please try again.' };
    }
  },

  // Auth token management
  getAuthToken,
  setAuthToken,
  getAuthHeaders,
  authFetch
};
