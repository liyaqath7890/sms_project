import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const PageHeader = ({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  actions = [] 
}) => {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Breadcrumbs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto' }}>
        <Link to="/dashboard" style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', transition: 'var(--transition)' }}>
          <Home size={16} />
        </Link>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight size={14} style={{ color: 'var(--text-light)' }} />
            {crumb.path ? (
              <Link to={crumb.path} style={{ 
                fontSize: '0.8125rem', 
                color: idx === breadcrumbs.length - 1 ? 'var(--primary)' : 'var(--text-light)',
                fontWeight: idx === breadcrumbs.length - 1 ? 600 : 400,
                whiteSpace: 'nowrap'
              }}>
                {crumb.label}
              </Link>
            ) : (
              <span style={{ 
                fontSize: '0.8125rem', 
                color: idx === breadcrumbs.length - 1 ? 'var(--primary)' : 'var(--text-light)',
                fontWeight: idx === breadcrumbs.length - 1 ? 600 : 400,
                whiteSpace: 'nowrap'
              }}>
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Header Content */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        flexWrap: 'wrap', 
        gap: '1.5rem' 
      }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 800, 
            color: 'var(--text-main)', 
            margin: 0,
            letterSpacing: '-0.025em'
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ 
              color: 'var(--text-muted)', 
              fontSize: '1rem', 
              marginTop: '0.5rem',
              maxWidth: '600px'
            }}>
              {subtitle}
            </p>
          )}
        </motion.div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {actions.map((action, idx) => (
            <motion.button
              key={idx}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.875rem',
                backgroundColor: action.variant === 'primary' ? 'var(--primary)' : 'white',
                color: action.variant === 'primary' ? 'white' : 'var(--text-main)',
                border: action.variant === 'primary' ? 'none' : '1px solid var(--border-color)',
                boxShadow: action.variant === 'primary' ? '0 10px 15px -3px rgba(79, 70, 229, 0.3)' : 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {action.icon && <action.icon size={18} />}
              {action.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
