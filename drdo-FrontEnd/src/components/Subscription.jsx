import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Subscription.css';
import ThemeSelector from './ThemeSelector';

export default function Subscription() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    // TODO: call API with searchTerm and searchType
    console.log('Searching by', searchType, ':', searchTerm);
  };

  return (
    <div className="subscription-page">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={handleBackToGPF}>
            <span>←</span> Back to GPF
          </button>
          <span className="nav-brand">Subscriptions</span>
          <span className="nav-time">{formatTime(currentTime)}</span>
        </div>
        <div className="nav-right">
          <div className="theme-selector-compact">
            <ThemeSelector compact={true} />
          </div>
          <button className="btn btn-nav btn-profile" onClick={() => { try { window.__ANIMATE_NAV = true; } catch (e) {} navigate('/profile'); }}>
            <span className="profile-icon">👤</span>
            <span className="profile-name">User Profile</span>
          </button>
        </div>
      </nav>

      <main className="subscription-main">
        <div className="sub-search-section">
          <h2 className="sub-search-title">GPF Subscription</h2>
          <p className="sub-search-subtitle">Search employee by Personnel Number or Name</p>

          <div className="sub-search-box">
            <div className="sub-search-input-wrap">
              <span className="sub-search-icon">🔍</span>
              <input
                type="number"
                className="sub-search-input"
                placeholder="Enter Personnel Number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchTerm && (
                <button className="sub-search-clear" onClick={() => setSearchTerm('')}>✕</button>
              )}
            </div>

            <button className="sub-search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
