import React from 'react';
import Login from './Login';
import ModeToggleButton from './ModeToggleButton.jsx';
import './Login.css';

export default function LoginPage({ onLoginSuccess }) {
  return (
    <div className="page page-login">
      <header className="brand-header">
        <div className="brand">DRDO</div>
        <div className="headline">
          <h1>Build with Confidence</h1>
          <p className="lead">Deploy with Ease</p>
        </div>
      </header>

      <main className="center-area">
        <div className="spotlight" />
        <section className="card login-card">
          <div className="card-top">
            <div>
              <h2>Welcome Back</h2>
              <p className="subtitle">Login to your account to continue</p>
            </div>
            <ModeToggleButton />
          </div>

          <div className="card-body">
            <Login onLoginSuccess={onLoginSuccess} />
          </div>

          <footer className="card-foot">© {new Date().getFullYear()} DRDO</footer>
        </section>
      </main>
    </div>
  );
}
