import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './TemporaryAdvance.css';
import ThemeSelector from './ThemeSelector';

export default function FinalWithdrawal() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('staff'); // 'staff' or 'officer'
  const [onlineApplication, setOnlineApplication] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [withdrawalDate, setWithdrawalDate] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [closingBalance, setClosingBalance] = useState('');
  const [withdrawalReason, setWithdrawalReason] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [eligibleAmount, setEligibleAmount] = useState('');
  const [previousBalance, setPreviousBalance] = useState('');
  const [outstandingBalance, setOutstandingBalance] = useState('');
  const [noOfInstallments, setNoOfInstallments] = useState('');
  const [sanctionDate, setSanctionDate] = useState('');
  const [balanceInstallmentAmount, setBalanceInstallmentAmount] = useState('');
  const [sanctionAmount, setSanctionAmount] = useState('');
  const [gpfUsrDetailsData, setGpfUsrDetailsData] = useState([]);

  const reasons = [
    'Retirement',
    'Resignation',
    'Medical Emergency',
    'Personal Reasons',
    'Transfer',
    'Other'
  ];

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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch GPF User Details from database
  useEffect(() => {
    if (onlineApplication) {
      fetchGpfUsrDetails();
    }
  }, [onlineApplication]);

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
    setSelectedType(type);
    setSelectedUser('');
    // Clear all form data when type changes
    setSearchQuery('');
    setWithdrawalDate('');
    setWithdrawalAmount('');
    setClosingBalance('');
    setWithdrawalReason('');
    setBankName('');
    setAccountNumber('');
    setIfscCode('');
    setEligibleAmount('');
    setPreviousBalance('');
    setOutstandingBalance('');
    setNoOfInstallments('');
    setSanctionDate('');
    setBalanceInstallmentAmount('');
    setSanctionAmount('');
  };

  const handleOnlineApplicationChange = () => {
    setOnlineApplication(!onlineApplication);
  };

  const getFilteredUsers = () => {
    let usersToFilter = [];

    // If Online Application is checked, use GPF User Details data
    if (onlineApplication && gpfUsrDetailsData.length > 0) {
      usersToFilter = gpfUsrDetailsData.map(detail => ({
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
      }));
    } else {
      // Otherwise use hardcoded user details filtered by selected type
      usersToFilter = userDetails.filter(user => user.type === selectedType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      usersToFilter = usersToFilter.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.gpfNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return usersToFilter;
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

  const handleBackToGPF = () => {
    try { window.__ANIMATE_NAV = true; } catch (e) {}
    navigate('/gpf');
  };

  const handleSubmitWithdrawal = async () => {
    if (!withdrawalDate || !withdrawalAmount || !withdrawalReason || !bankName || !accountNumber || !ifscCode) {
      alert('Please fill all required fields');
      return;
    }

    const payload = {
      persNo: selectedUserData.personnelNumber,
      gpfLoanType: 'F', // F for Final Withdrawal
      applicationDate: withdrawalDate,
      sanctionDate: withdrawalDate,
      sanctionAmount: parseFloat(withdrawalAmount),
      purpose: withdrawalReason,
      recoveryFromDate: withdrawalDate,
      appliedAmount: parseFloat(withdrawalAmount),
      remarks: `Bank: ${bankName}, Account: ${accountNumber}, IFSC: ${ifscCode}, Closing Balance: ${closingBalance}`
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
        alert('Final Withdrawal Application submitted successfully!');
        // Reset form
        setSelectedUser('');
        setSearchQuery('');
        setWithdrawalDate('');
        setWithdrawalAmount('');
        setClosingBalance('');
        setWithdrawalReason('');
        setBankName('');
        setAccountNumber('');
        setIfscCode('');
      } else {
        alert('Failed to submit withdrawal request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      alert('Error submitting withdrawal: ' + error.message);
    }
  };

  return (
    <div className="temporary-advance-page">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={handleBackToGPF}>
            <span>←</span> Back to GPF
          </button>
          <span className="nav-brand">Final Withdrawal</span>
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
          <div className="search-section">
            <h2 className="section-title">🔍 Search User</h2>
            
            <div className="search-container">
              <div className="filter-options">
                <div className="type-selector-group">
                  <span className="type-selector-label">Officer or Staff:</span>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="staffOfficer"
                      value="staff"
                      checked={selectedType === 'staff'}
                      onChange={(e) => handleTypeChange(e.target.value)}
                    />
                    <span className="radio-text">Staff</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="staffOfficer"
                      value="officer"
                      checked={selectedType === 'officer'}
                      onChange={(e) => handleTypeChange(e.target.value)}
                    />
                    <span className="radio-text">Officer</span>
                  </label>
                </div>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={onlineApplication}
                    onChange={handleOnlineApplicationChange}
                  />
                  <span className="checkbox-text">Online Application</span>
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

        {selectedUserData && (
          <div className="application-form-section">
            <h3 className="form-section-title">📝 Withdrawal Details</h3>
            
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">
                  Withdrawal Date: <span className="required">*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={withdrawalDate}
                  onChange={(e) => setWithdrawalDate(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Withdrawal Amount: <span className="required">*</span>
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter amount"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Closing Balance:
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter closing balance"
                  value={closingBalance}
                  onChange={(e) => setClosingBalance(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Withdrawal Reason: <span className="required">*</span>
                </label>
                <select
                  className="form-input form-select"
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                >
                  <option value="">-- Select Reason --</option>
                  {reasons.map((reason, index) => (
                    <option key={index} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {selectedUserData && (
          <div className="additional-section">
            <h3 className="form-section-title">🏦 Bank Details</h3>
            
            <div className="purpose-bill-grid">
              <div className="form-field">
                <label className="form-label">
                  Bank Name: <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter bank name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Account Number: <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  IFSC Code: <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter IFSC code"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                />
              </div>
            </div>

            <div className="submit-section">
              <button 
                className="submit-btn"
                onClick={handleSubmitWithdrawal}
              >
                Submit Withdrawal Request
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
                      <td>₹{closingBalance || '-'}</td>
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
                      <td>{withdrawalDate ? new Date(withdrawalDate).toLocaleDateString('en-GB') : '-'}</td>
                      <td>₹{withdrawalAmount || '-'}</td>
                      <td>{withdrawalReason || '-'}</td>
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
