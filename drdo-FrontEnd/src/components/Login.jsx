import { useState } from 'react';
import { userService } from '../services/userService';
import './Login.css';

function Login({ onLoginSuccess, onChangePasswordClick, onForgotPasswordClick }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!userId.trim()) {
      setError('User ID is required');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    // Validate login
    const result = await userService.validateLogin(userId, password);

    if (result.success) {
      // Store token if provided
      if (result.token) {
        try { localStorage.setItem('authToken', result.token); } catch (err) { /* ignore */ }
      }

      // Check if password is expired
      if (result.isPasswordExpired) {
        setError(result.passwordExpiredMessage);
        alert(result.passwordExpiredMessage);
      }

      // Clear form and call success callback
      setUserId('');
      setPassword('');
      onLoginSuccess(result.userId, result.username);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>

        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="userId" className="form-label">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              className="form-input"
              placeholder="Enter your User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            className="btn-link"
            onClick={onChangePasswordClick}
            disabled={isLoading}
          >
            Change Password
          </button>
          <button
            type="button"
            className="btn-link"
            onClick={onForgotPasswordClick}
            disabled={isLoading}
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
