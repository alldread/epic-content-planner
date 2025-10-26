import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Error UI
      return (
        <div style={{
          padding: '2rem',
          background: 'var(--bg-dark, #1a1a1a)',
          color: 'var(--text, #ffffff)',
          minHeight: '100vh',
          fontFamily: 'Manrope, sans-serif'
        }}>
          <h1 style={{ color: 'var(--text, #ffffff)', marginBottom: '1rem' }}>
            Something went wrong
          </h1>
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted, #999)' }}>
            The application encountered an error. Please check the console for details.
          </p>

          {this.state.error && (
            <div style={{
              background: 'rgba(255, 0, 0, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <h3 style={{ color: '#ff6b6b', marginBottom: '0.5rem' }}>Error:</h3>
              <pre style={{
                color: '#ff6b6b',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '14px'
              }}>
                {this.state.error.toString()}
              </pre>
            </div>
          )}

          {this.state.errorInfo && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <h3 style={{ color: 'var(--text, #ffffff)', marginBottom: '0.5rem' }}>
                Component Stack:
              </h3>
              <pre style={{
                color: 'var(--text-muted, #999)',
                whiteSpace: 'pre-wrap',
                fontSize: '12px',
                overflow: 'auto'
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'var(--primary, #667eea)',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    // No error, render children
    return this.props.children;
  }
}

export default ErrorBoundary;