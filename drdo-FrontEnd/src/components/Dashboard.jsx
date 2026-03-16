import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Dashboard.css';
import ThemeSelector from './ThemeSelector';

export default function Dashboard({ onSignOut }) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    projects: 12,
    tasks: 34,
    completed: 28,
    pending: 6
  });

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch (e) { return null; }
  })();

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

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="dashboard-page">
      <nav className="top-nav">
        <div className="nav-left">
          <span className="nav-brand">DRDO Dashboard</span>
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
          <button className="btn btn-nav btn-signout" onClick={() => { try { window.__ANIMATE_NAV = true } catch (e) {}; onSignOut(); }}>
            <span>🚪</span> Sign Out
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back{currentUser?.username ? `, ${currentUser.username}` : ''}! 👋</h1>
            <p className="welcome-subtitle">{formatDate(currentTime)}</p>
          </div>
        </div>

        <div className="top-buttons-section">
          <button className="top-action-btn btn-gpf-primary" onClick={() => { try { window.__ANIMATE_NAV = true } catch (e) {}; navigate('/gpf/user-application'); }}>
            <span className="top-action-icon">👥</span>
            <span>User Application GPF</span>
          </button>
          <button className="top-action-btn btn-gpf-primary" onClick={() => { try { window.__ANIMATE_NAV = true } catch (e) {}; navigate('/gpf'); }}>
            <span className="top-action-icon">💰</span>
            <span>General Provident Fund (GPF)</span>
          </button>
        </div>


      </main>
    </div>
  );
}