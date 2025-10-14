import React, { useState, useEffect } from 'react';
import './PasswordProtect.css';

const PasswordProtect = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Check if already authenticated
  useEffect(() => {
    const auth = sessionStorage.getItem('epic-auth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const correctPassword = import.meta.env.VITE_APP_PASSWORD || 'Epic2025!';

    if (password === correctPassword) {
      sessionStorage.setItem('epic-auth', 'authenticated');
      setIsAuthenticated(true);
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('epic-auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  if (loading) {
    return (
      <div className="password-protect-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="password-protect-container">
        <div className="password-protect-card">
          <div className="password-protect-header">
            <h1>Epic Content Planner</h1>
            <p>Enter password to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="password-protect-form">
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="password-input"
                autoFocus
                required
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button type="submit" className="submit-button">
              Access Dashboard
            </button>
          </form>

          <div className="password-protect-footer">
            <p className="hint">Contact Roland's team if you need access</p>
          </div>
        </div>
      </div>
    );
  }

  // Render children with logout button in corner
  return (
    <>
      {children}
      <button
        className="logout-button"
        onClick={handleLogout}
        title="Logout"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </>
  );
};

export default PasswordProtect;