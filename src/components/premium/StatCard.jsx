import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ 
  label, 
  value, 
  icon: Icon, 
  color = '#3b82f6',
  trend,
  trendDirection = 'up'
}) => {
  const bgColor = color + '15'; // Add alpha for background
  const borderColor = color + '40';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: bgColor,
        border: `2px solid ${borderColor}`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decoration */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${color}20 0%, transparent 100%)`,
          opacity: 0.3
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, marginBottom: '0.5rem' }}>
              {label}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: color, margin: 0 }}>
              {value}
            </p>
            {trend && (
              <p style={{
                fontSize: '0.875rem',
                color: trendDirection === 'up' ? '#10b981' : '#ef4444',
                margin: '0.5rem 0 0 0',
                fontWeight: 600
              }}>
                {trendDirection === 'up' ? '↑' : '↓'} {trend}
              </p>
            )}
          </div>
          {Icon && (
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                padding: '0.75rem',
                backgroundColor: color + '25',
                borderRadius: 'var(--radius-md)',
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon size={24} />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
