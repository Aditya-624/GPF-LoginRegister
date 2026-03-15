import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './AddSubscription.css';
import ThemeSelector from './ThemeSelector';

export default function AddSubscription() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [formData, setFormData] = useState({
    subscriptionName: '',
    amount: '',
    frequency: 'monthly',
    startDate: '',
    endDate: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Validate form
      if (!formData.subscriptionName.trim()) {
        setMessage('Subscription name is required');
        setLoading(false);
        return;
      }

      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        setMessage('Please enter a valid amount');
        setLoading(false);
        return;
      }

      // TODO: Replace with actual API call
      // const response = await fetch('/api/gpf/add-subscription', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   },
      //   body: JSON.stringify(formData)
      // });

      // Simulated success
      setMessage('Subscription added successfully!');
      setFormData({
        subscriptionName: '',
        amount: '',
        frequency: 'monthly',
        startDate: '',
        endDate: '',
        description: ''
      });
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      setMessage('Error adding subscription: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      subscriptionName: '',
      amount: '',
      frequency: 'monthly',
      startDate: '',
      endDate: '',
      description: ''
    });
    setMessage('');
  };

  return (
    <div className="add-subscription-page">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={handleBackToGPF}>
            <span>←</span> Back to GPF
          </button>
          <span className="nav-brand">Add Subscription</span>
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

      <main className="add-subscription-main">
        <div className="add-subscription-header">
          <h1 className="add-subscription-title">Add Subscription</h1>
          <p className="add-subscription-subtitle">Create new subscription entries for GPF contributions</p>
        </div>

        <div className="add-subscription-container">
          <form className="add-subscription-form" onSubmit={handleSubmit}>
            {message && (
              <div className={`form-message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="subscriptionName" className="form-label">
                Subscription Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="subscriptionName"
                name="subscriptionName"
                value={formData.subscriptionName}
                onChange={handleInputChange}
                placeholder="Enter subscription name"
                className="form-input"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount" className="form-label">
                  Amount <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  className="form-input"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="frequency" className="form-label">
                  Frequency <span className="required">*</span>
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="half-yearly">Half Yearly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description (optional)"
                className="form-textarea"
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Subscription'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
