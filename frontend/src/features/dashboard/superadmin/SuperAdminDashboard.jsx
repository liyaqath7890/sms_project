import React from 'react';
import RoleDashboardShell from '../components/RoleDashboardShell';

const SuperAdminDashboard = () => {
  return (
    <RoleDashboardShell
      title="Super Admin Dashboard"
      subtitle="System-wide command center for institutions, users, permissions, audit health, and platform-level operations."
      accent="#4f46e5"
      metrics={[
        { label: 'Active Schools', value: '12', delta: '+2 this term', icon: 'users' },
        { label: 'Platform Uptime', value: '99.9%', delta: 'Healthy', icon: 'trend' },
        { label: 'Open Audits', value: '7', delta: '3 require review', icon: 'activity', tone: 'var(--warning)' },
        { label: 'Notifications', value: '24', delta: 'Role-targeted', icon: 'notifications' }
      ]}
      feed={[
        { title: 'RBAC policy updated', description: 'Permission matrix synchronized for all core modules.' },
        { title: 'New admin invited', description: 'A campus admin account is pending email verification.' },
        { title: 'Security review', description: 'Login activity anomalies are ready for review.' }
      ]}
    />
  );
};

export default SuperAdminDashboard;
