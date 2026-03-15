import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Reports.css';
import ThemeSelector from './ThemeSelector';

export default function Reports() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  const handleBackToGPF = () => {
    try { window.__ANIMATE_NAV = true; } catch (e) {}
    navigate('/gpf');
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Validate selection
      if (!selectedReport) {
        setMessage('Please select a report type');
        setLoading(false);
        return;
      }

      // TODO: Replace with actual API call
      // const response = await fetch('/api/gpf/reports/generate', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   },
      //   body: JSON.stringify({
      //     reportType: selectedReport,
      //     startDate: dateRange.startDate,
      //     endDate: dateRange.endDate
      //   })
      // });

      // Simulated success
      setMessage(`${selectedReport} report generated successfully!`);
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      setMessage('Error generating report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedReport('');
    setDateRange({
      startDate: '',
      endDate: ''
    });
    setMessage('');
  };

  const reportTypes = [
    { id: 'contribution', label: 'Contribution Report', description: 'View all GPF contributions' },
    { id: 'withdrawal', label: 'Withdrawal Report', description: 'View all withdrawal transactions' },
    { id: 'balance', label: 'Balance Report', description: 'Current GPF balance summary' },
    { id: 'transaction', label: 'Transaction Report', description: 'Complete transaction history' },
    { id: 'advance', label: 'Advance Report', description: 'Temporary advance details' },
    { id: 'annual', label: 'Annual Report', description: 'Year-end GPF summary' }
  ];

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
          <h1 className="reports-title">GPF Reports</h1>
          <p className="reports-subtitle">Generate and download comprehensive GPF reports</p>
        </div>

        <div className="reports-container">
          <form className="reports-form" onSubmit={handleGenerateReport}>
            {message && (
              <div className={`form-message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            <div className="form-section">
              <h2 className="section-title">Select Report Type</h2>
              <div className="report-types-grid">
                {reportTypes.map(report => (
                  <div
                    key={report.id}
                    className={`report-type-card ${selectedReport === report.id ? 'selected' : ''}`}
                    onClick={() => setSelectedReport(report.id)}
                  >
                    <div className="report-type-radio">
                      <input
                        type="radio"
                        id={report.id}
                        name="reportType"
                        value={report.id}
                        checked={selectedReport === report.id}
                        onChange={(e) => setSelectedReport(e.target.value)}
                      />
                      <label htmlFor={report.id}></label>
                    </div>
                    <div className="report-type-content">
                      <h3 className="report-type-label">{report.label}</h3>
                      <p className="report-type-description">{report.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Date Range (Optional)</h2>
              <div className="date-range-grid">
                <div className="form-group">
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate" className="form-label">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </button>
              <button
                type="button"
                className="btn btn-tertiary"
                onClick={() => alert('Download feature coming soon!')}
                disabled={loading || !selectedReport}
              >
                Download
              </button>
            </div>
          </form>

          <div className="reports-info">
            <div className="info-card">
              <span className="info-icon">ℹ️</span>
              <div className="info-content">
                <h3 className="info-title">Report Information</h3>
                <p className="info-text">
                  Select a report type to generate detailed GPF reports. You can optionally specify a date range to filter the data. All reports are generated in PDF format and can be downloaded for your records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
