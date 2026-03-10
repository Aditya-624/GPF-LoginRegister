import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { userService } from './services/userService';
import Registration from './components/Registration';
import Login from './components/Login';
import LoginPage from './components/LoginPage';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import GPF from './components/GPF';
import AddGPFSlips from './components/AddGPFSlips';
import GPFSlipDetails from './components/GPFSlipDetails';
import TemporaryAdvance from './components/TemporaryAdvance';
import FinalWithdrawal from './components/FinalWithdrawal';
import UserApplicationGPF from './components/UserApplicationGPF';
import FloatingParticles from './components/FloatingParticles';
import './App.css';

// Determine animation name by route pairs
const getTransitionName = (from = '/', to = '/') => {
  if (from === '/' && to === '/register') return 'slide-left';
  if (from === '/register' && to === '/') return 'slide-right';
  if (from === '/' && to === '/forgot-password') return 'slide-up';
  if (from === '/forgot-password' && to === '/') return 'slide-down';
  if (from === '/' && to === '/dashboard') return 'fade-scale';
  if (from === '/dashboard' && to === '/profile') return 'slide-left';
  if (from === '/profile' && to === '/dashboard') return 'slide-right';
  if (from === '/profile' && to === '/change-password') return 'slide-up';
  if (from === '/change-password' && to === '/dashboard') return 'slide-down';
  if (from === '/dashboard' && to === '/gpf') return 'slide-left';
  if (from === '/gpf' && to === '/dashboard') return 'slide-right';
  if (from === '/gpf' && to === '/profile') return 'slide-left';
  if (from === '/profile' && to === '/gpf') return 'slide-right';
  if (from === '/gpf' && to === '/gpf/add-slips') return 'slide-left';
  if (from === '/gpf/add-slips' && to === '/gpf') return 'slide-right';
  if (from === '/gpf' && to === '/gpf/slip-details') return 'slide-left';
  if (from === '/gpf/slip-details' && to === '/gpf') return 'slide-right';
  if (from === '/gpf' && to === '/temporary-advance') return 'slide-left';
  if (from === '/temporary-advance' && to === '/gpf') return 'slide-right';
  if (from === '/gpf' && to === '/final-withdrawal') return 'slide-left';
  if (from === '/final-withdrawal' && to === '/gpf') return 'slide-right';
  // sensible default for forward nav
  return 'slide-left';
};

