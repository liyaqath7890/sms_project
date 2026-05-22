import React from 'react';
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Bell,
  Command
} from 'lucide-react';

import { NotificationCenter } from '../common/NotificationCenter';
import { AdvancedSearch } from '../common/AdvancedSearch';

const Navbar = ({ user, logout, isSidebarHidden, setIsSidebarHidden }) => {
  return (
    <header style={{
      height: 'var(--navbar-height)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 900,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      margin: '0 -2rem 2.5rem -2rem'
    }}>
      {/* Search Bar */}
      <div style={{ flex: 1, maxWidth: '400px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input 
            type="text" 
            placeholder="Search anything... (Ctrl + K)"
            style={{
              width: '100%',
              padding: '0.625rem 1rem 0.625rem 2.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'var(--transition)'
            }}
          />
          <div style={{ 
            position: 'absolute', 
            right: '8px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            backgroundColor: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid var(--border-color)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            fontWeight: 700
          }}>
            <Command size={10} /> K
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Quick Help */}
        <button style={{
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--primary)',
          backgroundColor: 'var(--primary-light)',
          border: 'none',
          cursor: 'pointer'
        }}>
          Need Help?
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 0.5rem' }} />

        {/* Notifications */}
        <NotificationCenter />

        {/* User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.375rem',
          paddingRight: '0.75rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'white',
          border: '1px solid var(--border-color)',
          cursor: 'pointer',
          transition: 'var(--transition)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid var(--primary-light)'
          }}>
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=4f46e5&color=fff`} 
              alt="Profile" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {user?.name || 'Principal'}
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase' }}>
              {user?.role || 'Administrator'}
            </span>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-light)', marginLeft: '0.25rem' }} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
