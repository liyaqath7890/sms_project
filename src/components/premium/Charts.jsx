import React from 'react';
import { motion } from 'framer-motion';

const BarChart = ({ data, label, color = '#3b82f6', height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const barVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
        {label}
      </h3>

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: `${height}px`,
        gap: '0.75rem',
        padding: '1rem 0'
      }}>
        {data.map((item, idx) => (
          <motion.div
            key={idx}
            variants={barVariants}
            style={{
              flex: 1,
              backgroundColor: color,
              borderRadius: 'var(--radius-md)',
              position: 'relative',
              height: `${(item.value / maxValue) * 100}%`,
              minHeight: '30px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = 0.8;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = 1;
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-1.5rem',
              color: '#1f2937',
              fontWeight: 700,
              fontSize: '0.875rem'
            }}>
              {item.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb'
      }}>
        {data.map((item, idx) => (
          <div key={idx} style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#6b7280'
          }}>
            {item.label}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const LineChart = ({ data, label, color = '#10b981', height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, idx) => {
    const x = (idx / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return { x, y, ...item };
  });

  const pathD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
        {label}
      </h3>

      <motion.svg
        viewBox="0 0 100 100"
        style={{
          flex: 1,
          height: `${height}px`,
          marginBottom: '1rem'
        }}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={`grid-${y}`}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        ))}

        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Fill under line */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <motion.path
          d={`${pathD} L 100 100 L 0 100 Z`}
          fill="url(#lineGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />

        {/* Points */}
        {points.map((p, idx) => (
          <motion.circle
            key={`point-${idx}`}
            cx={p.x}
            cy={p.y}
            r="2"
            fill={color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + idx * 0.1 }}
          />
        ))}
      </motion.svg>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#6b7280'
      }}>
        <span>{data[0]?.label}</span>
        <span>{data[Math.floor(data.length / 2)]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </motion.div>
  );
};

export { BarChart, LineChart };
