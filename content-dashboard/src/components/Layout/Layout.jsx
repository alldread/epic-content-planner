import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children, activeView, onViewChange }) => {
  return (
    <div className="app-layout">
      <Header />
      <div className="main-container">
        <Sidebar activeView={activeView} onViewChange={onViewChange} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;