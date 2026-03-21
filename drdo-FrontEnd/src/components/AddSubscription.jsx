import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AddSubscription.css';
import ThemeSelector from './ThemeSelector';
import NotificationToast from './NotificationToast';

export default function AddSubscription() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSearching, setIsSearching] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [toast, setToast] = useState(null);
  const [persNoInput, setPersNoInput] = useState('');
  const [typedQuery, setTypedQuery] = useState(''); // tracks what user actually typed
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const inputRef = useRef(null);
  const [subForm, setSubForm] = useState({ date: '', gpfSubscription: '', gpfRefund: '' });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8081/api/gpf/all')
      .then(r => setAllEmployees(r.data))
      .catch(e => console.error('Error loading employees:', e));
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatDate = (ds) => {
    if (!ds) return 'N/A';
    return new Date(ds).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const showToast = (message, type = 'info') => setToast({ message, type, id: Date.now() });

  const openDropdown = (list) => {
    setFilteredEmployees(list);
    setShowDropdown(true);
  };

  const handlePersNoChange = (e) => {
    const val = e.target.value;
    setPersNoInput(val);
    setTypedQuery(val);
    if (val.trim().length > 0) {
      const q = val.toLowerCase();
      const filtered = allEmployees.filter(emp =>
        emp.persNumber?.toString().toLowerCase().includes(q) ||
        emp.employeeName?.toLowerCase().includes(q) ||
        emp.gpfAccountNumber?.toString().toLowerCase().includes(q)
      );
      openDropdown(filtered);
    } else {
      setShowDropdown(false);
      setFilteredEmployees([]);
    }
  };

  const handleDropdownToggle = () => {
    if (!showDropdown) openDropdown(allEmployees);
    else setShowDropdown(false);
  };

  const handleSelectEmployee = (record) => {
    setUserDetails(record);
    setPersNoInput(`${record.gpfAccountNumber} - ${record.employeeName} (${record.persNumber})`);
    setShowDropdown(false);
  };

  const handleSearch = async () => {
    const query = persNoInput.trim();
    if (!query) { showToast('Please enter a Personnel Number or select from dropdown', 'warning'); return; }
    setIsSearching(true);
    try {
      const res = await axios.get('http://localhost:8081/api/gpf/search', { params: { query } });
      const results = res.data;
      if (results?.length > 0) {
        if (results.length === 1) {
          handleSelectEmployee(results[0]);
          showToast(`Employee found: ${results[0].employeeName}`, 'success');
        } else {
          openDropdown(results);
        }
      } else {
        setUserDetails(null);
        showToast('User does not exist in GPF database', 'error');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setUserDetails(null);
        showToast('User does not exist in GPF database', 'error');
      } else if (err.request) {
        showToast('Cannot connect to backend server. Please ensure the server is running on port 8081', 'error');
      } else {
        showToast('An error occurred while searching', 'error');
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Highlight matched text in suggestions
  const highlight = (text, query) => {
    if (!query || !text) return text;
    const i = text.toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return text;
    return (
      <>
        {text.slice(0, i)}
        <mark className="match-highlight">{text.slice(i, i + query.length)}</mark>
        {text.slice(i + query.length)}
      </>
    );
  };

  const handleSubFormChange = (e) => {
    const { name, value } = e.target;
    setSubForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave   = () => showToast('Subscription saved successfully!', 'success');
  const handleDelete = () => showToast('Subscription deleted.', 'warning');
  const handleReset  = () => { setSubForm({ date: '', gpfSubscription: '', gpfRefund: '' }); showToast('Form reset.', 'info'); };

  return (
    <div className="add-subscription-page">
      {toast && (
        <NotificationToast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <nav className="top-nav">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={() => { try { window.__ANIMATE_NAV = true; } catch (e) {} navigate('/gpf'); }}>
            <span>←</span> Back to GPF
          </button>
          <span className="nav-brand">Add Subscription</span>
          <span className="nav-time">{formatTime(currentTime)}</span>
        </div>
        <div className="nav-right">
          <div className="theme-selector-compact"><ThemeSelector compact={true} /></div>
          <button className="btn btn-nav btn-profile" onClick={() => { try { window.__ANIMATE_NAV = true; } catch (e) {} navigate('/profile'); }}>
            <span className="profile-icon">👤</span>
            <span className="profile-name">User Profile</span>
          </button>
        </div>
      </nav>

      <main className="add-subscription-main">
        <div className="page-header">
          <h1 className="page-title">Add Subscription</h1>
          <p className="page-subtitle">Search for an employee and manage GPF subscription details</p>
        </div>

        <div className="content-wrapper">
          {/* Left — Search */}
          <div className="left-section">
            <div className="search-container">
              <h3 className="search-title">Search / Add Subscription</h3>
              <div className="search-bar-combined">
                <div className="combobox-wrapper">
                  <input
                    ref={inputRef}
                    type="text"
                    className="search-input-combo"
                    placeholder="Enter Pers No, Name or Account No..."
                    value={persNoInput}
                    onChange={handlePersNoChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    onFocus={() => { if (!persNoInput.trim() && allEmployees.length > 0) openDropdown(allEmployees); }}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 160)}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="combobox-arrow"
                    onMouseDown={(e) => { e.preventDefault(); handleDropdownToggle(); }}
                    tabIndex={-1}
                    aria-label="Toggle dropdown"
                  >▾</button>

                  {showDropdown && (
                    <ul className="combobox-dropdown">
                      {filteredEmployees.length > 0 ? filteredEmployees.map((emp) => (
                        <li
                          key={emp.gpfAccountNumber}
                          className="combobox-option"
                          onMouseDown={() => { handleSelectEmployee(emp); showToast(`Employee found: ${emp.employeeName}`, 'success'); }}
                        >
                          <span className="opt-account">{highlight(emp.gpfAccountNumber?.toString(), typedQuery)}</span>
                          <span className="opt-name">{highlight(emp.employeeName, typedQuery)}</span>
                          <span className="opt-pers">({highlight(emp.persNumber?.toString(), typedQuery)})</span>
                        </li>
                      )) : (
                        <li className="combobox-no-result">No matching employees found</li>
                      )}
                    </ul>
                  )}
                </div>
                <button className="btn-search" onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? '🔍...' : '🔍 Search'}
                </button>
              </div>
            </div>
          </div>

          {/* Right — User Details (only after selection) */}
          <div className="right-section">
            {userDetails && (
              <div className="user-details-container">
                <h3 className="section-title">User Details</h3>
                <table className="user-details-table">
                  <tbody>
                    <tr>
                      <td className="table-label">GPF Account Number</td>
                      <td className="table-value">{userDetails.gpfAccountNumber || '-'}</td>
                      <td className="table-label">Personnel Number</td>
                      <td className="table-value">{userDetails.persNumber || '-'}</td>
                    </tr>
                    <tr>
                      <td className="table-label">Employee Name</td>
                      <td className="table-value">{userDetails.employeeName || '-'}</td>
                      <td className="table-label">Designation</td>
                      <td className="table-value">{userDetails.designation || '-'}</td>
                    </tr>
                    <tr>
                      <td className="table-label">Date of Birth</td>
                      <td className="table-value">{userDetails.dob ? formatDate(userDetails.dob) : '-'}</td>
                      <td className="table-label">Date of Retirement</td>
                      <td className="table-value">{userDetails.dateOfRetirement ? formatDate(userDetails.dateOfRetirement) : '-'}</td>
                    </tr>
                    <tr>
                      <td className="table-label">Basic Pay</td>
                      <td className="table-value">{userDetails.basicPay ? `₹${Number(userDetails.basicPay).toLocaleString('en-IN')}` : '-'}</td>
                      <td className="table-label">Phone Number</td>
                      <td className="table-value">{userDetails.phoneNumber || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Entry Form — only after selection */}
        {userDetails && (
          <div className="sub-form-container">
            <h3 className="sub-form-title">Subscription Entry</h3>
            <div className="sub-form-fields">
              <div className="sub-field">
                <label className="sub-label">Add Date / Month</label>
                <input type="date" name="date" className="sub-input" value={subForm.date} onChange={handleSubFormChange} />
              </div>
              <div className="sub-field">
                <label className="sub-label">GPF Subscription</label>
                <input type="number" name="gpfSubscription" className="sub-input" placeholder="Enter amount" value={subForm.gpfSubscription} onChange={handleSubFormChange} min="0" step="0.01" />
              </div>
              <div className="sub-field">
                <label className="sub-label">GPF Refund</label>
                <input type="number" name="gpfRefund" className="sub-input" placeholder="Enter amount" value={subForm.gpfRefund} onChange={handleSubFormChange} min="0" step="0.01" />
              </div>
            </div>
            <div className="sub-form-actions">
              <button className="btn-sub btn-save" onClick={handleSave}>💾 Save</button>
              <button className="btn-sub btn-delete" onClick={handleDelete}>🗑️ Delete</button>
              <button className="btn-sub btn-reset" onClick={handleReset}>↺ Reset</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
