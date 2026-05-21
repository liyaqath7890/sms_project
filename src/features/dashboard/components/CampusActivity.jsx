import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, Clock, ShieldCheck } from 'lucide-react';

const activities = [
  { id: 1, type: 'attendance', message: '94% Students present today', time: 'Just now', icon: UserCheck, color: '#10b981' },
  { id: 2, type: 'teacher', message: '82/84 Teachers active', time: '5 mins ago', icon: Users, color: '#3b82f6' },
  { id: 3, type: 'security', message: 'Campus perimeter secure', time: '12 mins ago', icon: ShieldCheck, color: '#6366f1' },
  { id: 4, type: 'notice', message: 'Morning assembly concluded', time: '1 hour ago', icon: Clock, color: '#f59e0b' },
];

const CampusActivity = () => {
  return (
    <div className="card-premium">
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Campus Activity</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {activities.map((activity, idx) => (
          <div key={activity.id} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
            {idx !== activities.length - 1 && (
              <div style={{ 
                position: 'absolute', 
                left: '18px', 
                top: '40px', 
                bottom: '-15px', 
                width: '2px', 
                backgroundColor: 'var(--border-color)' 
              }} />
            )}
            
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: activity.color + '15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: activity.color,
              zIndex: 1
            }}>
              <activity.icon size={18} />
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {activity.message}
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{activity.time}</span>
              </div>
              <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                System update • {activity.type}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button style={{
        marginTop: '2rem',
        width: '100%',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
        fontWeight: 600,
        transition: 'var(--transition)'
      }}
      onMouseEnter={(e) => e.target.style.borderColor = 'var(--primary)'}
      onMouseLeave={(e) => e.target.style.borderColor = 'var(--border-color)'}
      >
        View Full Activity Log
      </button>
    </div>
  );
};

export default CampusActivity;
