import React from 'react';
import './ModeToggleButton.css';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function ModeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="mode-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
