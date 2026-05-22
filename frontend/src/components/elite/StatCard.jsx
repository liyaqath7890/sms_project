import React from 'react';
import { motion } from 'framer-motion';
import Sparkline from '../custom/Sparkline';

const StatCard = ({ title, value, icon: Icon, color = 'primary', sparkData, trend }) => {
  const colorMap = {
    primary: { main: '#4f46e5', light: 'rgba(79, 70, 229, 0.1)' },
    success: { main: '#10b981', light: 'rgba(16, 185, 129, 0.1)' },
    warning: { main: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)' },
    danger: { main: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' },
    info: { main: '#0ea5e9', light: 'rgba(14, 165, 233, 0.1)' },
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card-premium"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: colors.light,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.main
        }}>
          <Icon size={20} />
        </div>
        {trend && (
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: trend.startsWith('+') ? 'var(--success)' : 'var(--danger)' 
          }}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>{title}</p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.25rem 0' }}>{value}</h2>
      </div>
      {sparkData && (
        <div style={{ marginTop: '0.5rem' }}>
          <Sparkline data={sparkData} color={colors.main} width={120} height={24} />
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
