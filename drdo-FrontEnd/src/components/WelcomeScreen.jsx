import React, { useState, useEffect } from 'react';
import './WelcomeScreen.css';

export default function WelcomeScreen({ onComplete, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            if (onComplete) onComplete();
          }, 500);
          return 100;
        }
        return prev + (100 / (duration / 50));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`welcome-screen ${progress >= 100 ? 'fade-out' : ''}`}>
      <div className="welcome-content">
        <div className="logo-container">
          <div className="logo-circle">
            <span className="logo-text">DRDO</span>
          </div>
          <div className="logo-rings">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
          </div>
        </div>
        
        <h1 className="welcome-title">
          <span className="title-line">Defence Research &</span>
          <span className="title-line">Development Organisation</span>
        </h1>
        
        <p className="welcome-subtitle">Building Tomorrow's Defense Today</p>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>
      
      <div className="welcome-particles">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="welcome-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}