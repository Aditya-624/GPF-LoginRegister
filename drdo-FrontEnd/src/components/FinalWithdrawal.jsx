import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './TemporaryAdvance.css';
import ThemeSelector from './ThemeSelector';

export default function FinalWithdrawal() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedType, setSelectedType] = useState('staff');
  const [onlineApplication, setOnlineApplication] = useState(false);

  // Search / combobox state (AddSubscription model)
  const [persNoInput, setPersNoInput] = useState('');
  const [typedQuery, setTypedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const inputRef = useRef(null);

  // Form fields
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

  const reasons = [
    'Retirement', 'Resignation', 'Medical Emergency',
    'Personal Reasons', 'Transfer', 'Other'
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch all employees on mount
  useEffect(() => {
    fetch('http://localhost:8081/api/gpf/all')
      .then(r => r.json())
      .then(data => setAllEmployees(data))
      .catch(e => console.error('Error loading employees:', e));
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatDate = (ds) => {
    if (!ds) return '-';
    return new Date(ds).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getBaseList = () => {
    if (onlineApplication) return allEmployees;
    return allEmployees.filter(emp => {
      const ws = (emp.workStatus || '').toUpperCase();
      if (selectedType === 'officer') return ws === 'OFFICER';
      return ws !== 'OFFICER';
    });
  };

  const handlePersNoChange = (e) => {
    const val = e.target.value;
    setPersNoInput(val);
    setTypedQuery(val);
    if (val.trim().length > 0) {
      const q = val.toLowerCase();
      const filtered = getBaseList().filter(emp =>
        emp.persNumber?.toString().toLowerCase().includes(q) ||
        emp.employeeName?.toLowerCase().includes(q) ||
        emp.gpfAccountNumber?.toString().toLowerCase().includes(q)
      );
      setFilteredEmployees(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
      setFilteredEmployees([]);
    }
  };

  const handleDropdownToggle = () => {
    if (!showDropdown) {
      setFilteredEmployees(getBaseList());
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSearch = async () => {
    const query = persNoInput.trim();
    if (!query) return;
    const q = query.toLowerCase();
    const local = getBaseList().filter(emp =>
      emp.persNumber?.toString().toLowerCase().includes(q) ||
      emp.employeeName?.toLowerCase().includes(q) ||
      emp.gpfAccountNumber?.toString().toLowerCase().includes(q)
    );
    if (local.length === 1) {
      handleSelectEmployee(local[0]);
      return;
    }
    if (local.length > 1) {
      setFilteredEmployees(local);
      setShowDropdown(true);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8081/api/gpf/search?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const results = await res.json();
        if (results?.length === 1) {
          handleSelectEmployee(results[0]);
        } else if (results?.length > 1) {
          setFilteredEmployees(results);
          setShowDropdown(true);
        } else {
          alert('No employee found for: ' + query);
        }
      } else {
        alert('No employee found for: ' + query);
      }
    } catch (e) {
      alert('Cannot connect to backend server.');
    }
  };

  const handleSelectEmployee = (record) => {
    setSelectedRecord(record);
    setPersNoInput(`${record.gpfAccountNumber} - ${record.employeeName} (${record.persNumber})`);
    setShowDropdown(false);
  };

  const highlight = (text, query) => {
    if (!query || !text) return text;
    const str = String(text);
    const i = str.toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return str;
    return (
      <>
        {str.slice(0, i)}
        <mark style={{ background: '#ffe066', padding: 0 }}>{str.slice(i, i + query.length)}</mark>
        {str.slice(i + query.length)}
      </>
    );
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    resetForm();
  };

  const handleOnlineApplicationChange = () => {
    setOnlineApplication(prev => !prev);
    resetForm();
  };

  const resetForm = () => {
    setSelectedRecord(null);
    setPersNoInput('');
    setTypedQuery('');
    setShowDropdown(false);
    setWithdrawalDate(''); setWithdrawalAmount(''); setClosingBalance('');
    setWithdrawalReason(''); setBankName(''); setAccountNumber(''); setIfscCode('');
    setEligibleAmount(''); setPreviousBalance(''); setOutstandingBalance('');
    setNoOfInstallments(''); setSanctionDate(''); setBalanceInstallmentAmount(''); setSanctionAmount('');
  };

  const handleSubmitWithdrawal = async () => {
    if (!selectedRecord) { alert('Please select an employee'); return; }
    if (!withdrawalDate || !withdrawalAmount || !withdrawalReason || !bankName || !accountNumber || !ifscCode) {
      alert('Please fill all required fields');
      return;
    }
    const payload = {
      persNo: selectedRecord.persNumber,
      gpfLoanType: 'F',
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
        resetForm();
      } else {
        alert('Failed to submit withdrawal request. Please try again.');
      }
    } catch (error) {
      alert('Error submitting withdrawal: ' + error.message);
    }
  };

  return (
    <div className="temporary-advance-page">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={() => { try { window.__ANIMATE_NAV = true; } catch (e) {} navigate('/gpf'); }}>
            <span>←</span> Back to GPF
          </button>
          <span className="nav-brand">Final Withdrawal</span>
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

      <main className="temporary-advance-main">
        <div className="content-layout">
          {/* Left Side - Search Section */}
          <div className="search-section">
            <h2 className="section-title">🔍 Search User</h2>

            <div className="search-container">
              <div className="filter-options">
                <div className="type-selector-group">
                  <span className="type-selector-label">Officer or Staff:</span>
                  <label className="radio-label">
                    <input type="radio" name="staffOfficer" value="staff"
                      checked={selectedType === 'staff'}
                      onChange={(e) => handleTypeChange(e.target.value)} />
                    <span className="radio-text">Staff</span>
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="staffOfficer" value="officer"
                      checked={selectedType === 'officer'}
                      onChange={(e) => handleTypeChange(e.target.value)} />
                    <span className="radio-text">Officer</span>
                  </label>
                </div>
                <label className="checkbox-label">
                  <input type="checkbox" checked={onlineApplication} onChange={handleOnlineApplicationChange} />
                  <span className="checkbox-text">Online Application</span>
                </label>
              </div>

              {/* Combobox — AddSubscription model */}
              <div className="search-dropdown-wrapper" style={{ position: 'relative' }}>
                <div className="search-input-wrapper">
                  <input
                    ref={inputRef}
                    type="text"
                    className="search-input"
                    placeholder="Enter Pers No, Name or Account No..."
                    value={persNoInput}
                    onChange={handlePersNoChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    onFocus={() => { if (!persNoInput.trim()) { setFilteredEmployees(getBaseList()); setShowDropdown(true); } }}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 160)}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="dropdown-toggle"
                    onMouseDown={(e) => { e.preventDefault(); handleDropdownToggle(); }}
                    tabIndex={-1}
                  >▾</button>
                </div>

                {showDropdown && (
                  <ul style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 999,
                    background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #ccc)',
                    borderRadius: '6px', maxHeight: '220px', overflowY: 'auto',
                    listStyle: 'none', margin: 0, padding: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    {filteredEmployees.length > 0 ? filteredEmployees.map((emp) => (
                      <li
                        key={emp.gpfAccountNumber}
                        onMouseDown={() => handleSelectEmployee(emp)}
                        style={{
                          padding: '8px 12px', cursor: 'pointer', display: 'flex',
                          gap: '8px', alignItems: 'center', fontSize: '0.85rem',
                          borderBottom: '1px solid var(--border-color, #eee)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg, #f0f4ff)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontWeight: 600, minWidth: '80px' }}>{highlight(emp.gpfAccountNumber?.toString(), typedQuery)}</span>
                        <span style={{ flex: 1 }}>{highlight(emp.employeeName, typedQuery)}</span>
                        <span style={{ color: 'var(--text-muted, #888)', fontSize: '0.8rem' }}>({highlight(emp.persNumber?.toString(), typedQuery)})</span>
                      </li>
                    )) : (
                      <li style={{ padding: '10px 12px', color: 'var(--text-muted, #888)', fontSize: '0.85rem' }}>
                        No matching employees found
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - User Details Section */}
          <div className="user-details-section">
            <h2 className="section-title">👤 User Details</h2>

            {selectedRecord ? (
              <div className="user-details-card">
                <table className="details-table">
                  <tbody>
                    <tr>
                      <td className="table-label">PERS NO.</td>
                      <td className="table-value">{selectedRecord.persNumber || '-'}</td>
                      <td className="table-label">GPF ACC. NO.</td>
                      <td className="table-value">{selectedRecord.gpfAccountNumber || '-'}</td>
                    </tr>
                    <tr>
                      <td className="table-label">NAME</td>
                      <td className="table-value">{selectedRecord.employeeName || '-'}</td>
                      <td className="table-label">BASIC PAY</td>
                      <td className="table-value">{selectedRecord.basicPay ? `₹${Number(selectedRecord.basicPay).toLocaleString('en-IN')}` : '-'}</td>
                    </tr>
                    <tr>
                      <td className="table-label">DOB</td>
                      <td className="table-value">{formatDate(selectedRecord.dob)}</td>
                      <td className="table-label">DESIGNATION</td>
                      <td className="table-value">{selectedRecord.designation || '-'}</td>
                    </tr>
                    <tr>
                      <td className="table-label">RETIREMENT DATE</td>
                      <td className="table-value">{formatDate(selectedRecord.dateOfRetirement)}</td>
                      <td className="table-label">PHONE NUMBER</td>
                      <td className="table-value">{selectedRecord.phoneNumber || '-'}</td>
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

        {/* Withdrawal Details */}
        {selectedRecord && (
          <div className="application-form-section">
            <h3 className="form-section-title">📝 Withdrawal Details</h3>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Withdrawal Date: <span className="required">*</span></label>
                <input type="date" className="form-input" value={withdrawalDate} onChange={(e) => setWithdrawalDate(e.target.value)} onKeyDown={(e) => e.preventDefault()} />
              </div>
              <div className="form-field">
                <label className="form-label">Withdrawal Amount: <span className="required">*</span></label>
                <input type="number" className="form-input" placeholder="Enter amount" value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Closing Balance:</label>
                <input type="number" className="form-input" placeholder="Enter closing balance" value={closingBalance} onChange={(e) => setClosingBalance(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Withdrawal Reason: <span className="required">*</span></label>
                <select className="form-input form-select" value={withdrawalReason} onChange={(e) => setWithdrawalReason(e.target.value)}>
                  <option value="">-- Select Reason --</option>
                  {reasons.map((r, i) => <option key={i} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Bank Details */}
        {selectedRecord && (
          <div className="additional-section">
            <h3 className="form-section-title">🏦 Bank Details</h3>
            <div className="purpose-bill-grid">
              <div className="form-field">
                <label className="form-label">Bank Name: <span className="required">*</span></label>
                <input type="text" className="form-input" placeholder="Enter bank name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Account Number: <span className="required">*</span></label>
                <input type="text" className="form-input" placeholder="Enter account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">IFSC Code: <span className="required">*</span></label>
                <input type="text" className="form-input" placeholder="Enter IFSC code" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
              </div>
            </div>
            <div className="submit-section">
              <button className="submit-btn" onClick={handleSubmitWithdrawal}>Submit Withdrawal Request</button>
            </div>
          </div>
        )}

        {/* Sanction Details */}
        {selectedRecord && (
          <div className="sanction-details-section">
            <h3 className="form-section-title">💰 Sanction Details</h3>
            <div className="sanction-grid">
              <div className="form-field">
                <label className="form-label">Eligible Amount:</label>
                <input type="number" className="form-input" placeholder="Enter eligible amount" value={eligibleAmount} onChange={(e) => setEligibleAmount(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Previous Balance:</label>
                <input type="number" className="form-input" placeholder="Enter previous balance" value={previousBalance} onChange={(e) => setPreviousBalance(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Outstanding Balance:</label>
                <input type="number" className="form-input" placeholder="Enter outstanding balance" value={outstandingBalance} onChange={(e) => setOutstandingBalance(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">No. of Installments:</label>
                <input type="number" className="form-input" placeholder="Enter number of installments" value={noOfInstallments} onChange={(e) => setNoOfInstallments(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Sanction Date:</label>
                <input type="date" className="form-input" value={sanctionDate} onChange={(e) => setSanctionDate(e.target.value)} onKeyDown={(e) => e.preventDefault()} />
              </div>
              <div className="form-field">
                <label className="form-label">Balance Installment Amount:</label>
                <input type="number" className="form-input" placeholder="Enter balance installment amount" value={balanceInstallmentAmount} onChange={(e) => setBalanceInstallmentAmount(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Sanction Amount:</label>
                <input type="number" className="form-input" placeholder="Enter sanction amount" value={sanctionAmount} onChange={(e) => setSanctionAmount(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Tables Section */}
        {selectedRecord && (
          <div className="tables-section">
            <div className="tables-container">
              <div className="table-wrapper">
                <h3 className="table-title">📋 SLIP DETAILS</h3>
                <table className="data-table">
                  <thead>
                    <tr><th>PERS NO.</th><th>GPF YEARS</th><th>CLOSING BALANCE</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{selectedRecord.persNumber || '-'}</td>
                      <td>2024-25</td>
                      <td>₹{closingBalance || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="table-wrapper">
                <h3 className="table-title">💳 RECOVERY FROM PAY BILL</h3>
                <table className="data-table">
                  <thead>
                    <tr><th>DT/MONTH/YEAR</th><th>GPF SUBSCRIPTION</th><th>REFU NO.</th></tr>
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
