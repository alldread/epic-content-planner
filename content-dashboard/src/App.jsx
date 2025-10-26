import React, { useState, useEffect } from 'react';
import { DataProvider } from './contexts/SupabaseDataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PasswordProtect from './components/Auth/PasswordProtect';
import Layout from './components/Layout/Layout';
import CalendarView from './components/Calendar/CalendarView';
import TaskList from './components/Tasks/TaskList';
import Analytics from './components/Analytics/Analytics';
import SprintFocusManager from './components/SprintFocus/SprintFocusManager';
import { migrateLocalStorageToSupabase, backupLocalStorageData } from './utils/migrateData';
import './styles/globals.css';

function App() {
  console.log('App component rendering');
  const [activeView, setActiveView] = useState('calendar');
  const [migrationStatus, setMigrationStatus] = useState(null);

  // Check for localStorage data on mount and offer migration
  useEffect(() => {
    const checkForLocalData = () => {
      const localData = localStorage.getItem('content-dashboard');
      const migrationDone = localStorage.getItem('supabase-migration-done');

      if (localData && !migrationDone) {
        setMigrationStatus('available');
      }
    };

    // Only check when authenticated
    if (sessionStorage.getItem('epic-auth') === 'authenticated') {
      checkForLocalData();
    }
  }, []);

  const handleMigration = async () => {
    setMigrationStatus('migrating');

    // Backup data first
    backupLocalStorageData();

    // Perform migration
    const result = await migrateLocalStorageToSupabase();

    if (result.success) {
      localStorage.setItem('supabase-migration-done', 'true');
      setMigrationStatus('completed');
      // Reload the page to fetch fresh data from Supabase
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      setMigrationStatus('error');
      console.error('Migration failed:', result.error);
    }
  };

  const renderView = () => {
    console.log('Rendering view:', activeView);
    switch (activeView) {
      case 'calendar':
        return <CalendarView />;
      case 'tasks':
        return (
          <div className="tasks-view">
            <h2>All Tasks</h2>
            <TaskList />
          </div>
        );
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return (
          <div className="settings-view">
            <SprintFocusManager />

            <div className="card shadow-m" style={{ marginTop: '2rem', padding: '1.5rem' }}>
              <h2>General Settings</h2>

              {/* Migration notification */}
              {migrationStatus === 'available' && (
                <div className="settings-section" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Migrate to Cloud Storage</h3>
                  <p style={{ marginBottom: '1rem', opacity: 0.95 }}>
                    We detected local data from your previous sessions. Migrate to cloud storage to access your data from anywhere!
                  </p>
                  <button
                    onClick={handleMigration}
                    style={{
                      background: 'white',
                      color: '#667eea',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Migrate Now
                  </button>
                </div>
              )}

              {migrationStatus === 'migrating' && (
                <div className="settings-section" style={{
                  background: '#f0f9ff',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem'
                }}>
                  <p style={{ color: '#3b82f6' }}>Migrating your data to cloud storage...</p>
                </div>
              )}

              {migrationStatus === 'completed' && (
                <div className="settings-section" style={{
                  background: '#f0fdf4',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem'
                }}>
                  <p style={{ color: '#16a34a' }}>✓ Migration completed successfully! Reloading...</p>
                </div>
              )}

              {migrationStatus === 'error' && (
                <div className="settings-section" style={{
                  background: '#fef2f2',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem'
                }}>
                  <p style={{ color: '#dc2626' }}>Migration failed. Your data is backed up locally.</p>
                </div>
              )}

              <div className="settings-section">
                <h3>Data Storage</h3>
                <p className="text-muted">
                  <strong style={{ color: 'var(--text)' }}>✓ Cloud Storage Active</strong><br />
                  Your data is now stored in the cloud and syncs automatically.
                </p>
              </div>

              <div className="settings-section">
                <h3>Security</h3>
                <p className="text-muted">
                  <strong style={{ color: 'var(--text)' }}>✓ Password Protected</strong><br />
                  Access is restricted with a secure password.
                </p>
              </div>

              <div className="settings-section">
                <h3>Export/Import Data</h3>
                <p className="text-muted">Data is automatically saved to the cloud. Export coming soon.</p>
              </div>
            </div>
          </div>
        );
      default:
        return <CalendarView />;
    }
  };

  return (
    <PasswordProtect>
      <ThemeProvider>
        <DataProvider>
          <Layout activeView={activeView} onViewChange={setActiveView}>
            {renderView()}
          </Layout>
        </DataProvider>
      </ThemeProvider>
    </PasswordProtect>
  );
}

export default App;