import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './TemporaryAdvance.css';
import ThemeSelector from './ThemeSelector';

export default function TemporaryAdvance() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState({
    staff: false,
    officer: false,
    onlineApplication: false
  });
  const [selectedUser, setSelectedUser] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [applicationDate, setApplicationDate] = useState('');
  const [applicationAmount, setApplicationAmount] = useState('');
  const [loanTakenCurrentYear, setLoanTakenCurrentYear] = useState('');
  const [loanDate, setLoanDate] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [billNo, setBillNo] = useState('');
  const [billDate, setBillDate] = useState('');
  const [recFrom, setRecFrom] = useState('');
  const [eligibleAmount, setEligibleAmount] = useState('');
  const [previousBalance, setPreviousBalance] = useState('');
  const [outstandingBalance, setOutstandingBalance] = useState('');
  const [noOfInstallments, setNoOfInstallments] = useState('');
  const [sanctionDate, setSanctionDate] = useState('');
  const [balanceInstallmentAmount, setBalanceInstallmentAmount] = useState('');
  const [sanctionAmount, setSanctionAmount] = useState('');
  const [changeSanctionAmount, setChangeSanctionAmount] = useState('');
  const [gpfUsrDetailsData, setGpfUsrDetailsData] = useState([]);

  // Sample purposes - replace with actual API call
  const purposes = [
    'Medical Treatment',
    'Education',
    'House Construction',
    'Marriage',
    'Vehicle Purchase',
    'Emergency',
    'Other'
  ];

  // Sample user data - replace with actual API call
  const userDetails = [
    { 
      id: 1, 
      name: 'John Doe', 
      gpfNumber: 'GPF001', 
      type: 'staff',
      personnelNumber: 'WS001',
      dob: '15 Jan 1985',
      designation: 'Technical Assistant',
      retirementDate: '15 Jan 2045',
      basicPay: '₹45,000',
      payInPayBand: '₹35,000',
      gradePay: '₹5,400',
      phoneNumber: '9876543210'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      gpfNumber: 'GPF002', 
      type: 'officer',
      personnelNumber: 'WS002',
      dob: '22 Mar 1980',
      designation: 'Senior Scientist',
      retirementDate: '22 Mar 2040',
      basicPay: '₹85,000',
      payInPayBand: '₹67,000',
      gradePay: '₹8,700',
      phoneNumber: '9876543211'
    },
    { 
      id: 3, 
      name: 'Robert Johnson', 
      gpfNumber: 'GPF003', 
      type: 'staff',
      personnelNumber: 'WS003',
      dob: '10 Jul 1990',
      designation: 'Junior Technician',
      retirementDate: '10 Jul 2050',
      basicPay: '₹35,000',
      payInPayBand: '₹25,000',
      gradePay: '₹4,200',
      phoneNumber: '9876543212'
    },
    { 
      id: 4, 
      name: 'Emily Davis', 
      gpfNumber: 'GPF004', 
      type: 'officer',
      personnelNumber: 'WS004',
      dob: '05 Dec 1982',
      designation: 'Principal Scientist',
      retirementDate: '05 Dec 2042',
      basicPay: '₹95,000',
      payInPayBand: '₹75,000',
      gradePay: '₹10,000',
      phoneNumber: '9876543213'
    },
    { 
      id: 5, 
      name: 'Michael Brown', 
      gpfNumber: 'GPF005', 
      type: 'onlineApplication',
      personnelNumber: 'WS005',
      dob: '18 Sep 1988',
      designation: 'Research Associate',
      retirementDate: '18 Sep 2048',
      basicPay: '₹55,000',
      payInPayBand: '₹42,000',
      gradePay: '₹6,600',
      phoneNumber: '9876543214'
    },
    { 
      id: 6, 
      name: 'Sarah Wilson', 
      gpfNumber: 'GPF006', 
      type: 'staff',
      personnelNumber: 'WS006',
      dob: '30 Apr 1992',
      designation: 'Lab Assistant',
      retirementDate: '30 Apr 2052',
      basicPay: '₹32,000',
      payInPayBand: '₹22,000',
      gradePay: '₹3,600',
      phoneNumber: '9876543215'
    },
    { 
      id: 7, 
      name: 'David Lee', 
      gpfNumber: 'GPF007', 
      type: 'officer',
      personnelNumber: 'WS007',
      dob: '12 Nov 1978',
      designation: 'Director',
      retirementDate: '12 Nov 2038',
      basicPay: '₹125,000',
      payInPayBand: '₹100,000',
      gradePay: '₹12,000',
      phoneNumber: '9876543216'
    },
    { 
      id: 8, 
      name: 'Lisa Anderson', 
      gpfNumber: 'GPF008', 
      type: 'onlineApplication',
      personnelNumber: 'WS008',
      dob: '25 Jun 1995',
      designation: 'Project Fellow',
      retirementDate: '25 Jun 2055',
      basicPay: '₹40,000',
      payInPayBand: '₹31,000',
      gradePay: '₹5,000',
      phoneNumber: '9876543217'
    }
  ];

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch (e) { return null; }
  })();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch GPF User Details from database
  useEffect(() => {
    fetchGpfUsrDetails();
  }, []);

  const fetchGpfUsrDetails = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/gpf-usr-details/all');
      if (response.ok) {
        const data = await response.json();
        setGpfUsrDetailsData(data);
        console.log('GPF User Details fetched:', data);
      } else {
        console.error('Failed to fetch GPF User Details');
      }
    } catch (error) {
      console.error('Error fetching GPF User Details:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector('.search-dropdown-wrapper');
      if (dropdown && !dropdown.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTypeChange = (type) => {
    setSelectedType(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    setSelectedUser(''); // Reset selection when filter changes
  };

  // Filter users based on selected types and search query
  const getFilteredUsers = () => {
    // Use GPF User Details data if available, otherwise use hardcoded data
    const usersToFilter = gpfUsrDetailsData.length > 0 ? gpfUsrDetailsData.map(detail => ({
      id: detail.id || detail.persNo,
      name: detail.persNo,
      gpfNumber: detail.persNo,
      type: 'staff',
      personnelNumber: detail.persNo,
      dob: '15 Jan 1985',
      designation: 'Employee',
      retirementDate: '15 Jan 2045',
      basicPay: `₹${detail.presentBasicPay || 0}`,
      payInPayBand: `₹${detail.presentBasicPay || 0}`,
      gradePay: '₹5,400',
      phoneNumber: detail.phoneNo || '9876543210'
    })) : userDetails;

    let filtered = usersToFilter;

    // Filter by type checkboxes
    const selectedTypes = Object.keys(selectedType).filter(key => selectedType[key]);
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(user => selectedTypes.includes(user.type));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.gpfNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    setIsDropdownOpen(false);
    const user = userDetails.find(u => u.id === userId);
    if (user) {
      setSearchQuery(`${user.name} - ${user.gpfNumber}`);
    }
  };

  const selectedUserData = userDetails.find(u => u.id === selectedUser);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleSignOut = () => {
    try { 
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    } catch (e) { /* ignore */ }
    navigate('/');
  };

  const handleBackToGPF = () => {
    try { window.__ANIMATE_NAV = true; } catch (e) {}
    navigate('/gpf');
  };

  const handleSubmitApplication = async () => {
    if (!selectedPurpose || !billNo || !billDate || !recFrom || !applicationDate || !applicationAmount) {
      alert('Please fill all required fields');
      return;
    }

    const payload = {
      persNo: selectedUserData.personnelNumber,
      gpfLoanType: 'T', // T for Temporary Advance
      applicationDate: applicationDate,
      purpose: selectedPurpose,
      billNo: billNo,
      billDate: billDate,
      recoveryFromDate: recFrom,
      appliedAmount: parseFloat(applicationAmount),
      loanTakenCurrentYear: loanTakenCurrentYear ? parseFloat(loanTakenCurrentYear) : null,
      loanDate: loanDate || null
    };

    try {
      const response = await fetch('http://localhost:8081/api/gpf-sanction-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Temporary Advance Application submitted successfully!');
        // Reset form
        setSelectedUser('');
        setSearchQuery('');
        setApplicationDate('');
        setApplicationAmount('');
        setLoanTakenCurrentYear('');
        setLoanDate('');
        setSelectedPurpose('');
        setBillNo('');
        setBillDate('');
        setRecFrom('');
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application: ' + error.message);
    }
  };

  const handleChangeSanctionAmount = () => {
    if (!changeSanctionAmount) {
      alert('Please enter a sanction amount');
      return;
    }

    // Handle the change sanction amount logic here
    console.log('Changing sanction amount to:', changeSanctionAmount);
    alert('Sanction amount updated to: ' + changeSanctionAmount);
    setChangeSanctionAmount('');
  };

  return (
    <div className="temporary-advance-page">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={handleBackToGPF}>
            <span>←</span> Back to GPF
          </button>
          <span className="nav-brand">Temporary Advance</span>
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

      <main className="temporary-advance-main">
        <div className="content-layout">
          {/* Left Side - Search Section */}
          <div className="search-section">
            <h2 className="section-title">🔍 Search User</h2>
            
            <div className="search-container">
              <div className="filter-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedType.staff}
                    onChange={() => handleTypeChange('staff')}
                  />
                  <span className="checkbox-text">Staff</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedType.officer}
                    onChange={() => handleTypeChange('officer')}
                  />
                  <span className="checkbox-text">Officer</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedType.onlineApplication}
                    onChange={() => handleTypeChange('onlineApplication')}
                  />
                  <span className="checkbox-text">Online</span>
                </label>
              </div>

              <div className="search-dropdown-wrapper">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search or select user..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                  />
                  <span className="search-icon">🔍</span>
                  <button 
                    className="dropdown-toggle"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    ▼
                  </button>
                </div>

                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <div
                          key={user.id}
                          className={`dropdown-item ${selectedUser === user.id ? 'selected' : ''}`}
                          onClick={() => handleUserSelect(user.id)}
                        >
                          <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-gpf">{user.gpfNumber}</span>
                          </div>
                          <span className={`user-type-badge ${user.type}`}>
                            {user.type === 'staff' ? 'Staff' : 
                             user.type === 'officer' ? 'Officer' : 
                             'Online'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="dropdown-item no-results">
                        No users found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - User Details Section */}
          <div className="user-details-section">
            <h2 className="section-title">👤 User Details</h2>
            
            {selectedUserData ? (
              <div className="user-details-card">
                <table className="details-table">
                  <tbody>
                    <tr>
                      <td className="table-label">PERS NO.</td>
                      <td className="table-value">{selectedUserData.personnelNumber}</td>
                      <td className="table-label">GPF ACC. NO.</td>
                      <td className="table-value">{selectedUserData.gpfNumber}</td>
                    </tr>
                    <tr>
                      <td className="table-label">NAME</td>
                      <td className="table-value">{selectedUserData.name}</td>
                      <td className="table-label">PAY IN PAY BAND</td>
                      <td className="table-value">{selectedUserData.payInPayBand}</td>
                    </tr>
                    <tr>
                      <td className="table-label">DOB</td>
                      <td className="table-value">{selectedUserData.dob}</td>
                      <td className="table-label">GRADE PAY</td>
                      <td className="table-value">{selectedUserData.gradePay}</td>
                    </tr>
                    <tr>
                      <td className="table-label">DESIGNATION</td>
                      <td className="table-value">{selectedUserData.designation}</td>
                      <td className="table-label">BASIC PAY</td>
                      <td className="table-value">{selectedUserData.basicPay}</td>
                    </tr>
                    <tr>
                      <td className="table-label">RETIREMENT DATE</td>
                      <td className="table-value">{selectedUserData.retirementDate}</td>
                      <td className="table-label">PHONE NUMBER</td>
                      <td className="table-value">{selectedUserData.phoneNumber}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-selection">
                <div className="no-selection-icon">📋</div>
                <p className="no-selection-text">Select a user to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Application Form Section - Full Width Below */}
        {selectedUserData && (
          <div className="application-form-section">
            <h3 className="form-section-title">📝 Application Details</h3>
            
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">
                  Application Date: <span className="required">*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={applicationDate}
                  onChange={(e) => setApplicationDate(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Application Amount: <span className="required">*</span>
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter amount"
                  value={applicationAmount}
                  onChange={(e) => setApplicationAmount(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Loan Taken in Current Year:
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter amount"
                  value={loanTakenCurrentYear}
                  onChange={(e) => setLoanTakenCurrentYear(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Date:
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={loanDate}
                  onChange={(e) => setLoanDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* New Section Below Application Form */}
        {selectedUserData && (
          <div className="additional-section">
            <h3 className="form-section-title">📋 Purpose & Bill Details</h3>
            
            <div className="purpose-bill-grid">
              <div className="form-field full-width">
                <label className="form-label">
                  Purpose: <span className="required">*</span>
                </label>
                <select
                  className="form-input form-select"
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value)}
                >
                  <option value="">-- Select Purpose --</option>
                  {purposes.map((purpose, index) => (
                    <option key={index} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">
                  Bill No.: <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter bill number"
                  value={billNo}
                  onChange={(e) => setBillNo(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Bill Date: <span className="required">*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={billDate}
                  onChange={(e) => setBillDate(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Rec From: <span className="required">*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={recFrom}
                  onChange={(e) => setRecFrom(e.target.value)}
                />
              </div>
            </div>

            <div className="submit-section">
              <button 
                className="submit-btn"
                onClick={handleSubmitApplication}
              >
                Submit Application
              </button>
            </div>
          </div>
        )}

        {/* Sanction Details Section */}
        {selectedUserData && (
          <div className="sanction-details-section">
            <h3 className="form-section-title">💰 Sanction Details</h3>
            
            <div className="sanction-grid">
              <div className="form-field">
                <label className="form-label">
                  Eligible Amount:
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter eligible amount"
                  value={eligibleAmount}
                  onChange={(e) => setEligibleAmount(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Previous Balance:
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter previous balance"
                  value={previousBalance}
                  onChange={(e) => setPreviousBalance(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Outstanding Balance:
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter outstanding balance"
                  value={outstandingBalance}
                  onChange={(e) => setOutstandingBalance(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  No. of Installments:
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter number of installments"
                  value={noOfInstallments}
                  onChange={(e) => setNoOfInstallments(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Sanction Date:
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={sanctionDate}
                  onChange={(e) => setSanctionDate(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Balance Installment Amount:
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter balance installment amount"
                  value={balanceInstallmentAmount}
                  onChange={(e) => setBalanceInstallmentAmount(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Sanction Amount:
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter sanction amount"
                  value={sanctionAmount}
                  onChange={(e) => setSanctionAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="submit-section">
              <button 
                className="submit-btn"
                onClick={handleSubmitApplication}
              >
                Submit Application
              </button>
            </div>
          </div>
        )}

        {/* Change Sanction Amount Section */}
        {selectedUserData && (
          <div className="change-sanction-section">
            <h3 className="form-section-title">✏️ Change Sanction Amount</h3>
            
            <div className="change-sanction-container">
              <input
                type="number"
                className="form-input change-sanction-input"
                placeholder="Enter new sanction amount"
                value={changeSanctionAmount}
                onChange={(e) => setChangeSanctionAmount(e.target.value)}
              />

              <button 
                className="go-btn"
                onClick={handleChangeSanctionAmount}
              >
                GO
              </button>
            </div>
          </div>
        )}

        {/* Tables Section - Side by Side */}
        {selectedUserData && (
          <div className="tables-section">
            <div className="tables-container">
              {/* Table 1 - Slip Details */}
              <div className="table-wrapper">
                <h3 className="table-title">📋 SLIP DETAILS</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>PERS NO.</th>
                      <th>GPF YEARS</th>
                      <th>CLOSING BALANCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{selectedUserData.personnelNumber || '-'}</td>
                      <td>2024-25</td>
                      <td>₹{outstandingBalance || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Table 2 - Recovery From Pay Bill */}
              <div className="table-wrapper">
                <h3 className="table-title">💳 RECOVERY FROM PAY BILL</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>DT/MONTH/YEAR</th>
                      <th>GPF SUBSCRIPTION</th>
                      <th>REFU NO.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{recFrom ? new Date(recFrom).toLocaleDateString('en-GB') : '-'}</td>
                      <td>₹{applicationAmount || '-'}</td>
                      <td>{billNo || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
