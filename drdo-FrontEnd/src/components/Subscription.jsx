import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Subscription.css';
import ThemeSelector from './ThemeSelector';

export default function Subscription() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [message, setMessage] = useState('');

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch (e) { return null; }
  })();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch subscriptions on mount
  useEffect(() => {
    fetchSubscriptions();
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

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/gpf/subscriptions', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   }
      // });

      // Mock data for demonstration
      const mockData = [
        {
          id: 1,
          name: 'Monthly Contribution',
          amount: 5000,
          frequency: 'monthly',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'active',
          nextPayment: '2026-04-01'
        },
        {
          id: 2,
          name: 'Quarterly Advance',
          amount: 10000,
          frequency: 'quarterly',
          startDate: '2024-01-15',
          endDate: '2025-12-31',
          status: 'active',
          nextPayment: '2026-04-15'
        },
        {
          id: 3,
          name: 'Annual Deposit',
          amount: 50000,
          frequency: 'yearly',
          startDate: '2024-03-01',
          endDate: '2026-03-01',
          status: 'inactive',
          nextPayment: null
        }
      ];

      setSubscriptions(mockData);
    } catch (error) {
      setMessage('Error fetching subscriptions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscription = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/gpf/subscriptions/${id}`, {
        //   method: 'DELETE',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        //   }
        // });

        setSubscriptions(subscriptions.filter(sub => sub.id !== id));
        setMessage('Subscription deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting subscription: ' + error.message);
      }
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="subscription-page">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={handleBackToGPF}>
            <span>←</span> Back to GPF
          </button>
          <span className="nav-brand">Subscriptions</span>
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

      <main className="subscription-main">
        <div className="subscription-header">
          <h1 className="subscription-title">Active Subscriptions</h1>
          <p className="subscription-subtitle">View and manage your GPF subscriptions</p>
        </div>

        <div className="subscription-container">
          {message && (
            <div className={`form-message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <div className="subscription-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-box">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button
              className="btn btn-primary"
              onClick={fetchSubscriptions}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {filteredSubscriptions.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <h3 className="empty-title">No Subscriptions Found</h3>
              <p className="empty-text">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'You don\'t have any subscriptions yet'}
              </p>
            </div>
          ) : (
            <div className="subscriptions-grid">
              {filteredSubscriptions.map(subscription => (
                <div key={subscription.id} className="subscription-card">
                  <div className="card-header">
                    <h3 className="card-title">{subscription.name}</h3>
                    <span className={`status-badge ${subscription.status}`}>
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="info-row">
                      <span className="info-label">Amount:</span>
                      <span className="info-value">₹{subscription.amount.toLocaleString()}</span>
                    </div>

                    <div className="info-row">
                      <span className="info-label">Frequency:</span>
                      <span className="info-value">
                        {subscription.frequency.charAt(0).toUpperCase() + subscription.frequency.slice(1)}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="info-label">Start Date:</span>
                      <span className="info-value">
                        {new Date(subscription.startDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="info-label">End Date:</span>
                      <span className="info-value">
                        {new Date(subscription.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    {subscription.nextPayment && (
                      <div className="info-row">
                        <span className="info-label">Next Payment:</span>
                        <span className="info-value">
                          {new Date(subscription.nextPayment).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => alert('Edit feature coming soon!')}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteSubscription(subscription.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
