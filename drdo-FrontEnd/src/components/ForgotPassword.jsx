import { useState } from 'react';
import { userService } from '../services/userService';
import './ForgotPassword.css';
import ThemeSelector from './ThemeSelector';
import { useNavigate } from 'react-router-dom';

function ForgotPassword({ onSuccess, onCancel }) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recoveredPassword, setRecoveredPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
    setError('');
    setSuccess('');
    setQuestions(null);
    setQuestionsLoaded(false);
    setAnswer1('');
    setAnswer2('');
    setRecoveredPassword('');
  };

  const handleLoadQuestions = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!userId.trim()) {
      setError('User ID is required');
      setIsLoading(false);
      return;
    }

    // Fetch security questions
    const result = userService.getUserSecurityQuestions(userId);

    if (result.success) {
      setQuestions(result.questions);
      setQuestionsLoaded(true);
      setAnswer1('');
      setAnswer2('');
      setRecoveredPassword('');
    } else {
      setError(result.error);
      setQuestionsLoaded(false);
    }

    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validation
    if (!userId.trim()) {
      setError('User ID is required');
      setIsLoading(false);
      return;
    }

    if (!answer1.trim()) {
      setError('Answer to Question 1 is required');
      setIsLoading(false);
      return;
    }

    if (!answer2.trim()) {
      setError('Answer to Question 2 is required');
      setIsLoading(false);
      return;
    }

    // Verify answers
    const result = userService.verifySecurityAnswers(userId, answer1, answer2);

    if (result.success) {
      setSuccess(result.message);
      setRecoveredPassword(result.password);
      // mark navigation as user initiated (submit click will lead to redirect)
      try { window.__ANIMATE_NAV = true; } catch (e) {}
      // Optionally redirect after a delay
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } else {
      setError(result.error);
      // Clear form on wrong answers
      setAnswer1('');
      setAnswer2('');
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
            <div className="page-icon">🔓</div>
            <h1 className="auth-card-title">Recover Password</h1>
            <p className="auth-card-subtitle">Answer your security questions to retrieve your password</p>
          </div>

        <form className="auth-form">
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

          {recoveredPassword && (
            <div className="password-display">
              <div className="password-box">
                <h3 className="password-label">Your Password:</h3>
                <div className="password-value">
                  <code>{recoveredPassword}</code>
                </div>
                <p className="password-hint">
                  Please save your password in a secure location. You can now login with this password.
                </p>
              </div>
            </div>
          )}

          {/* User ID Field */}
          <div className="form-group">
            <label htmlFor="userId" className="form-label">
              User ID <span className="required">*</span>
            </label>
            <div className="userid-input-group input-with-icon">
              <span className="icon user-icon" aria-hidden>👤</span>
              <input
                id="userId"
                type="text"
                className="form-input"
                placeholder="Enter your User ID"
                value={userId}
                onChange={handleUserIdChange}
                disabled={isLoading || questionsLoaded}
                autoComplete="off"
              />
              <button
                type="button"
                className={`btn btn-fetch ${questionsLoaded ? 'loaded' : ''}`}
                onClick={handleLoadQuestions}
                disabled={!userId.trim() || isLoading || questionsLoaded}
              >
                {questionsLoaded ? '✓ Loaded' : 'Load Questions'}
              </button>
            </div>
          </div>

          {/* Security Questions */}
          {questionsLoaded && questions && (
            <>
              {/* Question 1 */}
              <div className="form-group">
                <label className="form-label question-label">
                  Question 1 (Non-editable)
                </label>
                <div className="question-display">
                  <p className="question-text">{questions[0].question}</p>
                </div>
                <label htmlFor="answer1" className="form-label answer-label">
                  Your Answer <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="icon user-icon" aria-hidden>💭</span>
                  <input
                    id="answer1"
                    type="text"
                    className="form-input"
                    placeholder="Enter your answer"
                    value={answer1}
                    onChange={(e) => setAnswer1(e.target.value)}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Question 2 */}
              <div className="form-group">
                <label className="form-label question-label">
                  Question 2 (Non-editable)
                </label>
                <div className="question-display">
                  <p className="question-text">{questions[1].question}</p>
                </div>
                <label htmlFor="answer2" className="form-label answer-label">
                  Your Answer <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="icon user-icon" aria-hidden>💭</span>
                  <input
                    id="answer2"
                    type="text"
                    className="form-input"
                    placeholder="Enter your answer"
                    value={answer2}
                    onChange={(e) => setAnswer2(e.target.value)}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="button-group">
                <button
                  type="submit"
                  className="btn btn-submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <span className="submit-icon">🔍</span>
                      Submit
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Cancel Button */}
          <button
            type="button"
            className="btn btn-back"
            onClick={() => { try { window.__ANIMATE_NAV = true } catch (e) {}; (onCancel ? onCancel() : navigate('/')); }}
            disabled={isLoading}
          >
            Back to Login
          </button>
        </form>

        <div className="auth-card-footer">
          <p>
            Remember your password?{' '}
            <span className="auth-link" onClick={() => { try { window.__ANIMATE_NAV = true } catch (e) {}; navigate('/'); }}>
              Return to login
            </span>
          </p>
        </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;
