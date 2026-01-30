import { useState } from 'react';
import { userService, validatePassword } from '../services/userService';
import './Registration.css';

function Registration({ onRegistrationSuccess }) {
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
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
          newErrors.email = 'Invalid email address';
        }
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
        onRegistrationSuccess();
      }, 2000);
    } else {
      setErrors({ submit: result.error });
    }

    setIsLoading(false);
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h1 className="registration-title">User Registration</h1>
        <p className="registration-subtitle">Create your account to get started</p>

        <form onSubmit={handleSubmit} className="registration-form">
                    {/* Email Field */}
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email <span className="required">*</span>
                      </label>
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
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
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

          {/* User ID Field */}
          <div className="form-group">
            <label htmlFor="userId" className="form-label">
              User ID <span className="required">*</span> <span className="hint">(unique)</span>
            </label>
            <input
              id="userId"
              type="text"
              name="userId"
              className={`form-input ${errors.userId ? 'error' : ''}`}
              placeholder="Enter a unique User ID"
              value={formData.userId}
              onChange={handleInputChange}
              disabled={isLoading}
              autoComplete="off"
            />
            {errors.userId && <span className="error-text">{errors.userId}</span>}
          </div>

          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username <span className="required">*</span>
            </label>
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
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          {/* Date of Birth Field */}
          <div className="form-group">
            <label htmlFor="dob" className="form-label">
              Date of Birth <span className="required">*</span>
            </label>
            <input
              id="dob"
              type="date"
              name="dob"
              className={`form-input ${errors.dob ? 'error' : ''}`}
              value={formData.dob}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            {errors.dob && <span className="error-text">{errors.dob}</span>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password <span className="required">*</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : ''} ${passwordStrength ? `strength-${passwordStrength}` : ''}`}
              placeholder="Enter password (8-12 characters)"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              autoComplete="new-password"
            />
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
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <span className="match-indicator">✓ Passwords match</span>
            )}
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          {/* Security Question 1 */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="securityQuestion1" className="form-label">
                Security Question 1 <span className="required">*</span>
              </label>
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
              {errors.securityQuestion1 && <span className="error-text">{errors.securityQuestion1}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="securityAnswer1" className="form-label">
                Answer <span className="required">*</span>
              </label>
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
              {errors.securityAnswer1 && <span className="error-text">{errors.securityAnswer1}</span>}
            </div>
          </div>

          {/* Security Question 2 */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="securityQuestion2" className="form-label">
                Security Question 2 <span className="required">*</span>
              </label>
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
              {errors.securityQuestion2 && <span className="error-text">{errors.securityQuestion2}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="securityAnswer2" className="form-label">
                Answer <span className="required">*</span>
              </label>
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
              {errors.securityAnswer2 && <span className="error-text">{errors.securityAnswer2}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Save'}
          </button>
        </form>

        <p className="registration-footer">
          Already have an account? You'll be able to login after registration.
        </p>
      </div>
    </div>
  );
}

export default Registration;
