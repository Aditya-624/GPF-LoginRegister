import React, { useEffect, useState } from 'react';
import './ThemeSelector.css';

const themes = [
  { id: 'ocean-light', name: 'Ocean Light', icon: '🌊', colors: ['#E0F7FA', '#62adb7', '#6DB432'] },
  { id: 'ocean-dark', name: 'Ocean Dark', icon: '🌙', colors: ['#0f172a', '#38bdf8', '#22c55e'] },
  { id: 'sunset', name: 'Sunset', icon: '🌅', colors: ['#fef3c7', '#f97316', '#dc2626'] },
  { id: 'forest', name: 'Forest', icon: '🌲', colors: ['#064e3b', '#10b981', '#f59e0b'] },
  { id: 'purple', name: 'Purple Dream', icon: '💜', colors: ['#581c87', '#a855f7', '#06b6d4'] },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🤖', colors: ['#0a0a0a', '#00ff88', '#ff0080'] },
  { id: 'rose-gold', name: 'Rose Gold', icon: '🌸', colors: ['#fdf2f8', '#ec4899', '#f59e0b'] }
];

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      return saved || 'ocean-light';
    } catch (e) {
      return 'ocean-light';
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes first
    const allThemeClasses = [
      'theme-ocean-light', 'theme-light', 'theme-ocean-dark', 'theme-dark',
      'theme-sunset', 'theme-forest', 'theme-purple', 'theme-cyberpunk', 'theme-rose-gold'
    ];
    
    allThemeClasses.forEach(className => {
      root.classList.remove(className);
    });
    
    // Add current theme class
    const themeClass = `theme-${currentTheme}`;
    root.classList.add(themeClass);
    
    try { 
      localStorage.setItem('theme', currentTheme); 
    } catch (e) {}

    // Add smooth transition
    root.classList.add('theme-transition');
    const timer = setTimeout(() => root.classList.remove('theme-transition'), 300);
    return () => clearTimeout(timer);
  }, [currentTheme]);

  const handleThemeChange = (themeId) => {
    // Add loading state for smooth transition
    const root = document.documentElement;
    root.classList.add('theme-changing');
    
    setTimeout(() => {
      setCurrentTheme(themeId);
      setIsOpen(false);
      
      setTimeout(() => {
        root.classList.remove('theme-changing');
      }, 100);
    }, 150);
  };

  const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];

  return (
    <div className="theme-selector">
      <button
        className="theme-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select theme"
        title="Change theme"
      >
        <span className="theme-icon">{currentThemeData.icon}</span>
        <span className="theme-name">{currentThemeData.name}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <>
          <div className="theme-selector-backdrop" onClick={() => setIsOpen(false)} />
          <div className="theme-selector-dropdown">
            {themes.map(theme => (
              <button
                key={theme.id}
                className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                onClick={() => handleThemeChange(theme.id)}
              >
                <span className="theme-option-icon">{theme.icon}</span>
                <div className="theme-option-info">
                  <span className="theme-option-name">{theme.name}</span>
                  <div className="theme-option-colors">
                    {theme.colors.map((color, index) => (
                      <div
                        key={index}
                        className="color-dot"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                {currentTheme === theme.id && (
                  <span className="check-icon">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}