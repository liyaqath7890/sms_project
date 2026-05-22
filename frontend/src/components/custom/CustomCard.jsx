import React from 'react';

const CustomCard = ({ 
  children, 
  title, 
  subtitle, 
  shadow = 'sm', 
  padding = true,
  className = '',
  style = {}
}) => {
  return (
    <div 
      className={`card ${className}`}
      style={{
        padding: padding ? '1.5rem' : '0',
        boxShadow: `var(--shadow-${shadow})`,
        ...style
      }}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: '1.5rem', borderBottom: padding ? 'none' : '1px solid var(--border-color)', padding: padding ? '0' : '1.25rem 1.5rem' }}>
          {title && <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{title}</h3>}
          {subtitle && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
      )}
      <div style={{ padding: padding ? '0' : '1.5rem' }}>
        {children}
      </div>
    </div>
  );
};

export default CustomCard;
