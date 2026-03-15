import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './AddDVNumber.css';
import ThemeSelector from './ThemeSelector';

export default function AddDVNumber() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [formData, setFormData] = useState({
    dvNumber: '',
    description: '',
    amount: '',
    date: '',
    remarks: ''
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
      if (!formData.dvNumber.trim()) {
        setMessage('DV Number is required');
        setLoading(false);
        return;
      }

      // TODO: Replace with actual API call
      // const response = await fetch('/api/gpf/add-dv-number', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   },
      //   body: JSON.stringify(formData)
      // });

      // Simulated success
      setMessage('DV Number added successfully!');
      setFormData({
        dvNumber: '',
        description: '',
        amount: '',
        date: '',
        remarks: ''
      });
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      setMessage('Error adding DV Number: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      dvNumber: '',
      description: '',
      amount: '',
      date: '',
      remarks: ''
    });
    setMessage('');
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
        <div className="add-dv-header">
          <h1 className="add-dv-title">Add DV Number</h1>
          <p className="add-dv-subtitle">Register and manage new DV numbers for GPF transactions</p>
        </div>

        <div className="add-dv-container">
          <form className="add-dv-form" onSubmit={handleSubmit}>
            {message && (
              <div className={`form-message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="dvNumber" className="form-label">
                DV Number <span className="required">*</span>
              </label>
              <input
                type="text"
                id="dvNumber"
                name="dvNumber"
                value={formData.dvNumber}
                onChange={handleInputChange}
                placeholder="Enter DV Number"
                className="form-input"
                required
              />
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount" className="form-label">
                  Amount
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
                />
              </div>

              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="remarks" className="form-label">
                Remarks
              </label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Enter any remarks (optional)"
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
                {loading ? 'Adding...' : 'Add DV Number'}
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
