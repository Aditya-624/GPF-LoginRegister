import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './AddGPFSlips.css';
import ThemeSelector from './ThemeSelector';

export default function AddGPFSlips() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    month: '',
    year: '',
    basicPay: '',
    gpfSubscription: '',
    refundAdvance: '',
    interestRefund: '',
    totalAmount: '',
    remarks: ''
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

  const handleBackToGPF = () => {
    try { window.__ANIMATE_NAV = true; } catch (e) {}
    navigate('/gpf');
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search term (Pass Number)');
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(`http://localhost:8081/api/gpf-years/search`, {
        params: { query: searchQuery }
      });
      
      setSearchResults(response.data);
      setShowResults(true);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('No GPF Years record found matching your search criteria');
        setSearchResults([]);
      } else if (error.response) {
        alert(`Error: ${error.response.data.message || 'Failed to search GPF Years'}`);
      } else if (error.request) {
        alert('Cannot connect to backend server. Please ensure the server is running on port 8081');
      } else {
        alert('An error occurred while searching');
      }
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectEmployee = (record) => {
    setSelectedEmployee(record);
    setFormData(prev => ({
      ...prev,
      employeeId: record.passNumber,
      employeeName: `GPF Years: ${record.gpfYears}`
    }));
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to save GPF slip
    console.log('Form submitted:', formData);
    alert('GPF Slip submitted successfully!');
    // Reset form
    setFormData({
      employeeId: '',
      employeeName: '',
      month: '',
      year: '',
      basicPay: '',
      gpfSubscription: '',
      refundAdvance: '',
      interestRefund: '',
      totalAmount: '',
      remarks: ''
    });
  };

  const handleReset = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      month: '',
      year: '',
      basicPay: '',
      gpfSubscription: '',
      refundAdvance: '',
      interestRefund: '',
      totalAmount: '',
      remarks: ''
    });
    setSelectedEmployee(null);
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
  };

  return (
    <div className="add-gpf-slips-page">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={handleBackToGPF}>
            <span>←</span> Back to GPF
          </button>
          <span className="nav-brand">Add GPF Slips</span>
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

      <main className="add-gpf-slips-main">
        <div className="page-header">
          <h1 className="page-title">Add GPF Slip</h1>
          <p className="page-subtitle">Search for an employee and enter GPF contribution details</p>
        </div>

        <div className="content-wrapper">
          <div className="left-section">
            {/* Search Section */}
            <div className="search-container">
              <h3 className="search-title">Search GPF Years Record</h3>
              <div className="search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Enter Pass Number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                />
                <button 
                  className="btn-search" 
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? '🔍 Searching...' : '🔍 Search'}
                </button>
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="search-results-dropdown">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Pass Number</th>
                        <th>GPF Years</th>
                        <th>Closing Balance</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((record) => (
                        <tr key={record.passNumber}>
                          <td>{record.passNumber}</td>
                          <td>{record.gpfYears}</td>
                          <td>₹{Number(record.closingBalance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td>
                            <button 
                              className="btn-select"
                              onClick={() => handleSelectEmployee(record)}
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Form Section */}
            <div className="form-container">
              <form className="gpf-slip-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="section-title">Employee Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Employee ID *</label>
                  <input
                    type="text"
                    name="employeeId"
                    className="form-input"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    placeholder="Enter employee ID"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Employee Name *</label>
                  <input
                    type="text"
                    name="employeeName"
                    className="form-input"
                    value={formData.employeeName}
                    onChange={handleInputChange}
                    placeholder="Enter employee name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Period Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Month *</label>
                  <select
                    name="month"
                    className="form-input"
                    value={formData.month}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Year *</label>
                  <input
                    type="number"
                    name="year"
                    className="form-input"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="Enter year (e.g., 2024)"
                    min="2000"
                    max="2100"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Financial Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Basic Pay *</label>
                  <input
                    type="number"
                    name="basicPay"
                    className="form-input"
                    value={formData.basicPay}
                    onChange={handleInputChange}
                    placeholder="Enter basic pay"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GPF Subscription *</label>
                  <input
                    type="number"
                    name="gpfSubscription"
                    className="form-input"
                    value={formData.gpfSubscription}
                    onChange={handleInputChange}
                    placeholder="Enter GPF subscription amount"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Refund of Advance</label>
                  <input
                    type="number"
                    name="refundAdvance"
                    className="form-input"
                    value={formData.refundAdvance}
                    onChange={handleInputChange}
                    placeholder="Enter refund amount (if any)"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Interest on Refund</label>
                  <input
                    type="number"
                    name="interestRefund"
                    className="form-input"
                    value={formData.interestRefund}
                    onChange={handleInputChange}
                    placeholder="Enter interest amount (if any)"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Total Amount *</label>
                  <input
                    type="number"
                    name="totalAmount"
                    className="form-input"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    placeholder="Enter total amount"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Additional Information</h3>
              
              <div className="form-group">
                <label className="form-label">Remarks</label>
                <textarea
                  name="remarks"
                  className="form-input form-textarea"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  placeholder="Enter any additional remarks or notes"
                  rows="4"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-submit">
                <span>💾</span> Submit GPF Slip
              </button>
              <button type="button" className="btn btn-secondary btn-reset" onClick={handleReset}>
                <span>🔄</span> Reset Form
              </button>
            </div>
          </form>
            </div>
          </div>

          {/* GPF Years Record Card - Right Side */}
          {selectedEmployee && (
            <div className="employee-profile-card">
              <div className="profile-header">
                <h3 className="profile-title">Selected GPF Years Record</h3>
                <button 
                  className="btn-clear-selection"
                  onClick={() => setSelectedEmployee(null)}
                  title="Clear selection"
                >
                  ✕
                </button>
              </div>
              <div className="profile-content">
                <div className="profile-item">
                  <span className="profile-label">Pass Number:</span>
                  <span className="profile-value">{selectedEmployee.passNumber}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">GPF Years:</span>
                  <span className="profile-value">{selectedEmployee.gpfYears}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Closing Balance:</span>
                  <span className="profile-value">₹{Number(selectedEmployee.closingBalance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
