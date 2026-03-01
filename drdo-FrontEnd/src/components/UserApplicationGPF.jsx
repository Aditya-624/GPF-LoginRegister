import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './UserApplicationGPF.css';
import ThemeSelector from './ThemeSelector';

export default function UserApplicationGPF() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleBackToGPF = () => {
    try { window.__ANIMATE_NAV = true; } catch (e) {}
    navigate('/gpf');
  };

  return (
    <div className="user-application-gpf-page">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={handleBackToGPF}>
            <span>←</span> Back to GPF
          </button>
          <span className="nav-brand">User Application GPF</span>
          <span className="nav-time">{formatTime(currentTime)}</span>
        </div>
        <div className="nav-right">
          <div className="theme-selector-compact">
            <ThemeSelector compact={true} />
          </div>
          <button className="btn btn-nav btn-profile" onClick={() => { try { window.__ANIMATE_NAV = true } catch (e) {}; navigate('/profile'); }}>
            <span className="profile-icon">👤</span>
            <span className="profile-name">User Profile</span>
          </button>
        </div>
      </nav>

      <main className="user-application-main">
        <div className="user-application-header">
          <h1 className="user-application-title">User Application GPF</h1>
          <p className="user-application-subtitle">Manage user GPF applications and requests</p>
        </div>

        <div className="user-application-content">
          <div className="coming-soon-container">
            <div className="coming-soon-icon">🚧</div>
            <h2 className="coming-soon-title">Coming Soon</h2>
            <p className="coming-soon-text">
              This feature is currently under development. You'll be able to manage user GPF applications here soon.
            </p>
            <button className="btn btn-primary" onClick={handleBackToGPF}>
              Back to GPF Menu
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
