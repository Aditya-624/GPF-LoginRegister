import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './UserApplicationGPF.css';
import ThemeSelector from './ThemeSelector';
import { userService } from '../services/userService';

export default function UserApplicationGPF() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [joiningDate, setJoiningDate] = useState('');
  const [userSession, setUserSession] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    phoneNo: '',
    presentBasicPay: '',
    previousAdvanceAmount: '',
    monthDrawn: '',
    purposeDrawn: '',
    outstandingAmount: '',
    gpfLoanType: '',
    purposeRequired: '',
    amountApplied: '',
    enclosures: '',
    finalWithdrawalDrawn: '',
    previousFinalAmount: '',
    previousFinalMonth: ''
  });

  const [gpfDetails, setGpfDetails] = useState(null);
  const [purposeOptions, setPurposeOptions] = useState([]);
  
  // GPF Accumulation state
  const [gpfAccumulation, setGpfAccumulation] = useState({
    closingBalance: 0,
    gpfSubscription: 0,
    gpfRefund: 0,
    recoveryFromArrears: 0
  });

  // GPF Withdrawals state
  const [gpfWithdrawals, setGpfWithdrawals] = useState({
    approved: 0
  });

  // Load user session and GPF details on component mount
  useEffect(() => {
    const session = userService.getUserSession();
    if (session) {
      setUserSession(session);
      // Auto-fill joining date from user's DOB if available
      if (session.dob) {
        // Format the date from backend (YYYY-MM-DD) to display format (DD/MM/YYYY)
        const date = new Date(session.dob);
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        setJoiningDate(formattedDate);
      }

      // Fetch GPF details and GPF Years data for the logged-in user
      fetchGPFDetails(session.userId);
      fetchGPFYearsData(session.userId);
    }
  }, []);

  // Fetch purposes when GPF loan type changes
  useEffect(() => {
    if (formData.gpfLoanType) {
      fetchPurposes(formData.gpfLoanType);
    } else {
      setPurposeOptions([]);
      setFormData(prev => ({ ...prev, purposeRequired: '' }));
    }
  }, [formData.gpfLoanType]);

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

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCurrentMonthYear = () => {
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    return `${months[currentTime.getMonth()]} ${currentTime.getFullYear()}`;
  };

  const getFinancialYearRange = () => {
    const currentMonth = currentTime.getMonth(); // 0-11
    const currentYear = currentTime.getFullYear();
    
    // Financial year starts in April (month 3)
    let startYear, endYear;
    if (currentMonth >= 3) { // April to December
      startYear = currentYear;
      endYear = currentYear + 1;
    } else { // January to March
      startYear = currentYear - 1;
      endYear = currentYear;
    }
    
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentMonthShort = months[currentTime.getMonth()];
    
    return `APR-${startYear} TO ${currentMonthShort}-${endYear}`;
  };

  const getFinancialYears = () => {
    const currentMonth = currentTime.getMonth();
    const currentYear = currentTime.getFullYear();
    
    let startYear;
    if (currentMonth >= 3) {
      startYear = currentYear;
    } else {
      startYear = currentYear - 1;
    }
    
    return [
      `${startYear}-${startYear + 1}`,
      `${startYear - 1}-${startYear}`,
      `${startYear - 2}-${startYear - 1}`
    ];
  };

  const getCurrentFinancialYear = () => {
    const currentMonth = currentTime.getMonth();
    const currentYear = currentTime.getFullYear();
    
    let startYear;
    if (currentMonth >= 3) {
      startYear = currentYear;
    } else {
      startYear = currentYear - 1;
    }
    
    return `${startYear}-${String(startYear + 1).slice(-2)}`;
  };

  const calculateTotalA = () => {
    const { closingBalance, gpfSubscription, gpfRefund, recoveryFromArrears } = gpfAccumulation;
    return closingBalance + gpfSubscription - gpfRefund - recoveryFromArrears;
  };

  const calculateTotalB = () => {
    return gpfWithdrawals.approved;
  };

  const calculateTotalAMinusB = () => {
    return calculateTotalA() - calculateTotalB();
  };

  const handleAccumulationChange = (field, value) => {
    setGpfAccumulation(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleWithdrawalsChange = (field, value) => {
    setGpfWithdrawals(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const fetchGPFDetails = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/gpf/search?query=${userId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('GPF Details Data:', data); // Debug log
        if (data && data.length > 0) {
          const gpfData = data[0];
          setGpfDetails(gpfData); // Take the first matching record
          console.log('Phone Number:', gpfData.phoneNumber, 'Basic Pay:', gpfData.basicPay); // Debug log
          
          // Auto-fill phone number and basic pay from GPF data
          setFormData(prev => ({
            ...prev,
            phoneNo: gpfData.phoneNumber || '',
            presentBasicPay: gpfData.basicPay || ''
          }));
        }
      } else {
        console.error('Failed to fetch GPF details:', response.status);
      }
    } catch (error) {
      console.error('Error fetching GPF details:', error);
    }
  };

  const fetchGPFYearsData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/gpf-years/search?query=${userId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('GPF Years Data:', data); // Debug log
        if (data && data.length > 0) {
          // Get the most recent year's closing balance (last record)
          const latestYear = data[data.length - 1];
          console.log('Latest Year Closing Balance:', latestYear.closingBalance); // Debug log
          
          // Auto-fill closing balance in the GPF Accumulation section
          setGpfAccumulation(prev => ({
            ...prev,
            closingBalance: parseFloat(latestYear.closingBalance) || 0
          }));
        }
      } else {
        console.error('Failed to fetch GPF Years data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching GPF Years data:', error);
    }
  };

  const fetchPurposes = async (loanType) => {
    try {
      let endpoint = '';
      if (loanType === 'TEMPORARY') {
        // Fetch from GPF_PURPOSE_E table (Temporary advances)
        endpoint = 'http://localhost:8081/api/gpf-purpose-e/all';
      } else if (loanType === 'FINAL') {
        // Fetch from GPF_PURPOSE_F table (Final withdrawals)
        endpoint = 'http://localhost:8081/api/gpf-purpose/all';
      }

      if (endpoint) {
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          setPurposeOptions(data);
        } else {
          setPurposeOptions([]);
        }
      }
    } catch (error) {
      console.error('Error fetching purposes:', error);
      setPurposeOptions([]);
    }
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!userSession) {
      alert('User session not found');
      return;
    }

    // Validate required fields
    if (!formData.gpfLoanType || !formData.purposeRequired || !formData.amountApplied) {
      alert('Please fill in all required fields: GPF Loan Type, Purpose, and Amount Applied');
      return;
    }

    // Map purpose string to a numeric code (use index or purpose id if available)
    const selectedPurpose = purposeOptions.find(p => p.purpose === formData.purposeRequired);
    const purposeCode = selectedPurpose ? selectedPurpose.code : null;

    if (!purposeCode) {
      alert('Could not resolve purpose code. Please re-select the purpose.');
      return;
    }

    const payload = {
      // Required fields mapped to entity field names
      applAmt: parseFloat(formData.amountApplied),
      applDate: new Date().toISOString().split('T')[0],
      persno: parseFloat(gpfDetails?.persNumber || userSession.userId),
      purpose: parseFloat(purposeCode),
      // Optional fields
      gpfType: formData.gpfLoanType === 'TEMPORARY' ? 'E' : formData.gpfLoanType === 'FINAL' ? 'F' : null,
      enclosers: formData.enclosures ? 'Y' : 'N',
      houseAddr: formData.purposeDrawn || null
    };

    try {
      const response = await fetch('http://localhost:8081/api/gpf-usr-details/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Data saved successfully:', result);
        alert('User GPF Application saved successfully!');
        // Optionally clear form after successful save
        // handleClear();
      } else {
        const errorData = await response.json();
        console.error('Failed to save data:', errorData);
        alert('Failed to save data: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data: ' + error.message);
    }
  };

  const handleClear = () => {
    setFormData({
      phoneNo: '',
      presentBasicPay: '',
      previousAdvanceAmount: '',
      monthDrawn: '',
      purposeDrawn: '',
      outstandingAmount: '',
      gpfLoanType: '',
      purposeRequired: '',
      amountApplied: '',
      enclosures: '',
      finalWithdrawalDrawn: '',
      previousFinalAmount: '',
      previousFinalMonth: ''
    });
  };

  const handleBackToDashboard = () => {
    try { window.__ANIMATE_NAV = true; } catch (e) {}
    navigate('/dashboard');
  };

  return (
    <div className="user-application-gpf-page">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={handleBackToDashboard}>
            <span>←</span> Back
          </button>
          <span className="nav-brand">User Application GPF</span>
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

      <main className="user-application-main">
        <div className="user-application-header">
          <h1 className="user-application-title">User Application GPF</h1>
          <p className="user-application-subtitle">Manage user GPF applications and requests</p>
        </div>

        <div className="user-application-content">
          <div className="application-form-container">
            <h2 className="form-main-title">
              GRANT OF TEMPORARY / FINAL WITHDRAWAL FROM GPF A/C NO.
            </h2>
            
            <div className="date-row">
              <div className="date-field">
                <label className="date-label">DATE OF JOINING</label>
                <input 
                  type="text" 
                  className="date-input"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                />
              </div>

              <div className="user-details-center">
                <p className="user-info-text">
                  {userSession?.username || 'N/A'} | {gpfDetails?.designation || userSession?.workStatus || 'N/A'} | DOB: {formatDateDisplay(userSession?.dob || gpfDetails?.dob)} | ID: {gpfDetails?.persNumber || userSession?.userId || 'N/A'}
                </p>
              </div>
              
              <div className="date-field date-field-inline">
                <label className="date-label">CURRENT DATE:</label>
                <span className="date-display-inline">
                  {formatDate(currentTime)}
                </span>
              </div>
            </div>

            <div className="info-boxes-row">
              <div className="info-box info-box-left">
                <h3 className="info-box-title">
                  GPF ACCUMULATED UP TO {getCurrentMonthYear()}
                </h3>
                <div className="gpf-accumulation-details">
                  <div className="accumulation-item-inline">
                    <label className="accumulation-label-inline">
                      1) Closing Balance as per GPF-DS Statements {getCurrentFinancialYear()}:
                    </label>
                    <input
                      type="number"
                      className="accumulation-input-inline"
                      value={gpfAccumulation.closingBalance}
                      onChange={(e) => handleAccumulationChange('closingBalance', e.target.value)}
                      placeholder="Auto-filled from GPF Years"
                      readOnly
                      style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                    />
                  </div>

                  <div className="accumulation-item-inline">
                    <label className="accumulation-label-inline">
                      2) GPF Subscription from {getFinancialYearRange()}:
                    </label>
                    <input
                      type="number"
                      className="accumulation-input-inline"
                      value={gpfAccumulation.gpfSubscription}
                      onChange={(e) => handleAccumulationChange('gpfSubscription', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="accumulation-item-inline">
                    <label className="accumulation-label-inline">
                      3) GPF Refund from Current FY to Current Month:
                    </label>
                    <input
                      type="number"
                      className="accumulation-input-inline"
                      value={gpfAccumulation.gpfRefund}
                      onChange={(e) => handleAccumulationChange('gpfRefund', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="accumulation-item-inline">
                    <label className="accumulation-label-inline">
                      4) Recovery from Pay Fixation Arrears:
                    </label>
                    <input
                      type="number"
                      className="accumulation-input-inline"
                      value={gpfAccumulation.recoveryFromArrears}
                      onChange={(e) => handleAccumulationChange('recoveryFromArrears', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="accumulation-total-inline">
                    <label className="total-label-inline">TOTAL (A):</label>
                    <span className="total-value-inline">₹ {calculateTotalA().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="info-box info-box-right">
                <h3 className="info-box-title">
                  GPF WITHDRAWALS B/W {getFinancialYearRange()}
                </h3>
                <div className="gpf-withdrawals-details">
                  <div className="accumulation-item-inline">
                    <label className="accumulation-label-inline">
                      Approved:
                    </label>
                    <input
                      type="number"
                      className="accumulation-input-inline"
                      value={gpfWithdrawals.approved}
                      onChange={(e) => handleWithdrawalsChange('approved', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="accumulation-total-inline">
                    <label className="total-label-inline">TOTAL (B):</label>
                    <span className="total-value-inline">₹ {calculateTotalB().toFixed(2)}</span>
                  </div>

                  <div className="accumulation-total-inline total-final">
                    <label className="total-label-inline">TOTAL (A - B):</label>
                    <span className="total-value-inline">₹ {calculateTotalAMinusB().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="application-form">
              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">1) PHONE NO.</label>
                  <input
                    type="tel"
                    name="phoneNo"
                    className="field-input"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                    placeholder="Auto-filled from profile"
                    readOnly
                    style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">2) PRESENT BASIC PAY</label>
                  <input
                    type="number"
                    name="presentBasicPay"
                    className="field-input"
                    value={formData.presentBasicPay}
                    onChange={handleInputChange}
                    placeholder="Auto-filled from profile"
                    readOnly
                    style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">3) AMOUNT OF PREVIOUS ADVANCE IF ANY DRAWN</label>
                  <input
                    type="number"
                    name="previousAdvanceAmount"
                    className="field-input"
                    value={formData.previousAdvanceAmount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">4) MONTH IN WHICH DRAWN</label>
                  <input
                    type="text"
                    name="monthDrawn"
                    className="field-input"
                    value={formData.monthDrawn}
                    onChange={handleInputChange}
                    placeholder="MM/YYYY"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">5) PURPOSE FOR WHICH IT WAS DRAWN</label>
                  <input
                    type="text"
                    name="purposeDrawn"
                    className="field-input"
                    value={formData.purposeDrawn}
                    onChange={handleInputChange}
                    placeholder="Enter purpose"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">6) AMOUNT OF OUTSTANDING FROM PREVIOUS ADVANCE</label>
                  <input
                    type="number"
                    name="outstandingAmount"
                    className="field-input"
                    value={formData.outstandingAmount}
                    onChange={handleInputChange}
                    placeholder="Enter outstanding amount"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">7) GPF LOAN TYPE</label>
                  <select
                    name="gpfLoanType"
                    className="field-select"
                    value={formData.gpfLoanType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Type</option>
                    <option value="TEMPORARY">TEMPORARY</option>
                    <option value="FINAL">FINAL</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="field-label">8) PURPOSE FOR WHICH THE ADVANCE IS REQUIRED</label>
                  <select
                    name="purposeRequired"
                    className="field-select"
                    value={formData.purposeRequired}
                    onChange={handleInputChange}
                    disabled={!formData.gpfLoanType}
                  >
                    <option value="">
                      {formData.gpfLoanType ? 'Select Purpose' : 'Please select GPF Loan Type first'}
                    </option>
                    {purposeOptions.map((purpose) => (
                      <option key={purpose.code} value={purpose.purpose}>
                        {purpose.purpose}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="field-label">9) AMOUNT APPLIED FOR</label>
                  <input
                    type="number"
                    name="amountApplied"
                    className="field-input"
                    value={formData.amountApplied}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">10) ENCLOSURES</label>
                  <select
                    name="enclosures"
                    className="field-select"
                    value={formData.enclosures}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Financial Year</option>
                    {getFinancialYears().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="field-label">11) STATE WHETHER ANY FINAL WITHDRAWAL DRAWN</label>
                  <select
                    name="finalWithdrawalDrawn"
                    className="field-select"
                    value={formData.finalWithdrawalDrawn}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="field-label">12) AMOUNT OF PREVIOUS FINAL WITHDRAWAL</label>
                  <input
                    type="number"
                    name="previousFinalAmount"
                    className="field-input"
                    value={formData.previousFinalAmount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">13) MONTH OF PREVIOUS FINAL WITHDRAWAL</label>
                  <input
                    type="text"
                    name="previousFinalMonth"
                    className="field-input"
                    value={formData.previousFinalMonth}
                    onChange={handleInputChange}
                    placeholder="MM/YYYY"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-save" onClick={handleSave}>
                  💾 Save
                </button>
                <button className="btn btn-clear" onClick={handleClear}>
                  🗑️ Clear
                </button>
              </div>
            </div>

            <div className="records-section">
              <h2 className="records-title">NOT YET APPROVED RECORDS</h2>
              
              <div className="records-table-container">
                <table className="records-table">
                  <thead>
                    <tr>
                      <th>S.NO.</th>
                      <th>PRINT</th>
                      <th>EDIT</th>
                      <th>PURPOSE</th>
                      <th>APPLIED AMOUNT</th>
                      <th>APPLIED DATE</th>
                      <th>LOAN TYPE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="empty-row">
                      <td colSpan="7" className="empty-message">
                        No records to display. Records will appear here once added.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="records-section approved-section">
              <h2 className="records-title approved-title">APPROVED RECORDS</h2>
              
              <div className="records-table-container">
                <table className="records-table approved-table">
                  <thead>
                    <tr>
                      <th>S.NO.</th>
                      <th>PURPOSE</th>
                      <th>APPLIED AMOUNT</th>
                      <th>SANCTION AMOUNT</th>
                      <th>SANCTION DATE</th>
                      <th>GPF TYPE</th>
                      <th>NO. OF INSTALMENTS</th>
                      <th>INSTALMENT AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="empty-row">
                      <td colSpan="8" className="empty-message">
                        No approved records to display. Records will appear here once approved.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
