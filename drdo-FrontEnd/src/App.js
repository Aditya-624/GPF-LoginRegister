import React from 'react';
import AppInner from './App.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import './App.css';

export default function App() {
  return React.createElement(ThemeProvider, null, React.createElement(AppInner, null));
}
