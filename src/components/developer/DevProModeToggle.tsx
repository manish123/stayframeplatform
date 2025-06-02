'use client';

import React from 'react';

interface DevProModeToggleProps {
  isDevelopmentProModeActive: boolean;
  onToggle: () => void;
}

export default function DevProModeToggle({ isDevelopmentProModeActive, onToggle }: DevProModeToggleProps) {
  // This component will only be rendered in development, 
  // but an extra check here doesn't hurt and can prevent accidental rendering if imported elsewhere.
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 9999, // Ensure it's on top
      fontSize: '12px'
    }}>
      <label htmlFor="dev-pro-mode-toggle" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <input 
          type="checkbox" 
          id="dev-pro-mode-toggle"
          checked={isDevelopmentProModeActive}
          onChange={onToggle}
          style={{ marginRight: '8px' }}
        />
        Dev: Pro Mode Active
      </label>
      <p style={{ marginTop: '5px', fontSize: '10px', color: '#ccc' }}>
        (For testing Pro features)
      </p>
    </div>
  );
}
