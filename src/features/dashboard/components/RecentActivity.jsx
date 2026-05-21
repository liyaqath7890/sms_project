import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dataManager } from '../../../services/dataManager';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await dataManager.getRecentActivities(10);
        setActivities(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch recent activities:', err);
        setError('Failed to load activities');
        // Fallback to mock data
        setActivities([
          { id: 1, user: 'John Doe', avatar: 'JD', action: 'Enrolled in Physics', date: '2 mins ago', status: 'success' },
          { id: 2, user: 'Sarah Smith', avatar: 'SS', action: 'Submitted Assignment 4', date: '45 mins ago', status: 'info' },
          { id: 3, user: 'Dr. Brown', avatar: 'DB', action: 'Scheduled Math Exam', date: '2 hours ago', status: 'warning' },
          { id: 4, user: 'Mike Ross', avatar: 'MR', action: 'Teacher Profile Updated', date: '5 hours ago', status: 'success' },
          { id: 5, user: 'Emma Stone', avatar: 'ES', action: 'Absence recorded', date: 'Yesterday', status: 'danger' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);
  return (
    <div className="card" style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem' }}>Recent Activity</h3>
        <button style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600 }}>View All</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          {error}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activities.map((activity, index) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '0.75rem', 
                borderRadius: 'var(--radius-md)',
                border: '1px solid transparent',
                transition: 'var(--transition)',
                cursor: 'pointer'
              }}
              whileHover={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: `var(--bg-main)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)'
              }}>
                {activity.avatar || activity.user?.charAt(0)?.toUpperCase() || '?'}
              </div>
              
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>
                  {activity.user} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{activity.action}</span>
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: 0 }}>
                  {activity.date}
                </p>
              </div>

              <span className={`badge badge-${activity.status}`} style={{ textTransform: 'capitalize' }}>
                {activity.status}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
