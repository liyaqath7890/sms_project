import React from 'react';
import { motion } from 'framer-motion';

const grades = [
  { name: 'G1', performance: 85, color: '#10b981' },
  { name: 'G2', performance: 78, color: '#10b981' },
  { name: 'G3', performance: 92, color: '#10b981' },
  { name: 'G4', performance: 65, color: '#f59e0b' },
  { name: 'G5', performance: 88, color: '#10b981' },
  { name: 'G6', performance: 72, color: '#3b82f6' },
  { name: 'G7', performance: 95, color: '#10b981' },
  { name: 'G8', performance: 58, color: '#ef4444' },
  { name: 'G9', performance: 81, color: '#10b981' },
  { name: 'G10', performance: 89, color: '#10b981' },
];

const AcademicHeatmap = () => {
  return (
    <div className="card-premium">
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Academic Heatmap</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
        {grades.map((grade) => (
          <div key={grade.name} style={{ textAlign: 'center' }}>
            <div style={{
              aspectRatio: '1/1',
              borderRadius: 'var(--radius-md)',
              backgroundColor: grade.color + '20',
              border: `2px solid ${grade.color}40`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: grade.performance + '%',
                backgroundColor: grade.color,
                opacity: 0.15,
                transition: 'height 1s ease-out'
              }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>{grade.name}</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: grade.color }}>{grade.performance}%</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#ef4444' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Critical</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#f59e0b' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#10b981' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Excellent</span>
          </div>
        </div>
        <button style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>Analyze Trends</button>
      </div>
    </div>
  );
};

export default AcademicHeatmap;
