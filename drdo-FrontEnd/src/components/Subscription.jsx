import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Subscription.css';
import ThemeSelector from './ThemeSelector';

export default function Subscription() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const handleBackToGPF = () => {
    try { window.__ANIMATE_NAV = true; } catch (e) {}
    navigate('/gpf');
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await axios.get(`http://localhost:8081/api/gpf-sub-details/by-pers/${searchTerm.trim()}`);
      setRecords(res.data || []);
    } catch {
      setRecords([]);
      setError('No subscription records found for: ' + searchTerm);
    } finally {
      setLoading(false);
    }
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
          <p className="sub-search-subtitle">Search employee by Personnel Number</p>

          <div className="sub-search-box">
            <div className="sub-search-input-wrap">
              <span className="sub-search-icon">🔍</span>
              <input
                type="text"
                className="sub-search-input"
                placeholder="Enter Personnel Number (e.g. OFF001)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchTerm && (
                <button className="sub-search-clear" onClick={() => { setSearchTerm(''); setRecords([]); setSearched(false); }}>✕</button>
              )}
            </div>
            <button className="sub-search-btn" onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {error && <p style={{ color: 'var(--error-color, #ef4444)', marginTop: '1rem' }}>{error}</p>}

          {searched && !loading && records.length > 0 && (
            <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--table-header-bg, #1e293b)', color: 'var(--table-header-color, #fff)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Personnel No.</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>GPF Subscription</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>GPF Refund</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(rec => (
                    <tr key={rec.id} style={{ borderBottom: '1px solid var(--border-color, #334155)' }}>
                      <td style={{ padding: '9px 14px' }}>{rec.persNumber}</td>
                      <td style={{ padding: '9px 14px' }}>{rec.addSubDate}</td>
                      <td style={{ padding: '9px 14px', textAlign: 'right' }}>₹{Number(rec.gpfSub).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '9px 14px', textAlign: 'right' }}>₹{Number(rec.gpfRet).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {searched && !loading && records.length === 0 && !error && (
            <p style={{ marginTop: '1rem', opacity: 0.6 }}>No records found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

