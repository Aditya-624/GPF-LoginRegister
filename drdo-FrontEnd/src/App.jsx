import { useState } from 'react';
import Registration from './components/Registration';
import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('registration'); // registration, login, changePassword, forgotPassword, loggedIn
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleRegistrationSuccess = () => {
    setCurrentScreen('login');
  };

  const handleLoginSuccess = (userId, username) => {
    setLoggedInUser({ userId, username });
    setCurrentScreen('loggedIn');
  };

  const handleChangePasswordClick = () => {
    setCurrentScreen('changePassword');
  };

  const handleForgotPasswordClick = () => {
    setCurrentScreen('forgotPassword');
  };

  const handleForgotPasswordSuccess = () => {
    setCurrentScreen('login');
  };

  const handleChangePasswordSuccess = () => {
    setCurrentScreen('login');
    setLoggedInUser(null);
    alert('Password changed successfully! Please login with your new password.');
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentScreen('login');
  };

  return (
    <div className="app">
      {currentScreen === 'registration' && (
        <Registration onRegistrationSuccess={handleRegistrationSuccess} />
      )}

      {currentScreen === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onChangePasswordClick={handleChangePasswordClick}
          onForgotPasswordClick={handleForgotPasswordClick}
        />
      )}

      {currentScreen === 'changePassword' && (
        <ChangePassword
          onSuccess={handleChangePasswordSuccess}
          onCancel={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'forgotPassword' && (
        <ForgotPassword
          onSuccess={handleForgotPasswordSuccess}
          onCancel={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'loggedIn' && (
        <div className="dashboard">
          <div className="dashboard-header">
            <h1>Welcome, {loggedInUser?.username}!</h1>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <div className="dashboard-content">
            <p>You have successfully logged in to the system.</p>
            <button
              className="btn btn-primary"
              onClick={handleChangePasswordClick}
            >
              Change Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
