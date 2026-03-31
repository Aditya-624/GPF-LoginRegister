import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './AddDVNumber.css';
import ThemeSelector from './ThemeSelector';

export default function AddDVNumber() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    dvNumber: '',
    dvDate: '',
    dvAmount: ''
  });
  const [tableData, setTableData] = useState([]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch data from GPF Sanction Details table
  useEffect(() => {
    const fetchSanctionDetails = async () => {
      try {
        const response = await fetch('/api/gpf-sanction-details');
        if (response.ok) {
          const data = await response.json();
          // Transform API data to table format
          const transformedData = data.map((item, index) => ({
            id: item.id,
            sno: index + 1,
            selected: false,
            persNo: item.persNo || '',
            name: item.persNo || '', // Use persNo as name for now
            type: item.gpfLoanType || '',
            appDate: item.applicationDate || '',
            billNo: item.billNo || '',
            billDate: item.billDate || '',
            noOfIntl: item.noOfInstallments || 0,
            instlAmt: item.instlAmount ? item.instlAmount.toString() : '0',
            billAmount: item.appliedAmount ? item.appliedAmount.toString() : '0',
            cdaAmount: item.appliedAmount ? item.appliedAmount.toString() : '0',
            remarks: item.remarks || '',
            // E = Temporary Advance (Staff), F = Final Withdrawal (Officer)
            role: item.gpfLoanType === 'F' ? 'OFFICER' : 'STAFF',
            dbId: item.id // Store original DB ID for updates
          }));
          setTableData(transformedData);
        }
      } catch (error) {
        console.error('Error fetching sanction details:', error);
        alert('Could not load sanction details. Make sure the backend is running.');
      }
    };
    fetchSanctionDetails();
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

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Reset all selections and edits when role changes
    setTableData(tableData.map(row => ({
      ...row,
      selected: false,
      cdaAmount: row.billAmount,
      remarks: ''
    })));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get selected rows
    const selectedRows = tableData.filter(row => row.selected && row.role === selectedRole);
    
    if (selectedRows.length === 0) {
      alert('Please select at least one row');
      return;
    }

    if (!formData.dvNumber || !formData.dvDate) {
      alert('Please fill in DV Number and DV Date');
      return;
    }

    try {
      // Update each selected row with DV details
      const updatePromises = selectedRows.map(row =>
        fetch(`/api/gpf-sanction-details/${row.dbId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
          },
          body: JSON.stringify({
            id: row.dbId,
            persNo: row.persNo,
            gpfLoanType: row.type,
            applicationDate: row.appDate,
            billNo: row.billNo,
            billDate: row.billDate,
            noOfInstallments: parseInt(row.noOfIntl) || 0,
            instlAmount: parseFloat(row.instlAmt) || 0,
            appliedAmount: parseFloat(row.billAmount) || 0,
            dvNo: formData.dvNumber,
            dvDate: formData.dvDate,
            totDvAmt: parseFloat(row.cdaAmount) || 0,
            remarks: row.remarks,
            updatedAt: new Date().toISOString()
          })
        })
      );

      const responses = await Promise.all(updatePromises);
      const failedUpdates = responses.filter(res => !res.ok);

      if (failedUpdates.length === 0) {
        alert(`Successfully updated ${selectedRows.length} record(s) with DV details!`);
        // Reset form
        setFormData({ dvNumber: '', dvDate: '', dvAmount: '' });
        // Refresh data from database
        const response = await fetch('/api/gpf-sanction-details');
        if (response.ok) {
          const data = await response.json();
          const transformedData = data.map((item, index) => ({
            id: item.id,
            sno: index + 1,
            selected: false,
            persNo: item.persNo || '',
            name: item.persNo || '',
            type: item.gpfLoanType || '',
            appDate: item.applicationDate || '',
            billNo: item.billNo || '',
            billDate: item.billDate || '',
            noOfIntl: item.noOfInstallments || 0,
            instlAmt: item.instlAmount ? item.instlAmount.toString() : '0',
            billAmount: item.appliedAmount ? item.appliedAmount.toString() : '0',
            cdaAmount: item.appliedAmount ? item.appliedAmount.toString() : '0',
            remarks: item.remarks || '',
            role: item.gpfLoanType === 'F' ? 'OFFICER' : 'STAFF',
            dbId: item.id
          }));
          setTableData(transformedData);
        }
      } else {
        alert(`Error updating ${failedUpdates.length} record(s). Please try again.`);
      }
    } catch (error) {
      console.error('Error submitting DV details:', error);
      alert('Error submitting DV details: ' + error.message);
    }
  };

  const handleSelectAll = () => {
    setTableData(tableData.map(row => ({ ...row, selected: true })));
  };

  const handleUnselectAll = () => {
    setTableData(tableData.map(row => ({ ...row, selected: false })));
  };

  const handleRowSelect = (id) => {
    setTableData(tableData.map(row =>
      row.id === id ? { ...row, selected: !row.selected } : row
    ));
  };

  const handleCellChange = (id, field, value) => {
    setTableData(tableData.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  return (
    <div className="add-dv-page">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={handleBackToGPF}>
            <span>←</span> Back to GPF
          </button>
          <span className="nav-brand">Add DV Number</span>
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

      <main className="add-dv-main">
        <div className="role-selector-compact-container">
          <div className="role-options-compact">
            <label className="role-option-compact">
              <input
                type="radio"
                name="role"
                value="OFFICER"
                checked={selectedRole === 'OFFICER'}
                onChange={(e) => handleRoleSelect(e.target.value)}
                className="role-checkbox"
              />
              <span className="role-label-compact">Officer</span>
            </label>

            <label className="role-option-compact">
              <input
                type="radio"
                name="role"
                value="STAFF"
                checked={selectedRole === 'STAFF'}
                onChange={(e) => handleRoleSelect(e.target.value)}
                className="role-checkbox"
              />
              <span className="role-label-compact">Staff</span>
            </label>
          </div>
        </div>

        <div className="add-dv-header">
          <h1 className="add-dv-title">Add DV Number</h1>
          <p className="add-dv-subtitle">Manage bill details and DV information</p>
        </div>

        {selectedRole && (
          <>
            <div className="dv-form-container">
              <form className="dv-form" onSubmit={handleSubmit}>
                <div className="dv-form-row">
                  <div className="dv-form-group">
                    <label htmlFor="dvNumber" className="dv-form-label">DV Number</label>
                    <input
                      type="text"
                      id="dvNumber"
                      name="dvNumber"
                      value={formData.dvNumber}
                      onChange={handleInputChange}
                      placeholder="Enter DV Number"
                      className="dv-form-input"
                    />
                  </div>

                  <div className="dv-form-group">
                    <label htmlFor="dvDate" className="dv-form-label">DV Date</label>
                    <input
                      type="date"
                      id="dvDate"
                      name="dvDate"
                      value={formData.dvDate}
                      onChange={handleInputChange}
                      onKeyDown={(e) => e.preventDefault()}
                      className="dv-form-input"
                    />
                  </div>

                  <div className="dv-form-group">
                    <label htmlFor="dvAmount" className="dv-form-label">DV Amount</label>
                    <input
                      type="number"
                      id="dvAmount"
                      name="dvAmount"
                      value={formData.dvAmount}
                      onChange={handleInputChange}
                      placeholder="Enter Amount"
                      className="dv-form-input"
                      step="0.01"
                    />
                  </div>

                  <div className="dv-form-group dv-submit-group">
                    <button type="submit" className="dv-submit-btn">Submit</button>
                  </div>
                </div>
              </form>
            </div>

            <div className="dv-buttons-row">
              <button type="button" className="dv-select-btn" onClick={handleSelectAll}>
                Select All
              </button>
              <button type="button" className="dv-unselect-btn" onClick={handleUnselectAll}>
                Unselect All
              </button>
            </div>
          </>
        )}

        {selectedRole && (
          <div className="dv-table-container">
            <h2 className="dv-table-title">Bill Details</h2>
            <div className="dv-table-wrapper">
              <table className="dv-table">
                <thead>
                  <tr>
                    <th>S.NO</th>
                    <th>Select</th>
                    <th>PERS NO.</th>
                    <th>NAME</th>
                    <th>TYPE</th>
                    <th>APPLICATION DATE</th>
                    <th>BILL NO.</th>
                    <th>BILL DATE</th>
                    <th>NO OF INTL</th>
                    <th>INSTL_AMT</th>
                    <th>BILL AMOUNT</th>
                    <th>CDA AMOUNT</th>
                    <th>REMARKS</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData
                    .filter(row => row.role === selectedRole)
                    .map((row) => (
                    <tr key={row.id} className={row.selected ? 'row-selected' : ''}>
                      <td>{row.sno}</td>
                      <td className="select-cell">
                        <input
                          type="checkbox"
                          checked={row.selected}
                          onChange={() => handleRowSelect(row.id)}
                          className="row-checkbox"
                        />
                        {row.selected && <span className="checkmark">✅</span>}
                      </td>
                      <td>{row.persNo}</td>
                      <td>{row.name}</td>
                      <td>{row.type}</td>
                      <td>{row.appDate}</td>
                      <td>{row.billNo}</td>
                      <td>{row.billDate}</td>
                      <td>{row.noOfIntl}</td>
                      <td>{row.instlAmt}</td>
                      <td>{row.billAmount}</td>
                      <td className="editable-cell">
                        <input
                          type="text"
                          value={row.cdaAmount}
                          onChange={(e) => handleCellChange(row.id, 'cdaAmount', e.target.value)}
                          placeholder="Enter amount"
                          className="cell-input"
                        />
                      </td>
                      <td className="editable-cell">
                        <input
                          type="text"
                          value={row.remarks}
                          onChange={(e) => handleCellChange(row.id, 'remarks', e.target.value)}
                          placeholder="Enter remarks"
                          className="cell-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
