import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'tasks', label: 'All Tasks', icon: '📝' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const quickStats = {
    todayComplete: 85,
    weeklyProgress: 60,
    pendingTasks: 12,
    upcomingNewsletters: 2
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-stats">
        <h3>Quick Stats</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{quickStats.todayComplete}%</span>
            <span className="stat-label">Today</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{quickStats.weeklyProgress}%</span>
            <span className="stat-label">Week</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{quickStats.pendingTasks}</span>
            <span className="stat-label">Tasks</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{quickStats.upcomingNewsletters}</span>
            <span className="stat-label">Newsletters</span>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <p className="tiny text-muted">
          Content Dashboard v1.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;