import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  BookOpen, 
  CalendarCheck, 
  GraduationCap, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  LogOut,
  School,
  UserPlus,
  ClipboardList,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed, isHidden, setIsHidden, logout }) => {
  const groups = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Academic',
      items: [
        { name: 'Students', path: '/students', icon: Users },
        { name: 'Teachers', path: '/teachers', icon: UserSquare2 },
        { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
        { name: 'Gradebook', path: '/gradebook', icon: GraduationCap },
        { name: 'Courses', path: '/courses', icon: BookOpen },
        { name: 'Assignments', path: '/assignments', icon: ClipboardList },
      ]
    },
    {
      title: 'Admin',
      items: [
        { name: 'Enrollment', path: '/enrollment', icon: UserPlus },
        { name: 'Schedule', path: '/schedule', icon: Calendar },
        { name: 'Classroom', path: '/classroom', icon: Layers },
        { name: 'Communication', path: '/communication', icon: MessageSquare },
        { name: 'Reports', path: '/reports', icon: BarChart3 },
      ]
    }
  ];

  if (isHidden) return null;

  return (
    <div 
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        transition: 'var(--transition-slow)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 24px -10px rgba(0,0,0,0.05)'
      }}
    >
      {/* Brand Section */}
      <div 
        style={{
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          height: 'var(--navbar-height)',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--grad-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.4)'
        }}>
          <School size={22} />
        </div>
        {!isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontWeight: 800, 
              fontSize: '1.25rem', 
              fontFamily: 'Outfit',
              color: 'var(--text-main)',
              lineHeight: 1
            }}>
              EduStream
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.1em', marginTop: '0.2rem' }}>
              ELITE EDITION
            </span>
          </div>
        )}
      </div>

      {/* Nav Content */}
      <div style={{ flex: 1, padding: '1.5rem 0.75rem', overflowY: 'auto' }}>
        {groups.map((group, gIdx) => (
          <div key={group.title} style={{ marginBottom: '1.5rem' }}>
            {!isCollapsed && (
              <p style={{ 
                fontSize: '0.65rem', 
                fontWeight: 800, 
                color: 'var(--text-light)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                padding: '0 1rem',
                marginBottom: '0.75rem'
              }}>
                {group.title}
              </p>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.875rem 1rem',
                  margin: '0.125rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  gap: '1rem',
                  transition: 'var(--transition)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.875rem',
                  position: 'relative'
                })}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {!isCollapsed && <span>{item.name}</span>}
                    {isActive && !isCollapsed && (
                      <motion.div 
                        layoutId="activeIndicator"
                        style={{
                          position: 'absolute',
                          right: '8px',
                          width: '4px',
                          height: '16px',
                          backgroundColor: 'var(--primary)',
                          borderRadius: '2px'
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{
          backgroundColor: 'var(--bg-main)',
          borderRadius: 'var(--radius-md)',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: isCollapsed ? 'column' : 'row',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              backgroundColor: 'white',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button
            onClick={logout}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--danger)',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
