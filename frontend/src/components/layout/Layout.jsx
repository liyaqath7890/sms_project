import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../authentication/context/AuthContext';
import ErrorBoundary from '../common/ErrorBoundary';
import AIChatbot from '../custom/AIChatbot';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  return (
    <div className={`app-container ${isSidebarHidden ? 'sidebar-hidden' : ''}`}>
      <Sidebar 
        user={user}
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed}
        isHidden={isSidebarHidden}
        setIsHidden={setIsSidebarHidden}
        logout={logout} 
      />
      <main className={`main-content ${isSidebarCollapsed ? 'collapsed' : ''} ${isSidebarHidden ? 'full-width' : ''}`}>
        <Navbar 
          user={user} 
          logout={logout} 
          isSidebarHidden={isSidebarHidden}
          setIsSidebarHidden={setIsSidebarHidden}
        />
        <div className="content-inner animate-fade-in">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </main>
      {/* AI Chatbot - Available to all authenticated users */}
      <AIChatbot userRole={user?.role || 'student'} />
    </div>
  );
};

export default Layout;
