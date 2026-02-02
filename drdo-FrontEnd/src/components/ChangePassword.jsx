import { useState, useEffect } from 'react';
import { userService, validatePassword } from '../services/userService';
import './ChangePassword.css';

function ChangePassword({ onSuccess, onCancel, loggedInUser }) {
  const [userId, setUserId] = useState(loggedInUser?.userId || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleShowOld = () => setShowOld(s => !s);
  const toggleShowNew = () => setShowNew(s => !s);
  const toggleShowConfirm = () => setShowConfirm(s => !s);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'userId':
        setUserId(value);
        break;
      case 'oldPassword':
        setOldPassword(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        // Validate new password
        const validation = validatePassword(value);
        setPasswordErrors(validation.errors);
        // Check if passwords match
        if (confirmPassword) {
          setPasswordsMatch(value === confirmPassword);
        }
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        // Check if passwords match
        setPasswordsMatch(value === newPassword);
        break;
      default:
        break;
    }

    setError('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validation: User ID
    if (!userId.trim()) {
      setError('User ID is required');
      setIsLoading(false);
      return;
    }

    // Validation: Old Password
    if (!oldPassword) {
      setError('Old Password is required');
      setIsLoading(false);
      return;
    }

    // Validation: New Password
    if (!newPassword) {
      setError('New Password is required');
      setIsLoading(false);
      return;
    }

    // Validation: Confirm Password
    if (!confirmPassword) {
      setError('Confirm Password is required');
      setIsLoading(false);
      return;
    }

    // Validation: New Password and Confirm Password match
    if (newPassword !== confirmPassword) {
      setError('New Password and Confirm Password do not match');
      setPasswordsMatch(false);
      setIsLoading(false);
      return;
    }

    // Validation: New Password is different from Old Password
    if (newPassword === oldPassword) {
      setError('New Password must be different from Old Password');
      setIsLoading(false);
      return;
    }

    // Validation: Password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      setError('New Password does not meet the required criteria');
      setIsLoading(false);
      return;
    }

    // Require a valid auth token
    const token = userService.getAuthToken();
    if (!token) {
      setError('You must be logged in to change your password.');
      setIsLoading(false);
      return;
    }

    // Call service to change password
    const result = await userService.changePassword(userId, oldPassword, newPassword);

    if (result.success) {
      setSuccess(result.message);
      // Clear form
      setUserId('');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordErrors([]);
      setPasswordsMatch(true);

      // Call success callback after a delay
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  // Keep userId in sync if user is logged in
  useEffect(() => {
    if (loggedInUser?.userId) setUserId(loggedInUser.userId);
  }, [loggedInUser]);

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <h1 className="change-password-title">Change Password</h1>
        <p className="change-password-subtitle">Update your password securely</p>

        <form onSubmit={handleChangePassword} className="change-password-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <div>
                <div className="error-title">Error</div>
                <div className="error-text">{error}</div>
              </div>
            </div>
          )}

          {success && (
            <div className="success-message">
              <span className="success-icon">✓</span>
              <div>
                <div className="success-title">Success</div>
                <div className="success-text">{success}</div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="userId" className="form-label">
              User ID <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <span className="icon user-icon" aria-hidden>👤</span>
              <input
                id="userId"
                type="text"
                name="userId"
                className="form-input"
                placeholder="Enter your User ID"
                value={userId}
                onChange={handleInputChange}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="oldPassword" className="form-label">
              Old Password <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <span className="icon lock-icon" aria-hidden>🔒</span>
              <input
                id="oldPassword"
                type={showOld ? 'text' : 'password'}
                name="oldPassword"
                className="form-input"
                placeholder="Enter your current password"
                value={oldPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button type="button" className={`icon-btn eye-btn ${showOld ? 'visible' : ''}`} onClick={toggleShowOld} aria-label={showOld ? 'Hide password' : 'Show password'}>
                {showOld ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <span className="icon lock-icon" aria-hidden>🔒</span>
              <input
                id="newPassword"
                type={showNew ? 'text' : 'password'}
                name="newPassword"
                className={`form-input ${newPassword && passwordErrors.length === 0 ? 'valid' : ''}`}
                placeholder="Enter new password (8-12 characters)"
                value={newPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button type="button" className={`icon-btn eye-btn ${showNew ? 'visible' : ''}`} onClick={toggleShowNew} aria-label={showNew ? 'Hide password' : 'Show password'}>
                {showNew ? '🙈' : '👁️'}
              </button>
            </div>
            {newPassword && passwordErrors.length > 0 && (
              <div className="password-requirements">
                <p className="requirements-title">Password must contain:</p>
                <ul>
                  <li className={/^.{8,12}$/.test(newPassword) ? 'valid' : 'invalid'}>
                    8-12 characters
                  </li>
                  <li className={/[A-Z]/.test(newPassword) ? 'valid' : 'invalid'}>
                    At least 1 capital letter
                  </li>
                  <li className={/[0-9]/.test(newPassword) ? 'valid' : 'invalid'}>
                    At least 1 number
                  </li>
                  <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? 'valid' : 'invalid'}>
                    At least 1 special character
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <span className="icon lock-icon" aria-hidden>🔒</span>
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                className={`form-input ${
                  confirmPassword
                    ? passwordsMatch
                      ? 'valid'
                      : 'error'
                    : ''
                }`}
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button type="button" className={`icon-btn eye-btn ${showConfirm ? 'visible' : ''}`} onClick={toggleShowConfirm} aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            {confirmPassword && (
              <div className={`match-indicator ${passwordsMatch ? 'match' : 'mismatch'}`}>
                <span className="match-icon">{passwordsMatch ? '✓' : '✗'}</span>
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </div>
            )}
          </div>

          <div className="button-group">
            <button
              type="submit"
              className="btn btn-save"
              disabled={isLoading || !passwordsMatch || newPassword !== confirmPassword}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Updating...
                </>
              ) : (
                <>
                  <span className="save-icon">💾</span>
                  Save
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
