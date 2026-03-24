import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './GPFAccountNumbers.css';
import ThemeSelector from './ThemeSelector';

export default function GPFAccountNumbers() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch accounts on mount
  useEffect(() => {
    fetchAccounts();
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

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/gpf/accounts', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   }
      // });

      // Mock data for demonstration
      const mockData = [
        {
          id: 1,
          accountNumber: 'GPF-2024-001',
          persNumber: 'PERS-001',
          employeeName: 'Rajesh Kumar',
          designation: 'Senior Engineer',
          department: 'Engineering',
          balance: 450000,
          openingDate: '2020-01-15',
          dob: '1985-03-22'
        },
        {
          id: 2,
          accountNumber: 'GPF-2024-002',
          persNumber: 'PERS-002',
          employeeName: 'Priya Singh',
          designation: 'Project Manager',
          department: 'Management',
          balance: 650000,
          openingDate: '2019-06-20',
          dob: '1980-11-05'
        },
        {
          id: 3,
          accountNumber: 'GPF-2024-003',
          persNumber: 'PERS-003',
          employeeName: 'Amit Patel',
          designation: 'Developer',
          department: 'Engineering',
          balance: 320000,
          openingDate: '2021-03-10',
          dob: '1990-07-14'
        },
        {
          id: 4,
          accountNumber: 'GPF-2024-004',
          persNumber: 'PERS-004',
          employeeName: 'Neha Sharma',
          designation: 'Analyst',
          department: 'Analytics',
          balance: 280000,
          openingDate: '2022-01-05',
          dob: '1992-04-30'
        },
        {
          id: 5,
          accountNumber: 'GPF-2024-005',
          persNumber: 'PERS-005',
          employeeName: 'Vikram Desai',
          designation: 'Consultant',
          department: 'Consulting',
          balance: 520000,
          openingDate: '2018-11-12',
          dob: '1978-09-18'
        },
        {
          id: 6,
          accountNumber: 'GPF-2024-006',
          persNumber: 'PERS-006',
          employeeName: 'Anjali Verma',
          designation: 'HR Manager',
          department: 'Human Resources',
          balance: 380000,
          openingDate: '2020-07-22',
          dob: '1983-12-01'
        }
      ];

      setAccounts(mockData);
    } catch (error) {
      setMessage('Error fetching accounts: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sortedAccounts = [...accounts].sort((a, b) => {
    // Default sort: GPF account number ascending (small to large)
    return a.accountNumber.localeCompare(b.accountNumber, undefined, { numeric: true });
  });

  const filteredAccounts = sortedAccounts.filter(account => {
    const searchLower = searchTerm.toLowerCase();
    return (
      account.accountNumber.toLowerCase().includes(searchLower) ||
      account.employeeName.toLowerCase().includes(searchLower) ||
      account.designation.toLowerCase().includes(searchLower) ||
      account.department.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="gpf-account-numbers-page">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={handleBackToGPF}>
            <span>←</span> Back to GPF
          </button>
          <span className="nav-brand">GPF Account Numbers</span>
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

      <main className="gpf-account-numbers-main">
        <div className="gpf-account-numbers-header">
          <h1 className="gpf-account-numbers-title">GPF Account Numbers</h1>
          <p className="gpf-account-numbers-subtitle">Browse all registered GPF accounts</p>
        </div>

        <div className="gpf-account-numbers-container">
          {message && (
            <div className={`form-message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <div className="account-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by account number, name, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <button
              className="btn btn-primary"
              onClick={fetchAccounts}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          <div className="accounts-info">
            <span className="info-text">Total Accounts: <strong>{filteredAccounts.length}</strong></span>
            <span className="info-text">Total Balance: <strong>₹{filteredAccounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}</strong></span>
          </div>

          {filteredAccounts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📑</span>
              <h3 className="empty-title">No Accounts Found</h3>
              <p className="empty-text">
                {searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'No GPF accounts available'}
              </p>
            </div>
          ) : (
            <div className="accounts-table-wrapper">
              <table className="accounts-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Account Number</th>
                    <th>Pers No.</th>
                    <th>Employee Name</th>
                    <th>Designation</th>
                    <th>Balance</th>
                    <th>DOB</th>
                    <th>Opening Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account, index) => (
                    <tr key={account.id}>
                      <td className="sno">{index + 1}</td>
                      <td className="account-number">{account.accountNumber}</td>
                      <td className="pers-number">{account.persNumber}</td>
                      <td className="employee-name">{account.employeeName}</td>
                      <td className="designation">{account.designation}</td>
                      <td className="balance">₹{account.balance.toLocaleString()}</td>
                      <td className="dob">
                        {account.dob ? new Date(account.dob).toLocaleDateString() : '-'}
                      </td>
                      <td className="opening-date">
                        {new Date(account.openingDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
