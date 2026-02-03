import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeSelector from './ThemeSelector';
import './Profile.css';

export default function Profile({ onChangePassword, onBack }) {
  const navigate = useNavigate();
  
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch (e) { return null; }
  })();

  const handleChangePassword = () => {
    try { window.__ANIMATE_NAV = true; } catch (e) {}
    onChangePassword();
  };

  const handleBack = () => {
    try { window.__ANIMATE_NAV = true; } catch (e) {}
    onBack();
  };

  return (
    <div className="profile-page">
      <div className="profile-theme-selector">
        <ThemeSelector />
      </div>

      <main className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <h1 className="profile-title">User Profile</h1>
            <p className="profile-subtitle">Manage your account settings</p>
          </div>

          <div className="profile-info">
            <div className="info-section">
              <h3 className="section-title">Account Information</h3>
              
              <div className="info-item">
                <label className="info-label">Username</label>
                <div className="info-value">{currentUser?.username || 'Not available'}</div>
              </div>

              <div className="info-item">
                <label className="info-label">User ID</label>
                <div className="info-value">{currentUser?.userId || 'Not available'}</div>
              </div>

              <div className="info-item">
                <label className="info-label">Account Status</label>
                <div className="info-value">
                  <span className="status-badge active">Active</span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <h3 className="section-title">Account Actions</h3>
              
              <button 
                className="btn btn-primary profile-action-btn"
                onClick={handleChangePassword}
              >
                <span className="action-icon">🔐</span>
                <div className="action-content">
                  <span className="action-title">Change Password</span>
                  <span className="action-description">Update your account password</span>
                </div>
              </button>

              <button 
                className="btn btn-secondary profile-action-btn"
                onClick={() => alert('Edit Profile - Coming Soon!')}
              >
                <span className="action-icon">✏️</span>
                <div className="action-content">
                  <span className="action-title">Edit Profile</span>
                  <span className="action-description">Update your personal information</span>
                </div>
              </button>

              <button 
                className="btn btn-secondary profile-action-btn"
                onClick={() => alert('Security Settings - Coming Soon!')}
              >
                <span className="action-icon">🛡️</span>
                <div className="action-content">
                  <span className="action-title">Security Settings</span>
                  <span className="action-description">Manage security questions and preferences</span>
                </div>
              </button>
            </div>
          </div>

          <div className="profile-footer">
            <button 
              className="btn btn-back"
              onClick={handleBack}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}