import React from 'react';
import Login from './Login';
import ThemeSelector from './ThemeSelector';
import './Login.css';

export default function LoginPage({ onLoginSuccess }) {
  return (
    <div className="auth-page">
      <div className="auth-theme-selector">
        <ThemeSelector />
      </div>

      <main className="auth-content">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="page-icon">👋</div>
            <h1 className="auth-card-title">Welcome Back</h1>
            <p className="auth-card-subtitle">Login to your account to continue</p>
          </div>

          <Login onLoginSuccess={onLoginSuccess} />
        </div>
      </main>
    </div>
  );
}
