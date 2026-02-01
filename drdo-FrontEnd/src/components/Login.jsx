import { useState } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(v => !v);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setIsLoading(true);

    // Basic validation
    const newErrors = {};
    if (!userId.trim()) newErrors.userId = 'User ID is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const result = await userService.validateLogin(userId, password);

    if (result.success) {
      if (result.token) {
        try { localStorage.setItem('authToken', result.token); } catch (err) { /* ignore */ }
      }

      try { localStorage.setItem('currentUser', JSON.stringify({ userId: result.userId, username: result.username })); } catch (err) {}

      if (result.isPasswordExpired) {
        setError(result.passwordExpiredMessage);
      }

      setUserId('');
      setPassword('');
      // mark that navigation was user-initiated (form submit click) so transitions can run
      try { window.__ANIMATE_NAV = true; } catch (e) { /* ignore in non-browser contexts */ }
      onLoginSuccess(result.userId, result.username);
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="login-form" noValidate>
        <div className="form-group">
          <label htmlFor="userId" className="form-label">Username</label>
          <div className="input-with-icon">
            <span className="icon user-icon" aria-hidden>👤</span>
            <input
              id="userId"
              type="text"
              className={`form-input ${fieldErrors.userId ? 'error' : ''}`}
              placeholder="Enter your username"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
          {fieldErrors.userId && <span className="error-text">{fieldErrors.userId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="input-with-icon">
            <span className="icon lock-icon" aria-hidden>🔒</span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input ${fieldErrors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              className={`icon-btn eye-btn ${showPassword ? 'visible' : ''}`}
              onClick={toggleShowPassword}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {fieldErrors.password && <span id="password-error" className="error-text">{fieldErrors.password}</span>}
        </div>

        <div className="forgot-row"><Link to="/forgot-password" className="link forgot-link" onClick={() => { try { window.__ANIMATE_NAV = true } catch (e) {} }}>Forgot password?</Link></div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="login-footer">
        <p>
          Don't have an account? <Link to="/register" className="link" onClick={() => { try { window.__ANIMATE_NAV = true } catch (e) {} }}>Register</Link>
        </p>
      </div>
    </>
  );
}

export default Login;
