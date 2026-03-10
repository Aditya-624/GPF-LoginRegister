import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './GPF.css';
import ThemeSelector from './ThemeSelector';

export default function GPF() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

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

  const handleBackToDashboard = () => {
    try { window.__ANIMATE_NAV = true; } catch (e) {}
    navigate('/dashboard');
  };

  return (
    <div className="gpf-page">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={handleBackToDashboard}>
            <span>←</span> Back to Dashboard
          </button>
          <span className="nav-brand">General Provident Fund (GPF)</span>
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

      <main className="gpf-main">
        <div className="gpf-menu-header">
          <h1 className="gpf-menu-title">General Provident Fund Management</h1>
          <p className="gpf-menu-subtitle">Select an option to proceed</p>
        </div>

        <div className="gpf-menu-container">
          <div className="gpf-menu-card" onClick={() => { try { window.__ANIMATE_NAV = true; } catch (e) {}; navigate('/gpf/add-slips'); }}>
            <div className="card-icon-wrapper">
              <span className="card-icon">📝</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">Add GPF Slips</h3>
              <p className="card-description">Upload and manage new GPF contribution slips</p>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="gpf-menu-card" onClick={() => { try { window.__ANIMATE_NAV = true; } catch (e) {}; navigate('/gpf/slip-details'); }}>
            <div className="card-icon-wrapper">
              <span className="card-icon">📄</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">GPF Slip Details</h3>
              <p className="card-description">View detailed information of submitted slips</p>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="gpf-menu-card" onClick={() => { try { window.__ANIMATE_NAV = true; } catch (e) {}; navigate('/temporary-advance'); }}>
            <div className="card-icon-wrapper">
              <span className="card-icon">💳</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">Temporary Advance</h3>
              <p className="card-description">Apply for temporary advance from GPF</p>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="gpf-menu-card" onClick={() => { try { window.__ANIMATE_NAV = true; } catch (e) {}; navigate('/final-withdrawal'); }}>
            <div className="card-icon-wrapper">
              <span className="card-icon">🏦</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">Final Withdrawal</h3>
              <p className="card-description">Process final withdrawal requests</p>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="gpf-menu-card" onClick={() => alert('Add DV Number - Coming Soon!')}>
            <div className="card-icon-wrapper">
              <span className="card-icon">🔢</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">Add DV Number</h3>
              <p className="card-description">Register and manage DV numbers</p>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="gpf-menu-card" onClick={() => alert('Reports - Coming Soon!')}>
            <div className="card-icon-wrapper">
              <span className="card-icon">📊</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">Reports</h3>
              <p className="card-description">Generate and download GPF reports</p>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="gpf-menu-card" onClick={() => alert('Add Subscription - Coming Soon!')}>
            <div className="card-icon-wrapper">
              <span className="card-icon">➕</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">Add Subscription</h3>
              <p className="card-description">Create new subscription entries</p>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="gpf-menu-card" onClick={() => alert('Subscription - Coming Soon!')}>
            <div className="card-icon-wrapper">
              <span className="card-icon">📋</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">Subscription</h3>
              <p className="card-description">View and manage active subscriptions</p>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="gpf-menu-card" onClick={() => alert('List of GPF Account Numbers - Coming Soon!')}>
            <div className="card-icon-wrapper">
              <span className="card-icon">📑</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">List of GPF Account Numbers</h3>
              <p className="card-description">Browse all registered GPF accounts</p>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="gpf-menu-card" onClick={() => { try { window.__ANIMATE_NAV = true; } catch (e) {}; navigate('/gpf/user-application'); }}>
            <div className="card-icon-wrapper">
              <span className="card-icon">👥</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">User Application GPF</h3>
              <p className="card-description">Manage user GPF applications and requests</p>
            </div>
            <div className="card-arrow">→</div>
          </div>
        </div>
      </main>
    </div>
  );
}
