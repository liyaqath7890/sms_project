import React from 'react';
import { useAuth } from '../../../authentication/context/AuthContext';
import RoleDashboardShell from '../components/RoleDashboardShell';

const dashboardConfig = {
  super_admin: {
    title: 'Super Admin Dashboard',
    subtitle: 'System-wide command center for institutions, users, permissions, audit health, and platform-level operations.',
    accent: '#4f46e5',
    metrics: [
      { label: 'Active Schools', value: '12', delta: '+2 this term', icon: 'users' },
      { label: 'Platform Uptime', value: '99.9%', delta: 'Healthy', icon: 'trend' },
      { label: 'Open Audits', value: '7', delta: '3 require review', icon: 'activity', tone: 'var(--warning)' },
      { label: 'Notifications', value: '24', delta: 'Role-targeted', icon: 'notifications' }
    ],
    feed: [
      { title: 'RBAC policy updated', description: 'Permission matrix synchronized for all core modules.' },
      { title: 'New admin invited', description: 'A campus admin account is pending email verification.' },
      { title: 'Security review', description: 'Login activity anomalies are ready for review.' }
    ]
  },
  admin: {
    title: 'Admin Dashboard',
    subtitle: 'Operational overview for enrollment, staffing, attendance, communication, and daily school administration.',
    accent: '#0ea5e9',
    metrics: [
      { label: 'Students', value: '1,284', delta: '+36 enrolled', icon: 'users' },
      { label: 'Teachers', value: '86', delta: '4 new profiles', icon: 'activity' },
      { label: 'Attendance', value: '94%', delta: '+1.8% weekly', icon: 'attendance' },
      { label: 'Announcements', value: '9', delta: '2 urgent', icon: 'notifications', tone: 'var(--warning)' }
    ],
    feed: [
      { title: 'Admissions batch approved', description: '26 student applications moved to enrollment.' },
      { title: 'Timetable changes published', description: 'Updated schedules are available to teachers and students.' },
      { title: 'Fee reminder queued', description: 'Parent notification list prepared for review.' }
    ]
  },
  principal: {
    title: 'Principal Dashboard',
    subtitle: 'Academic leadership view for institutional performance, teacher activity, attendance, and outcomes.',
    accent: '#059669',
    metrics: [
      { label: 'Academic Index', value: '88', delta: '+4 points', icon: 'grades' },
      { label: 'Attendance', value: '95%', delta: 'Stable', icon: 'attendance' },
      { label: 'Teacher Tasks', value: '31', delta: '8 due today', icon: 'activity' },
      { label: 'Reports', value: '14', delta: 'Ready to export', icon: 'trend' }
    ],
    feed: [
      { title: 'Grade summary ready', description: 'Mid-term performance summaries are available.' },
      { title: 'Attendance dip flagged', description: 'Grade 8-B requires follow-up.' },
      { title: 'Staff meeting note', description: 'New agenda shared with academic staff.' }
    ]
  },
  teacher: {
    title: 'Teacher Dashboard',
    subtitle: 'Classroom workspace for attendance, grade entry, assignments, schedules, and student progress.',
    accent: '#7c3aed',
    metrics: [
      { label: 'Classes Today', value: '5', delta: 'Next at 11:30', icon: 'activity' },
      { label: 'Attendance Pending', value: '2', delta: 'Mark before noon', icon: 'attendance', tone: 'var(--warning)' },
      { label: 'Grades Due', value: '18', delta: '3 assignments', icon: 'grades' },
      { label: 'Messages', value: '6', delta: 'Parents and staff', icon: 'notifications' }
    ],
    feed: [
      { title: 'Assignment submissions', description: '12 new submissions received for review.' },
      { title: 'Attendance completed', description: 'Grade 6-A morning attendance was saved.' },
      { title: 'Parent note', description: 'A follow-up request is waiting in communications.' }
    ]
  },
  student: {
    title: 'Student Dashboard',
    subtitle: 'Focused learning view for attendance, grades, assignments, timetable, and school updates.',
    accent: '#f59e0b',
    metrics: [
      { label: 'Attendance', value: '96%', delta: 'Excellent', icon: 'attendance' },
      { label: 'Grade Average', value: 'A-', delta: '+3% this term', icon: 'grades' },
      { label: 'Assignments', value: '4', delta: '2 due this week', icon: 'activity', tone: 'var(--warning)' },
      { label: 'Updates', value: '5', delta: 'Unread notices', icon: 'notifications' }
    ],
    feed: [
      { title: 'Science quiz posted', description: 'Review material is available in assignments.' },
      { title: 'Library notice', description: 'One borrowed book is due next week.' },
      { title: 'Timetable update', description: 'Friday lab period moved to room 204.' }
    ]
  },
  parent: {
    title: 'Parent Dashboard',
    subtitle: 'Guardian view for attendance, grades, announcements, fee reminders, and teacher communication.',
    accent: '#dc2626',
    metrics: [
      { label: 'Attendance', value: '94%', delta: 'This month', icon: 'attendance' },
      { label: 'Grade Trend', value: '+6%', delta: 'Improving', icon: 'grades' },
      { label: 'Messages', value: '3', delta: 'Teacher updates', icon: 'notifications' },
      { label: 'Tasks', value: '2', delta: 'Action needed', icon: 'activity', tone: 'var(--warning)' }
    ],
    feed: [
      { title: 'Teacher feedback', description: 'Math teacher shared a progress note.' },
      { title: 'Attendance alert', description: 'One late arrival recorded this week.' },
      { title: 'Announcement', description: 'Annual day preparation notice published.' }
    ]
  },
  staff: {
    title: 'Staff Dashboard',
    subtitle: 'Administrative workspace for assigned tasks, attendance support, notices, and operations.',
    accent: '#475569',
    metrics: [
      { label: 'Open Tasks', value: '17', delta: '5 high priority', icon: 'activity', tone: 'var(--warning)' },
      { label: 'Student Requests', value: '22', delta: '+8 today', icon: 'users' },
      { label: 'Notices', value: '11', delta: '3 unread', icon: 'notifications' },
      { label: 'Attendance Support', value: '4', delta: 'Needs review', icon: 'attendance' }
    ],
    feed: [
      { title: 'Transport update', description: 'Route 3 pickup changes need confirmation.' },
      { title: 'Library queue', description: 'Book issue requests are waiting.' },
      { title: 'Office task', description: 'New certificates are ready for printing.' }
    ]
  }
};

const DashboardRouter = () => {
  const { user } = useAuth();
  const role = user?.role || user?.roles?.[0] || 'student';
  const config = dashboardConfig[role] || dashboardConfig.student;

  return <RoleDashboardShell {...config} />;
};

export default DashboardRouter;
