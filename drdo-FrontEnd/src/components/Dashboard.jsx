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

        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.projects}</h3>
              <p className="stat-label">Active Projects</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.tasks}</h3>
              <p className="stat-label">Total Tasks</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.completed}</h3>
              <p className="stat-label">Completed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.pending}</h3>
              <p className="stat-label">Pending</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="content-card">
            <h2 className="card-title">🚀 Quick Actions</h2>
            <div className="action-grid">
              <button className="action-btn" onClick={() => alert('New Project - Coming Soon!')}>
                <span className="action-icon">➕</span>
                <span>New Project</span>
              </button>
              <button className="action-btn" onClick={() => alert('View Reports - Coming Soon!')}>
                <span className="action-icon">📈</span>
                <span>View Reports</span>
              </button>
              <button className="action-btn" onClick={() => alert('Team Chat - Coming Soon!')}>
                <span className="action-icon">💬</span>
                <span>Team Chat</span>
              </button>
              <button className="action-btn" onClick={() => alert('Settings - Coming Soon!')}>
                <span className="action-icon">⚙️</span>
                <span>Settings</span>
              </button>
            </div>
          </div>

          <div className="content-card">
            <h2 className="card-title">📅 Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">🎯</div>
                <div className="activity-content">
                  <p className="activity-text">Completed project milestone</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">👥</div>
                <div className="activity-content">
                  <p className="activity-text">Team meeting scheduled</p>
                  <span className="activity-time">4 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📝</div>
                <div className="activity-content">
                  <p className="activity-text">Updated project documentation</p>
                  <span className="activity-time">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}