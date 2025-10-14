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

  // Render children without logout button
  return children;
};

export default PasswordProtect;