function AppRoutes() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const prevLocationRef = useRef(location);
  const [transitionName, setTransitionName] = useState('fade-scale');

  // Refs for DOM nodes to apply classes directly (enter/exit active)
  const prevRef = useRef(null);
  const currRef = useRef(null);
  const timerRef = useRef(null);

  // Respect reduced motion preference
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timeout = reducedMotion ? 0 : 400; // between 300-500ms

  // Track previous location so we can render it during animation
  const [prevLocation, setPrevLocation] = useState(null);
  useEffect(() => {
    // on location change, store previous location and set transition name
    const from = prevLocationRef.current?.pathname || '/';
    const to = location.pathname;
    const name = getTransitionName(from, to);
    setTransitionName(name);

    // Only animate when the navigation was user-initiated (e.g., a click) and reduced motion is not requested
    const userInitiated = (typeof window !== 'undefined' && window.__ANIMATE_NAV === true);

    if (from !== to && !reducedMotion && userInitiated) {
      setPrevLocation(prevLocationRef.current);
      // clear flag immediately so subsequent programmatic navigations don't animate
      try { window.__ANIMATE_NAV = false; } catch (e) {}
      // start a timer to clear prev after animation
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setPrevLocation(null);
      }, timeout);
    } else {
      // no animation or same page; clear prev immediately
      setPrevLocation(null);
      // clear any stale flag
      try { window.__ANIMATE_NAV = false; } catch (e) {}
    }

    prevLocationRef.current = location;

    return () => clearTimeout(timerRef.current);
  }, [location, reducedMotion, timeout]);

  // On mount of new or prev elements, toggle active classes on next tick
  useEffect(() => {
    if (reducedMotion) return; // nothing to do

    // add enter active to current
    const curr = currRef.current;
    const prev = prevRef.current;

    if (curr) {
      curr.classList.add(`${transitionName}-enter`);
      // force reflow to allow transition
      void curr.offsetWidth;
      curr.classList.add(`${transitionName}-enter-active`);
      curr.classList.remove(`${transitionName}-enter`);
    }

    if (prev) {
      prev.classList.add(`${transitionName}-exit`);
      // force reflow
      void prev.offsetWidth;
      prev.classList.add(`${transitionName}-exit-active`);
      prev.classList.remove(`${transitionName}-exit`);
    }

    return () => {
      // cleanup classes (in case)
      if (curr) {
        curr.classList.remove(`${transitionName}-enter-active`);
      }
      if (prev) {
        prev.classList.remove(`${transitionName}-exit-active`);
      }
    };
  }, [transitionName, prevLocation, reducedMotion]);

  const handleLoginSuccess = (userId, username) => {
    setLoggedInUser({ userId, username });
    try { localStorage.setItem('currentUser', JSON.stringify({ userId, username })); } catch (err) { }
    navigate('/dashboard');
  };

  const handleLogout = () => {
    // Clear all user session data
    try { 
      userService.clearUserSession();
      userService.setAuthToken(null); 
    } catch (e) { /* ignore */ }
    setLoggedInUser(null);
    try { localStorage.removeItem('authToken'); localStorage.removeItem('currentUser'); } catch (err) {}
    navigate('/');
  };

  const handleChangePasswordSuccess = () => {
    navigate('/dashboard');
    alert('Password changed successfully!');
  };

  const handleCancelChangePassword = () => {
    navigate('/profile');
  };

  const handleProfileChangePassword = () => {
    navigate('/change-password');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };


  return (
    <div className="app">
      <FloatingParticles count={35} speed={0.7} interactive={true} />
      {/* Render previous route (if any) so it can animate out */}
      {prevLocation && (
        <div className="page-wrapper prev" ref={prevRef} aria-hidden="true">
          <Routes location={prevLocation}>
            <Route path="/" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/change-password" element={<ChangePassword onSuccess={handleChangePasswordSuccess} onCancel={handleCancelChangePassword} loggedInUser={loggedInUser} fromExpiry={location.state?.fromExpiry} />} />
            <Route path="/forgot-password" element={<ForgotPassword onSuccess={() => navigate('/')} />} />
            <Route path="/dashboard" element={<Dashboard onSignOut={handleLogout} />} />
            <Route path="/profile" element={<Profile onChangePassword={handleProfileChangePassword} onBack={handleBackToDashboard} />} />
            <Route path="/gpf" element={<GPF />} />
            <Route path="/gpf/add-slips" element={<AddGPFSlips />} />
            <Route path="/gpf/slip-details" element={<GPFSlipDetails />} />
            <Route path="/temporary-advance" element={<TemporaryAdvance />} />
            <Route path="/final-withdrawal" element={<FinalWithdrawal />} />
            <Route path="/gpf/user-application" element={<UserApplicationGPF />} />
          </Routes>
        </div>
      )}

      {/* Current route (animates in) */}
      <div className="page-wrapper current" ref={currRef} aria-live="polite">
        <Routes location={location}>
          <Route path="/" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/change-password" element={<ChangePassword onSuccess={handleChangePasswordSuccess} onCancel={handleCancelChangePassword} loggedInUser={loggedInUser} fromExpiry={location.state?.fromExpiry} />} />
          <Route path="/forgot-password" element={<ForgotPassword onSuccess={() => navigate('/')} />} />
          <Route path="/dashboard" element={<Dashboard onSignOut={handleLogout} />} />
          <Route path="/profile" element={<Profile onChangePassword={handleProfileChangePassword} onBack={handleBackToDashboard} />} />
          <Route path="/gpf" element={<GPF />} />
          <Route path="/gpf/add-slips" element={<AddGPFSlips />} />
          <Route path="/gpf/slip-details" element={<GPFSlipDetails />} />
          <Route path="/temporary-advance" element={<TemporaryAdvance />} />
          <Route path="/final-withdrawal" element={<FinalWithdrawal />} />
          <Route path="/gpf/user-application" element={<UserApplicationGPF />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRoutes />
    </Router>
  );
}

export default App;
