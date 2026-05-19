import React, { useState, useEffect } from 'react';
import './scrollBehaviorToggle.css';

const ScrollBehaviorToggle = ({ onChange }) => {
  const [scrollBehavior, setScrollBehavior] = useState(() => {
    // Load from localStorage or default to 'contain'
    return localStorage.getItem('scrollBehavior') || 'contain';
  });
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Save to localStorage whenever it changes
    localStorage.setItem('scrollBehavior', scrollBehavior);
    // Notify parent component
    if (onChange) {
      onChange(scrollBehavior);
    }
  }, [scrollBehavior, onChange]);

  const handleChange = (value) => {
    setScrollBehavior(value);
  };

  return (
    <div className="scroll-behavior-toggle">
      <span className="scroll-label">Scroll:</span>

      <button
        type="button"
        className={`scroll-btn ${scrollBehavior === 'auto' ? 'active' : ''}`}
        onClick={() => handleChange('auto')}
        aria-pressed={scrollBehavior === 'auto'}
      >
        Auto
      </button>

      <span className="scroll-separator">/</span>

      <button
        type="button"
        className={`scroll-btn ${scrollBehavior === 'contain' ? 'active' : ''}`}
        onClick={() => handleChange('contain')}
        aria-pressed={scrollBehavior === 'contain'}
      >
        Contained
      </button>

      <button
        type="button"
        className="scroll-info-btn"
        onClick={() => setShowTooltip(!showTooltip)}
        onBlur={() => setTimeout(() => setShowTooltip(false), 200)}
        aria-label="Scroll behavior information"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="info-icon">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </button>

      {showTooltip && (
        <div className="scroll-tooltip">
          <div className="tooltip-item">
            <strong>Auto:</strong> Scroll continues to page after reaching card bottom
          </div>
          <div className="tooltip-item">
            <strong>Contained:</strong> Scroll stops at card boundaries (recommended)
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollBehaviorToggle;
