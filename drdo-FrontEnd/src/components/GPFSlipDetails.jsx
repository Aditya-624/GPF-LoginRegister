import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './GPFSlipDetails.css';
import ThemeSelector from './ThemeSelector';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

export default function GPFSlipDetails() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [desigType, setDesigType] = useState('');
  const [gpfYear, setGpfYear] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch employees when both filters are selected
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!desigType || !gpfYear) {
        setEmployees([]);
        setError('');
        return;
      }

      setLoading(true);
      setError('');

      try {
        console.log('Fetching employees for:', { desigType, gpfYear });
        
        // Fetch from GPF Years endpoint (existing functionality)
        const gpfYearsUrl = `${API_BASE}/api/gpf-years/by-work-status?workStatus=${desigType}&year=${gpfYear}`;
        console.log('GPF Years API URL:', gpfYearsUrl);
        
        const gpfYearsResponse = await fetch(gpfYearsUrl);

        if (!gpfYearsResponse.ok) {
          const errorData = await gpfYearsResponse.json().catch(() => ({ message: 'Failed to fetch employees' }));
          throw new Error(errorData.message || 'Failed to fetch employees');
        }

        const gpfYearsData = await gpfYearsResponse.json();
        console.log('Received GPF Years data:', gpfYearsData);
        
        // Also fetch applications with balance
        const applicationsUrl = `${API_BASE}/api/gpf-usr-details/all-with-balance?year=${gpfYear}&workStatus=${desigType}`;
        console.log('Applications API URL:', applicationsUrl);
        
        try {
          const applicationsResponse = await fetch(applicationsUrl);
          if (applicationsResponse.ok) {
            const applicationsData = await applicationsResponse.json();
            console.log('Received Applications data:', applicationsData);
            
            // Merge data: Add application info to employees if available
            const mergedData = gpfYearsData.map(emp => {
              const appData = applicationsData.find(app => 
                app.employee?.persNumber === emp.persNumber
              );
              return {
                ...emp,
                hasApplication: !!appData,
                applicationDetails: appData?.application || null
              };
            });
            
            setEmployees(mergedData);
          } else {
            // If applications endpoint fails, just use GPF Years data
            setEmployees(gpfYearsData);
          }
        } catch (appError) {
          console.warn('Could not fetch applications, using GPF Years data only:', appError);
          setEmployees(gpfYearsData);
        }
        
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err.message || 'Failed to load employee data');
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [desigType, gpfYear]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

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
    <div className="gpf-slip-details-page">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={handleBackToGPF}>
            <span>←</span> Back to GPF
          </button>
          <span className="nav-brand">GPF Slip Details</span>
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

      <main className="gpf-slip-details-main">
        <div className="slip-details-header">
          <h1 className="slip-details-title">GPF Slip Details</h1>
          <p className="slip-details-subtitle">View and manage your GPF contribution slips</p>
        </div>

        <div className="slip-details-content">
          <div className="filter-section">
            <div className="filter-group">
              <label htmlFor="desig-type" className="filter-label">
                Select Designation Type
              </label>
              <select
                id="desig-type"
                className="filter-select"
                value={desigType}
                onChange={(e) => setDesigType(e.target.value)}
              >
                <option value="">-- Select Designation Type --</option>
                <option value="OFFICER">OFFICER</option>
                <option value="INDUSTRIAL">INDUSTRIAL</option>
                <option value="NON_INDUSTRIAL">NON INDUSTRIAL</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="gpf-year" className="filter-label">
                GPF Year Selection
              </label>
              <select
                id="gpf-year"
                className="filter-select"
                value={gpfYear}
                onChange={(e) => setGpfYear(e.target.value)}
              >
                <option value="">-- Select GPF Year --</option>
                {/* Generate years from 2000 to current year */}
                {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {desigType && gpfYear && (
            <div className="results-section">
              <div className="results-header">
                <h2 className="results-title">
                  {desigType.replace('_', ' ')} - Year {gpfYear}
                </h2>
                <p className="results-count">
                  {loading ? 'Loading...' : `${employees.length} employee(s) found`}
                </p>
              </div>

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  <div>
                    <strong>Error:</strong> {error}
                    <br />
                    <small>Check browser console for more details</small>
                  </div>
                </div>
              )}

              {loading && (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading employee data...</p>
                </div>
              )}

              {!loading && !error && employees.length > 0 && (
                <div className="table-container">
                  <table className="employees-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>PERS No.</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>GPF Account No.</th>
                        <th>Closing Balance</th>
                        <th>Application Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => (
                        <tr key={employee.sno}>
                          <td>{employee.sno}</td>
                          <td>{employee.persNumber}</td>
                          <td>{employee.name}</td>
                          <td>{employee.designation}</td>
                          <td>{employee.gpfAccountNumber}</td>
                          <td className="amount">{formatCurrency(employee.closingBalance)}</td>
                          <td>
                            {employee.hasApplication ? (
                              <span className="status-badge status-applied">
                                ✓ Applied
                              </span>
                            ) : (
                              <span className="status-badge status-no-application">
                                No Application
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && !error && employees.length === 0 && (
                <div className="no-results">
                  <span className="no-results-icon">📋</span>
                  <p>No employees found for the selected criteria</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
