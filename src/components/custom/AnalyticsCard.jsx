import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Download, FileText } from 'lucide-react';

const AnalyticsCard = ({ 
  title, 
  value, 
  unit = '', 
  trend = null, 
  subtitle = '', 
  icon: Icon,
  color = 'primary',
  chartData = null,
  onExport = null
}) => {
  const colorMap = {
    primary: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#3b82f6' },
    success: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: '#10b981' },
    warning: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#f59e0b' },
    danger: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '#ef4444' },
    info: { bg: 'rgba(14, 165, 233, 0.1)', text: '#0ea5e9', border: '#0ea5e9' }
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--bg-secondary)',
        border: `2px solid ${colors.border}30`,
        backgroundImage: `linear-gradient(135deg, ${colors.bg}, transparent)`,
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p style={{ 
            color: 'var(--text-muted)', 
            fontSize: '0.875rem', 
            marginBottom: '0.5rem',
            fontWeight: 500
          }}>
            {title}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h3 style={{ 
              fontSize: '2rem', 
              fontWeight: 700, 
              color: 'var(--text-main)',
              margin: 0
            }}>
              {value}
            </h3>
            {unit && (
              <span style={{ 
                color: 'var(--text-muted)',
                fontSize: '0.875rem'
              }}>
                {unit}
              </span>
            )}
          </div>
          {subtitle && (
            <p style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-light)', 
              marginTop: '0.25rem'
            }}>
              {subtitle}
            </p>
          )}
        </div>
        
        {Icon && (
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: colors.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text
          }}>
            <Icon size={24} />
          </div>
        )}
      </div>

      {trend && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '1rem',
          color: trend.type === 'up' ? '#10b981' : '#ef4444'
        }}>
          {trend.type === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
            {trend.value} {trend.period}
          </span>
        </div>
      )}

      {onExport && (
        <button
          onClick={onExport}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
            borderRadius: 'var(--radius-sm)',
            color: colors.text,
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colors.border + '20';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colors.bg;
            e.target.style.transform = 'scale(1)';
          }}
        >
          <Download size={14} />
          Export
        </button>
      )}
    </motion.div>
  );
};

export default AnalyticsCard;
