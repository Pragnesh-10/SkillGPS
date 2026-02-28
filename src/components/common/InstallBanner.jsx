// components/common/InstallBanner.jsx
// Add this component anywhere in your app (e.g., inside App.jsx or Header.jsx)

import React from 'react';
import { usePWA } from '../../hooks/usePWA';

export default function InstallBanner() {
  const { canInstall, isInstalled, promptInstall } = usePWA();

  // Don't show if already installed or install not available
  if (isInstalled || !canInstall) return null;

  return (
    <div style={styles.banner}>
      <div style={styles.left}>
        <span style={styles.icon}>🧭</span>
        <div>
          <div style={styles.title}>Install SkillGPS</div>
          <div style={styles.subtitle}>Add to home screen for the best experience</div>
        </div>
      </div>
      <button style={styles.button} onClick={promptInstall}>
        Install
      </button>
    </div>
  );
}

const styles = {
  banner: {
    position: 'fixed',
    bottom: '1rem',
    left: '1rem',
    right: '1rem',
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    border: '1px solid rgba(108, 99, 255, 0.4)',
    borderRadius: '16px',
    padding: '1rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    zIndex: 9999,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(12px)',
    maxWidth: '480px',
    margin: '0 auto',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  icon: {
    fontSize: '2rem',
  },
  title: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.75rem',
    marginTop: '2px',
  },
  button: {
    background: '#6c63ff',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.25rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
};
