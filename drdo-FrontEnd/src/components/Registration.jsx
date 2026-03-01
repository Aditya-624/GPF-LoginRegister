import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, validatePassword } from '../services/userService';
import './Registration.css';
import ThemeSelector from './ThemeSelector';

function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    workStatus: '',
    dob: '',
    password: '',
    confirmPassword: '',
    passwordExpiryDays: '0',
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
  const [securityMessage, setSecurityMessage] = useState('');

  const toggleShowPassword = () => setShowPassword(s => !s);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(s => !s);

  const showSecurityAlert = (message) => {
    setSecurityMessage(message);
    setTimeout(() => setSecurityMessage(''), 3000);
  };

  const securityQuestions = userService.getSecurityQuestions();

  // Filter questions for dropdown 2 (exclude question 1)
  const availableQuestionsForQ2 = securityQuestions.filter(
    q => q !== formData.securityQuestion1
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Debug: Log workStatus changes
    if (name === 'workStatus') {
      console.log('Work Status changed to:', value);
    }
    
    // If changing security question 1, check if question 2 needs to be updated
    if (name === 'securityQuestion1' && value === formData.securityQuestion2) {
      // Find the first available question that's not the newly selected one
      const newQ2 = securityQuestions.find(q => q !== value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        securityQuestion2: newQ2 || securityQuestions[0]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    setErrors(prev => ({ ...prev, [name]: '', submit: '' })); // Clear both field error and submit error
    setSuccess(''); // Clear success message when user starts typing

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

    if (!formData.workStatus) {
      newErrors.workStatus = 'Work Status is required';
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

    if (!formData.passwordExpiryDays) {
      newErrors.passwordExpiryDays = 'Password expiry days is required';
    } else {
      const days = parseInt(formData.passwordExpiryDays);
      if (isNaN(days) || days < 0 || days > 30) {
        newErrors.passwordExpiryDays = 'Password expiry must be between 0 and 30 days';
      }
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

    // Debug: Log the form data
    console.log('Form Data being sent:', {
      userId: formData.userId,
      username: formData.userId,
      workStatus: formData.workStatus,
      password: '***',
      dob: formData.dob,
      passwordExpiryDays: parseInt(formData.passwordExpiryDays)
    });

    const result = await userService.registerUser({
      userId: formData.userId,
      username: formData.userId, // Use userId as username
      workStatus: formData.workStatus,
      password: formData.password,
      dob: formData.dob,
      passwordExpiryDays: parseInt(formData.passwordExpiryDays),
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
    <div className="auth-page registration-page">
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
          {securityMessage && (
            <div className="security-alert">
              <span className="security-icon">🔒</span>
              {securityMessage}
            </div>
          )}

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
            
            <div className="form-grid">
              {/* Work Status Field */}
              <div className="form-group">
                <label htmlFor="workStatus" className="form-label">
                  Employee Work Status <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="icon user-icon" aria-hidden>👔</span>
                  <select
                    id="workStatus"
                    name="workStatus"
                    className={`form-input ${errors.workStatus ? 'error' : ''}`}
                    value={formData.workStatus}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  >
                    <option value="">-- Select Work Status --</option>
                    <option value="OFFICER">Government Officer</option>
                    <option value="INDUSTRIAL">Industrial</option>
                    <option value="NON_INDUSTRIAL">Non Industrial</option>
                  </select>
                </div>
                {errors.workStatus && <span className="error-text">{errors.workStatus}</span>}
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
                    onKeyDown={(e) => e.preventDefault()}
                    disabled={isLoading}
                  />
                </div>
                {errors.dob && <span className="error-text">{errors.dob}</span>}
              </div>

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

              {/* Password Expiry Days Field */}
              <div className="form-group">
                <label htmlFor="passwordExpiryDays" className="form-label">
                  Password Expiry (Days) <span className="required">*</span> <span className="hint">(0-30 days)</span>
                </label>
                <div className="input-with-icon">
                  <span className="icon user-icon" aria-hidden>⏰</span>
                  <input
                    id="passwordExpiryDays"
                    type="number"
                    name="passwordExpiryDays"
                    className={`form-input ${errors.passwordExpiryDays ? 'error' : ''}`}
                    placeholder="Enter days (0-30)"
                    value={formData.passwordExpiryDays}
                    onChange={handleInputChange}
                    min="0"
                    max="30"
                    disabled={isLoading}
                  />
                </div>
                {errors.passwordExpiryDays && <span className="error-text">{errors.passwordExpiryDays}</span>}
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="form-section">
            <h3 className="section-title">Password</h3>
            
            <div className="form-grid">
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
                onCopy={(e) => { e.preventDefault(); showSecurityAlert('❌ Copying password is not allowed for security reasons'); }}
                onPaste={(e) => { e.preventDefault(); showSecurityAlert('❌ Pasting password is not allowed for security reasons'); }}
                onCut={(e) => { e.preventDefault(); showSecurityAlert('❌ Cutting password is not allowed for security reasons'); }}
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
                onCopy={(e) => { e.preventDefault(); showSecurityAlert('❌ Copying password is not allowed for security reasons'); }}
                onPaste={(e) => { e.preventDefault(); showSecurityAlert('❌ Pasting password is not allowed for security reasons'); }}
                onCut={(e) => { e.preventDefault(); showSecurityAlert('❌ Cutting password is not allowed for security reasons'); }}
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
          
          {/* Password Requirements - Full Width */}
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
          </div>

          {/* Security Questions Section */}
          <div className="form-section registration-questions">
            <h3 className="section-title">Security Questions</h3>
            <p className="section-description">Choose two different security questions for account recovery.</p>
            
            <div className="form-grid">
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
                  {availableQuestionsForQ2.map(q => (
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
          </div>

          {/* Submit Button */}
          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
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
