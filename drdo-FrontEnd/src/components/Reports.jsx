import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Reports.css';
import ThemeSelector from './ThemeSelector';

const API_BASE = 'http://localhost:8081';

export default function Reports() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE}/api/reports/summary`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Server returned HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (e) {
      if (e.message === 'Failed to fetch') {
        setError('Cannot connect to backend server. Make sure Spring Boot is running on port 8081.');
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatDate = (val) => {
    if (!val) return '—';
    return new Date(val).toLocaleDateString('en-IN');
  };

  const formatCurrency = (val) => {
    if (val == null) return '—';
    return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  };

  const purposeLabel = (code) => {
    const map = { 1: 'House Building', 2: 'Education', 3: 'Marriage', 4: 'Medical', 5: 'Vehicle', 6: 'Final Withdrawal' };
    return code != null ? (map[Number(code)] || `Purpose ${code}`) : '—';
  };

  const filtered = data.filter(row => {
    const q = search.toLowerCase();
    return (
      (row.persNumber || '').toLowerCase().includes(q) ||
      (row.name || '').toLowerCase().includes(q)
    );
  });

  const handleBackToGPF = () => {
    try { window.__ANIMATE_NAV = true; } catch (e) {}
    navigate('/gpf');
  };

  return (
    <div className="reports-page">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={handleBackToGPF}>
            <span>←</span> Back to GPF
          </button>
          <span className="nav-brand">Reports</span>
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

      <main className="reports-main">
        <div className="reports-header">
          <h1 className="reports-title">GPF User Summary Report</h1>
          <p className="reports-subtitle">
            {loading ? 'Loading...' : `${filtered.length} of ${data.length} records`}
          </p>
        </div>

        <div className="reports-toolbar">
          <input
            className="reports-search"
            type="text"
            placeholder="Search by Pers No. or Name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-refresh" onClick={fetchSummary} disabled={loading}>
            {loading ? '⟳ Loading...' : '⟳ Refresh'}
          </button>
        </div>

        {error && <div className="reports-error">⚠ {error}</div>}

        {!loading && !error && (
          <div className="reports-table-wrap">
            <table className="reports-table">
              <thead>
                <tr>
                  <th className="sticky-col col-0">#</th>
                  <th className="sticky-col col-1">Pers No.</th>
                  <th className="sticky-col col-2">GPF Acc. No.</th>
                  <th className="sticky-col col-3">Name</th>
                  <th>Date of Birth</th>
                  <th>Designation</th>
                  <th>Purpose Type</th>
                  <th>GPF Type</th>
                  <th>GPF Year</th>
                  <th>Closing Balance</th>
                  <th>Appl. Amount</th>
                  <th>Appl. Date</th>
                  <th>Report</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="no-data">No records found</td>
                  </tr>
                ) : (
                  filtered.map((row, i) => (
                    <tr
                      key={row.persNumber + i}
                      style={{cursor:'pointer'}}
                      onClick={() => {
                        try { window.__ANIMATE_NAV = true; } catch (e) {}
                        navigate(`/gpf/reports/user/${encodeURIComponent(row.persNumber)}`, { state: { user: row } });
                      }}
                    >
                      <td className="sticky-col col-0">{i + 1}</td>
                      <td className="sticky-col col-1 cell-mono">{row.persNumber || '—'}</td>
                      <td className="sticky-col col-2 cell-mono">{row.gpfAccountNumber || '—'}</td>
                      <td className="sticky-col col-3 cell-name">{row.name || '—'}</td>
                      <td>{formatDate(row.dob)}</td>
                      <td>{row.designation || '—'}</td>
                      <td>{purposeLabel(row.purpose)}</td>
                      <td className="cell-center">
                        {row.gpfType ? (
                          <span className={`badge badge-${row.gpfType === 'F' ? 'blue' : 'green'}`}>
                            {row.gpfType === 'F' ? 'Final' : 'Partial'}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="cell-center">{row.gpfYear || '—'}</td>
                      <td className="cell-amount">{formatCurrency(row.closingBalance)}</td>
                      <td className="cell-amount">{formatCurrency(row.applAmt)}</td>
                      <td>{formatDate(row.applDate)}</td>
                      <td className="cell-center" onClick={e => e.stopPropagation()}>
                        <button
                          className="btn-view-report"
                          onClick={() => {
                            try { window.__ANIMATE_NAV = true; } catch (e) {}
                            navigate(`/gpf/reports/user/${encodeURIComponent(row.persNumber)}`, { state: { user: row } });
                          }}
                        >
                          📄 View Report
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {loading && (
          <div className="reports-loading">
            <div className="spinner" />
            <span>Fetching report data...</span>
          </div>
        )}
      </main>
    </div>
  );
}
