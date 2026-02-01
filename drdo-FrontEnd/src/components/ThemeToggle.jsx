import React, { useEffect, useState } from 'react';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;

    // Apply theme class
    if (theme === 'dark') {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
    } else {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
    }

    try { localStorage.setItem('theme', theme); } catch (e) {}

    // Add a short transition class so changes feel smooth (200-300ms)
    root.classList.add('theme-transition');
    const t = setTimeout(() => root.classList.remove('theme-transition'), 300);
    return () => clearTimeout(t);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-pressed={theme === 'dark'}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      <span className="theme-icon" aria-hidden>{theme === 'dark' ? '🌙' : '☀️'}</span>
    </button>
  );
}
