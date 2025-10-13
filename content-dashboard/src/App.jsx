import React, { useState } from 'react';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import CalendarView from './components/Calendar/CalendarView';
import TaskList from './components/Tasks/TaskList';
import Analytics from './components/Analytics/Analytics';
import SprintFocusManager from './components/SprintFocus/SprintFocusManager';
import './styles/globals.css';

function App() {
  const [activeView, setActiveView] = useState('calendar');

  const renderView = () => {
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
              <div className="settings-section">
                <h3>Export/Import Data</h3>
                <p className="text-muted">Backup your data or migrate from another device.</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="primary">Export Data</button>
                  <button>Import Data</button>
                </div>
              </div>
              <div className="settings-section">
                <h3>Integration Settings</h3>
                <p className="text-muted">Future integrations with Supabase and automation tools will appear here.</p>
              </div>
            </div>
          </div>
        );
      default:
        return <CalendarView />;
    }
  };

  return (
    <ThemeProvider>
      <DataProvider>
        <Layout activeView={activeView} onViewChange={setActiveView}>
          {renderView()}
        </Layout>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;