import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, trend, color }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        borderLeft: `4px solid var(--${color})`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ 
          backgroundColor: `var(--${color})`, 
          opacity: 0.1, 
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          position: 'absolute'
        }}></div>
        <div style={{ color: `var(--${color})`, zIndex: 1 }}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`badge badge-${trend.type === 'up' ? 'success' : 'danger'}`}>
            {trend.value}
          </span>
        )}
      </div>
      
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
          {title}
        </p>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
          {value}
        </h3>
      </div>
    </motion.div>
  );
};

export default StatsCard;
