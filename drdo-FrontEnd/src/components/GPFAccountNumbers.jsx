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
  const [sortBy, setSortBy] = useState('name');
  const [message, setMessage] = useState('');

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch (e) { return null; }
  })();

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
          employeeName: 'Rajesh Kumar',
          designation: 'Senior Engineer',
          department: 'Engineering',
          balance: 450000,
          openingDate: '2020-01-15',
          status: 'active'
        },
        {
          id: 2,
          accountNumber: 'GPF-2024-002',
          employeeName: 'Priya Singh',
          designation: 'Project Manager',
          department: 'Management',
          balance: 650000,
          openingDate: '2019-06-20',
          status: 'active'
        },
        {
          id: 3,
          accountNumber: 'GPF-2024-003',
          employeeName: 'Amit Patel',
          designation: 'Developer',
          department: 'Engineering',
          balance: 320000,
          openingDate: '2021-03-10',
          status: 'active'
        },
        {
          id: 4,
          accountNumber: 'GPF-2024-004',
          employeeName: 'Neha Sharma',
          designation: 'Analyst',
          department: 'Analytics',
          balance: 280000,
          openingDate: '2022-01-05',
          status: 'active'
        },
        {
          id: 5,
          accountNumber: 'GPF-2024-005',
          employeeName: 'Vikram Desai',
          designation: 'Consultant',
          department: 'Consulting',
          balance: 520000,
          openingDate: '2018-11-12',
          status: 'active'
        },
        {
          id: 6,
          accountNumber: 'GPF-2024-006',
          employeeName: 'Anjali Verma',
          designation: 'HR Manager',
          department: 'Human Resources',
          balance: 380000,
          openingDate: '2020-07-22',
          status: 'active'
        }
      ];

      setAccounts(mockData);
    } catch (error) {
      setMessage('Error fetching accounts: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (accountNumber) => {
    alert(`View details for account: ${accountNumber}`);
  };

  const sortedAccounts = [...accounts].sort((a, b) => {
    switch(sortBy) {
      case 'name':
        return a.employeeName.localeCompare(b.employeeName);
      case 'balance':
        return b.balance - a.balance;
      case 'date':
        return new Date(b.openingDate) - new Date(a.openingDate);
      default:
        return 0;
    }
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

            <div className="sort-box">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Sort by Name</option>
                <option value="balance">Sort by Balance (High to Low)</option>
                <option value="date">Sort by Opening Date (Newest)</option>
              </select>
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
                    <th>Account Number</th>
                    <th>Employee Name</th>
                    <th>Designation</th>
                    <th>Department</th>
                    <th>Balance</th>
                    <th>Opening Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map(account => (
                    <tr key={account.id}>
                      <td className="account-number">{account.accountNumber}</td>
                      <td className="employee-name">{account.employeeName}</td>
                      <td className="designation">{account.designation}</td>
                      <td className="department">{account.department}</td>
                      <td className="balance">₹{account.balance.toLocaleString()}</td>
                      <td className="opening-date">
                        {new Date(account.openingDate).toLocaleDateString()}
                      </td>
                      <td className="status">
                        <span className={`status-badge ${account.status}`}>
                          {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                        </span>
                      </td>
                      <td className="action">
                        <button
                          className="btn-view"
                          onClick={() => handleViewDetails(account.accountNumber)}
                        >
                          View
                        </button>
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
