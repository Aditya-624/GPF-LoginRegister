import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './UserReport.css';
import ThemeSelector from './ThemeSelector';

const purposeLabel = (code) => {
  const map = { 1: 'House Building', 2: 'Education', 3: 'Marriage', 4: 'Medical', 5: 'Vehicle', 6: 'Final Withdrawal' };
  return code != null ? (map[Number(code)] || `Purpose ${code}`) : null;
};

const gpfTypeLabel = (type) => {
  if (type === 'F') return { label: 'Final Withdrawal', color: 'blue' };
  if (type === 'E') return { label: 'Partial / Temporary Advance', color: 'green' };
  return null;
};

export default function UserReport() {
  const navigate = useNavigate();
  const { persNumber } = useParams();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  const user = location.state?.user || null;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const handleBack = () => {
    try { window.__ANIMATE_NAV = true; } catch (e) {}
    navigate('/gpf/reports');
  };

  const goTo = (type) => {
    try { window.__ANIMATE_NAV = true; } catch (e) {}
    navigate(`/gpf/reports/user/${encodeURIComponent(persNumber)}/${type}`, { state: { user } });
  };

  const reportTypes = [
    { key: 'contingent-bill',   label: 'Contingent Bill',   icon: '🧾', desc: 'Bill for contingent expenditure against GPF' },
    { key: 'cfa',               label: 'CFA',               icon: '📋', desc: 'Competent Financial Authority approval form' },
    { key: 'calculation-sheet', label: 'Calculation Sheet', icon: '🧮', desc: 'Detailed GPF calculation breakdown' },
    { key: 'application',       label: 'Application',       icon: '📝', desc: 'GPF withdrawal / advance application form' },
    { key: 'schedule',          label: 'Schedule',          icon: '📅', desc: 'Repayment schedule for GPF advance' },
  ];

  const typeInfo = user ? gpfTypeLabel(user.gpfType) : null;

  return (
    <div className="user-report-page">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={handleBack}>
            <span>←</span> Back to Reports
          </button>
          <span className="nav-brand">
            Reports — {user?.name || decodeURIComponent(persNumber)}
          </span>
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

      <main className="user-report-main">
        <div className="ur-header">
          <h1 className="ur-title">Select Report Type</h1>

          {user && (
            <div className="ur-info-strip">
              <span className="ur-chip">{user.persNumber || '—'}</span>
              <span className="ur-pipe">|</span>
              <span className="ur-chip ur-chip-name">{user.name || '—'}</span>
              <span className="ur-pipe">|</span>
              <span className={`ur-chip ur-chip-type ${typeInfo ? `ur-chip-${typeInfo.color}` : ''}`}>
                {typeInfo ? typeInfo.label : (purposeLabel(user.purpose) || '—')}
              </span>
            </div>
          )}
        </div>

        <div className="ur-cards">
          {reportTypes.map((r) => (
            <div key={r.key} className="ur-card" onClick={() => goTo(r.key)}>
              <span className="ur-card-icon">{r.icon}</span>
              <div className="ur-card-body">
                <h3 className="ur-card-title">{r.label}</h3>
                <p className="ur-card-desc">{r.desc}</p>
              </div>
              <span className="ur-card-arrow">→</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
