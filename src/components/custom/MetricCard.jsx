import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import Sparkline from './Sparkline';

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  sparkData, 
  color = 'primary' 
}) => {
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
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minHeight: '180px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: colors.light,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.main
        }}>
          <Icon size={24} />
        </div>
        <button style={{ color: 'var(--text-light)' }}>
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>
          {title}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            {value}
          </h2>
          {trend && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '0.75rem', 
              fontWeight: 700,
              color: trend > 0 ? 'var(--success)' : 'var(--danger)'
            }}>
              {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        {subtitle && (
          <p style={{ color: 'var(--text-light)', fontSize: '0.75rem', marginTop: '0.125rem', margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>

      {sparkData && (
        <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
          <Sparkline data={sparkData} color={colors.main} width={200} height={40} />
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;
