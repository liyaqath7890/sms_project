import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const routeNameMap = {
  'dashboard': 'Dashboard',
  'students': 'Students',
  'teachers': 'Teachers',
  'enrollment': 'Enrollment',
  'courses': 'Courses',
  'assignments': 'Assignments',
  'attendance': 'Attendance',
  'gradebook': 'Gradebook',
  'schedule': 'Schedule',
  'classroom': 'Classroom',
  'communication': 'Communication',
  'reports': 'Reports',
  'profile': 'Profile',
  'add': 'Add New',
  'details': 'Details'
};

const Breadcrumbs = ({ onRestoreSidebar, isSidebarHidden }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {/* Home / Restore Sidebar Icon */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onRestoreSidebar}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.4rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: isSidebarHidden ? 'var(--primary)' : 'transparent',
          color: isSidebarHidden ? 'white' : 'var(--text-light)',
          cursor: 'pointer',
          border: 'none',
          transition: 'var(--transition)'
        }}
      >
        <Home size={18} />
      </motion.button>

      {pathnames.length > 0 && <ChevronRight size={14} color="var(--text-light)" />}

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const name = routeNameMap[value.toLowerCase()] || value;

        return (
          <React.Fragment key={to}>
            <Link
              to={to}
              style={{
                fontSize: '0.875rem',
                fontWeight: last ? 600 : 400,
                color: last ? 'var(--text-main)' : 'var(--text-light)',
                pointerEvents: last ? 'none' : 'auto',
                transition: 'var(--transition)'
              }}
            >
              {name}
            </Link>
            {!last && <ChevronRight size={14} color="var(--text-light)" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
