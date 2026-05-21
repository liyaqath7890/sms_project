import React from 'react';
import { motion } from 'framer-motion';

const SkeletonBase = ({ width, height, borderRadius = '4px', className = '' }) => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    className={`skeleton-base ${className}`}
    style={{
      width: width || '100%',
      height: height || '20px',
      backgroundColor: '#e2e8f0',
      borderRadius: borderRadius,
    }}
  />
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div style={{ width: '100%', padding: '1rem', backgroundColor: 'white', borderRadius: '8px' }}>
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      {[...Array(cols)].map((_, i) => (
        <SkeletonBase key={i} height="24px" />
      ))}
    </div>
    {[...Array(rows)].map((_, i) => (
      <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
        {[...Array(cols)].map((_, j) => (
          <SkeletonBase key={j} height="16px" />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div style={{ 
    padding: '1.5rem', 
    backgroundColor: 'white', 
    borderRadius: '12px', 
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <SkeletonBase width="40%" height="20px" />
    <SkeletonBase width="90%" height="40px" />
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <SkeletonBase width="30%" height="16px" />
      <SkeletonBase width="20%" height="16px" />
    </div>
  </div>
);

export default SkeletonBase;
