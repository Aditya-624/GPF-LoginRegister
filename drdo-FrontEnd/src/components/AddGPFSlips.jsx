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
  const [userDetails, setUserDetails] = useState(null); // For displaying user details in table
  const [allEmployees, setAllEmployees] = useState([]); // For dropdown list
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [gpfYearData, setGpfYearData] = useState({
    year: new Date().getFullYear(),
    closingBalance: ''
  });
  const [isSavingGpfYear, setIsSavingGpfYear] = useState(false);
  const [gpfYearsRecords, setGpfYearsRecords] = useState([]); // For displaying saved GPF years
  const [isLoadingGpfYears, setIsLoadingGpfYears] = useState(false);
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

  // Load all employees on component mount
  useEffect(() => {
    const fetchAllEmployees = async () => {
      setIsLoadingEmployees(true);
      try {
        const response = await axios.get('http://localhost:8081/api/gpf/all');
        setAllEmployees(response.data);
      } catch (error) {
        console.error('Error loading employees:', error);
        // Don't show alert on initial load, just log the error
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    fetchAllEmployees();
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
      alert('Please enter an Account Number or Personnel Number');
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(`http://localhost:8081/api/gpf/search`, {
        params: { query: searchQuery }
      });
      
      setSearchResults(response.data);
      setShowResults(true);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('No GPF account found matching your search');
        setSearchResults([]);
      } else if (error.response) {
        alert(`Error: ${error.response.data.message || 'Failed to search GPF accounts'}`);
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
    setUserDetails(record); // Set user details to display in table
    setSelectedEmployee(record);
    setFormData(prev => ({
      ...prev,
      employeeId: record.persNumber || '',
      employeeName: record.employeeName || ''
    }));
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
    
    // Fetch GPF years records for this employee
    fetchGpfYearsRecords(record.gpfAccountNumber);
  };

  const fetchGpfYearsRecords = async (accountNumber) => {
    setIsLoadingGpfYears(true);
    try {
      const response = await axios.get(`http://localhost:8081/api/gpf-years/search`, {
        params: { query: accountNumber }
      });
      setGpfYearsRecords(response.data);
    } catch (error) {
      console.error('Error fetching GPF years records:', error);
      setGpfYearsRecords([]);
    } finally {
      setIsLoadingGpfYears(false);
    }
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
    setUserDetails(null); // Clear user details table
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
  };

  const handleGpfYearChange = (e) => {
    const { name, value } = e.target;
    setGpfYearData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGpfYearSubmit = async (e) => {
    e.preventDefault();
    
    if (!userDetails?.gpfAccountNumber) {
      alert('Please select an employee first');
      return;
    }

    if (!gpfYearData.closingBalance || gpfYearData.closingBalance <= 0) {
      alert('Please enter a valid closing balance');
      return;
    }

    setIsSavingGpfYear(true);
    try {
      const payload = {
        passNumber: userDetails.gpfAccountNumber,
        gpfYears: parseFloat(gpfYearData.year),
        closingBalance: parseFloat(gpfYearData.closingBalance)
      };

      const response = await axios.post('http://localhost:8081/api/gpf-years/save', payload);
      
      alert(`GPF Year ${gpfYearData.year} closing balance saved successfully!`);
      setGpfYearData({
        year: new Date().getFullYear(),
        closingBalance: ''
      });
      
      // Refresh the GPF years records table
      fetchGpfYearsRecords(userDetails.gpfAccountNumber);
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'Failed to save GPF year data'}`);
      } else if (error.request) {
        alert('Cannot connect to backend server. Please ensure the server is running on port 8081');
      } else {
        alert('An error occurred while saving GPF year data');
      }
      console.error('Error saving GPF year:', error);
    } finally {
      setIsSavingGpfYear(false);
    }
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
              <h3 className="search-title">Search GPF Account</h3>
              <div className="search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Enter GPF Account Number, Personnel Number, or Employee Name"
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
                        <th>Account No</th>
                        <th>Pers Number</th>
                        <th>Employee Name</th>
                        <th>Designation</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((record) => (
                        <tr key={record.gpfAccountNumber}>
                          <td>{record.gpfAccountNumber}</td>
                          <td>{record.persNumber || 'N/A'}</td>
                          <td>{record.employeeName}</td>
                          <td>{record.designation || 'N/A'}</td>
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

              {/* Employee List Dropdown - Always visible */}
              <div className="employee-list-container">
                <h4 className="employee-list-title">Or Select from Employee List</h4>
                {isLoadingEmployees ? (
                  <div className="loading-message">Loading employees...</div>
                ) : allEmployees.length > 0 ? (
                  <select 
                    className="employee-dropdown"
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (selectedId) {
                        const employee = allEmployees.find(emp => emp.gpfAccountNumber.toString() === selectedId);
                        if (employee) {
                          handleSelectEmployee(employee);
                        }
                      }
                    }}
                    value={userDetails?.gpfAccountNumber || ''}
                  >
                    <option value="">-- Select an Employee --</option>
                    {allEmployees.map((employee) => (
                      <option 
                        key={employee.gpfAccountNumber} 
                        value={employee.gpfAccountNumber}
                      >
                        {employee.gpfAccountNumber} - {employee.employeeName} ({employee.persNumber})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="no-employees-message">No employees found in the system</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - User Details and GPF Year */}
          <div className="right-section">
            {/* User Details Table - Shows when user is selected */}
            {userDetails && (
            <div className="user-details-container">
              <h3 className="section-title">User Details</h3>
              <table className="user-details-table">
                <tbody>
                  {/* Row 1 */}
                  <tr>
                    <td className="table-label">GPF Account Number</td>
                    <td className="table-value">{userDetails?.gpfAccountNumber || '-'}</td>
                    <td className="table-label">Personnel Number</td>
                    <td className="table-value">{userDetails?.persNumber || '-'}</td>
                  </tr>
                  {/* Row 2 */}
                  <tr>
                    <td className="table-label">Employee Name</td>
                    <td className="table-value">{userDetails?.employeeName || '-'}</td>
                    <td className="table-label">Designation</td>
                    <td className="table-value">{userDetails?.designation || '-'}</td>
                  </tr>
                  {/* Row 3 */}
                  <tr>
                    <td className="table-label">Date of Birth</td>
                    <td className="table-value">{userDetails?.dob ? formatDate(userDetails.dob) : '-'}</td>
                    <td className="table-label">Date of Retirement</td>
                    <td className="table-value">{userDetails?.dateOfRetirement ? formatDate(userDetails.dateOfRetirement) : '-'}</td>
                  </tr>
                  {/* Row 4 */}
                  <tr>
                    <td className="table-label">Basic Pay</td>
                    <td className="table-value">{userDetails?.basicPay ? `₹${Number(userDetails.basicPay).toLocaleString('en-IN')}` : '-'}</td>
                    <td className="table-label">Phone Number</td>
                    <td className="table-value">{userDetails?.phoneNumber || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            )}

            {/* GPF Year Closing Balance Section */}
            {userDetails && (
              <div className="gpf-year-container">
                <h3 className="section-title">GPF Year Closing Balance</h3>
                
                <div className="gpf-year-content">
                  {/* Left: Saved Records Table */}
                  <div className="gpf-years-records">
                    <h4 className="records-title">Saved Records</h4>
                    {isLoadingGpfYears ? (
                      <div className="loading-message">Loading records...</div>
                    ) : gpfYearsRecords.length > 0 ? (
                      <table className="records-table">
                        <thead>
                          <tr>
                            <th>Year</th>
                            <th>Closing Balance</th>
                            <th>Account No</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gpfYearsRecords.map((record, index) => (
                            <tr key={index}>
                              <td>{record.gpfYears}</td>
                              <td>₹{Number(record.closingBalance).toLocaleString('en-IN')}</td>
                              <td>{record.passNumber}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="no-records-message">No records found for this employee</div>
                    )}
                  </div>

                  {/* Right: Add New Record Form */}
                  <div className="gpf-year-form-wrapper">
                    <h4 className="form-title">Add New Record</h4>
                    <form className="gpf-year-form" onSubmit={handleGpfYearSubmit}>
                  <div className="gpf-year-inputs">
                    <div className="gpf-year-field">
                      <label className="gpf-year-label">GPF Year</label>
                      <select
                        name="year"
                        className="gpf-year-input"
                        value={gpfYearData.year}
                        onChange={handleGpfYearChange}
                        required
                      >
                        <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                        <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                      </select>
                    </div>
                    <div className="gpf-year-field">
                      <label className="gpf-year-label"><strong>Closing Balance</strong></label>
                      <input
                        type="number"
                        name="closingBalance"
                        className="gpf-year-input"
                        value={gpfYearData.closingBalance}
                        onChange={handleGpfYearChange}
                        placeholder="Enter closing balance"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn-gpf-year-submit"
                      disabled={isSavingGpfYear}
                    >
                      {isSavingGpfYear ? 'Saving...' : 'Submit'}
                    </button>
                  </div>
                </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
