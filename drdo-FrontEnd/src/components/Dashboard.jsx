import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import ThemeToggle from './ThemeToggle';

export default function Dashboard({ onSignOut }) {
  const navigate = useNavigate();

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch (e) { return null; }
  })();

  return (
    <div className="dashboard-page">
      <nav className="top-nav">
        <div className="nav-left">DRDO Dashboard</div>
        <div className="nav-right">
          <div className="theme-toggle-wrapper"><ThemeToggle /></div>
          <button className="btn btn-nav" onClick={() => alert('Profile - placeholder')}>👤 {currentUser?.username || 'Profile'}</button>
          <button className="btn btn-nav btn-signout" onClick={() => { try { window.__ANIMATE_NAV = true } catch (e) {}; onSignOut(); }}>Sign Out</button>
        </div>
      </nav>

      <main className="dashboard-main">
        <h2>Welcome{currentUser?.username ? `, ${currentUser.username}` : ''}!</h2>
        <p>This is your dashboard. Use the navigation to access account features.</p>
      </main>
    </div>
  );
}