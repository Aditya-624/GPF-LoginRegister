import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, validatePassword } from '../services/userService';
import './Registration.css';
import ThemeSelector from './ThemeSelector';

function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    username: '',
    email: '', // Add email field
    dob: '',
    password: '',
    confirmPassword: '',
    securityQuestion1: 'What is your Nickname?',
    securityAnswer1: '',
    securityQuestion2: 'What is your First School Name?',
    securityAnswer2: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(s => !s);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(s => !s);

  const securityQuestions = userService.getSecurityQuestions();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));

    // Real-time password validation
    if (name === 'password') {
      const validation = validatePassword(value);
      setPasswordErrors(validation.errors);
      
      if (value.length === 0) {
        setPasswordStrength('');
      } else if (validation.errors.length > 2) {
        setPasswordStrength('weak');
      } else if (validation.errors.length > 0) {
        setPasswordStrength('medium');
      } else {
        setPasswordStrength('strong');
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userId.trim()) {
      newErrors.userId = 'User ID is required';
    } else if (formData.userId.includes(' ')) {
      newErrors.userId = 'User ID cannot contain spaces';
    } else if (userService.userExists(formData.userId)) {
      newErrors.userId = 'User ID already exists';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required';
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 13) {
        newErrors.dob = 'You must be at least 13 years old';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const validation = validatePassword(formData.password);
      if (!validation.valid) {
        newErrors.password = validation.errors[0];
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.securityAnswer1.trim()) {
      newErrors.securityAnswer1 = 'Answer to Question 1 is required';
    }

    if (!formData.securityAnswer2.trim()) {
      newErrors.securityAnswer2 = 'Answer to Question 2 is required';
    }

    if (formData.securityQuestion1 === formData.securityQuestion2) {
      newErrors.securityQuestion2 = 'Security questions must be different';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const result = await userService.registerUser({
      userId: formData.userId,
      username: formData.username,
      email: formData.email, // Add email to payload
      password: formData.password,
      dob: formData.dob,
      securityQuestions: [
        { question: formData.securityQuestion1, answer: formData.securityAnswer1.toLowerCase() },
        { question: formData.securityQuestion2, answer: formData.securityAnswer2.toLowerCase() }
      ]
    });

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        try { window.__ANIMATE_NAV = true; } catch (e) {}
        navigate('/');
      }, 1400);
    } else {
      setErrors({ submit: result.error });
    }

    setIsLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-theme-selector">
        <ThemeSelector />
      </div>

      <main className="auth-content">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="page-icon">📝</div>
            <h1 className="auth-card-title">Create Account</h1>
            <p className="auth-card-subtitle">Join us to get started</p>
          </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.submit && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {errors.submit}
            </div>
          )}

          {success && (
            <div className="success-message">
              <span className="success-icon">✓</span>
              {success}
            </div>
          )}

          {/* Personal Information Section */}
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            
            {/* Full Name Field */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="icon user-icon" aria-hidden>👤</span>
                <input
                  id="username"
                  type="text"
                  name="username"
                  className={`form-input ${errors.username ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="icon user-icon" aria-hidden>✉️</span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* Date of Birth Field */}
            <div className="form-group">
              <label htmlFor="dob" className="form-label">
                Date of Birth <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="icon user-icon" aria-hidden>📅</span>
                <input
                  id="dob"
                  type="date"
                  name="dob"
                  className={`form-input ${errors.dob ? 'error' : ''}`}
                  value={formData.dob}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              {errors.dob && <span className="error-text">{errors.dob}</span>}
            </div>
          </div>

          {/* Account Information Section */}
          <div className="form-section">
            <h3 className="section-title">Account Information</h3>
            
            {/* User ID Field */}
            <div className="form-group">
              <label htmlFor="userId" className="form-label">
                Username <span className="required">*</span> <span className="hint">(unique identifier)</span>
              </label>
              <div className="input-with-icon">
                <span className="icon user-icon" aria-hidden>🆔</span>
                <input
                  id="userId"
                  type="text"
                  name="userId"
                  className={`form-input ${errors.userId ? 'error' : ''}`}
                  placeholder="Choose a unique username"
                  value={formData.userId}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>
              {errors.userId && <span className="error-text">{errors.userId}</span>}
            </div>
          </div>

          {/* Password Section */}
          <div className="form-section">
            <h3 className="section-title">Password</h3>
            
            {/* Password Field */}
            <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <span className="icon lock-icon" aria-hidden>🔒</span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`form-input ${errors.password ? 'error' : ''} ${passwordStrength ? `strength-${passwordStrength}` : ''}`}
                placeholder="Enter password (8-12 characters)"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button type="button" className={`icon-btn eye-btn ${showPassword ? 'visible' : ''}`} onClick={toggleShowPassword} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {formData.password && (
              <div className={`password-strength strength-${passwordStrength}`}>
                <span className="strength-label">
                  {passwordStrength === 'strong' && '✓ Strong password'}
                  {passwordStrength === 'medium' && '◐ Medium password'}
                  {passwordStrength === 'weak' && '✗ Weak password'}
                </span>
              </div>
            )}
            {passwordErrors.length > 0 && (
              <div className="password-requirements">
                <p className="requirements-title">Password must contain:</p>
                <ul>
                  <li className={/^.{8,12}$/.test(formData.password) ? 'valid' : 'invalid'}>
                    8-12 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'valid' : 'invalid'}>
                    At least 1 capital letter
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? 'valid' : 'invalid'}>
                    At least 1 number
                  </li>
                  <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'valid' : 'invalid'}>
                    At least 1 special character
                  </li>
                </ul>
              </div>
            )}
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <span className="icon lock-icon" aria-hidden>🔒</span>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button type="button" className={`icon-btn eye-btn ${showConfirmPassword ? 'visible' : ''}`} onClick={toggleShowConfirmPassword} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <span className="match-indicator">✓ Passwords match</span>
            )}
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
          </div>

          {/* Security Questions Section */}
          <div className="form-section registration-questions">
            <h3 className="section-title">Security Questions</h3>
            <p className="section-description">Choose two different security questions for account recovery.</p>
            
            {/* Security Question 1 */}
            <div className="form-group">
              <label htmlFor="securityQuestion1" className="form-label">
                Security Question 1 <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="icon user-icon" aria-hidden>❓</span>
                <select
                  id="securityQuestion1"
                  name="securityQuestion1"
                  className={`form-input ${errors.securityQuestion1 ? 'error' : ''}`}
                  value={formData.securityQuestion1}
                  onChange={handleInputChange}
                  disabled={isLoading}
                >
                  {securityQuestions.map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>
              {errors.securityQuestion1 && <span className="error-text">{errors.securityQuestion1}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="securityAnswer1" className="form-label">
                Answer 1 <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="icon user-icon" aria-hidden>💭</span>
                <input
                  id="securityAnswer1"
                  type="text"
                  name="securityAnswer1"
                  className={`form-input ${errors.securityAnswer1 ? 'error' : ''}`}
                  placeholder="Your answer"
                  value={formData.securityAnswer1}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              {errors.securityAnswer1 && <span className="error-text">{errors.securityAnswer1}</span>}
            </div>

            {/* Security Question 2 */}
            <div className="form-group">
              <label htmlFor="securityQuestion2" className="form-label">
                Security Question 2 <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="icon user-icon" aria-hidden>❓</span>
                <select
                  id="securityQuestion2"
                  name="securityQuestion2"
                  className={`form-input ${errors.securityQuestion2 ? 'error' : ''}`}
                  value={formData.securityQuestion2}
                  onChange={handleInputChange}
                  disabled={isLoading}
                >
                  {securityQuestions.map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>
              {errors.securityQuestion2 && <span className="error-text">{errors.securityQuestion2}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="securityAnswer2" className="form-label">
                Answer 2 <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="icon user-icon" aria-hidden>💭</span>
                <input
                  id="securityAnswer2"
                  type="text"
                  name="securityAnswer2"
                  className={`form-input ${errors.securityAnswer2 ? 'error' : ''}`}
                  placeholder="Your answer"
                  value={formData.securityAnswer2}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              {errors.securityAnswer2 && <span className="error-text">{errors.securityAnswer2}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-card-footer">
          <p>Already have an account? <span className="auth-link" onClick={() => { try { window.__ANIMATE_NAV = true } catch (e) {}; navigate('/'); }}>Login</span></p>
        </div>
        </div>
      </main>
    </div>
  );
}

export default Registration;
