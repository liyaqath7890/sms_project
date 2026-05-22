import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Cloud, Calendar, Clock } from 'lucide-react';

const DashboardHero = ({ userName = 'Principal', schoolName = 'Edustrem Academy' }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hour = time.getHours();
  let greeting = 'Good morning';
  let Icon = Sun;

  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
    Icon = Sun;
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good evening';
    Icon = Moon;
  } else if (hour >= 21 || hour < 5) {
    greeting = 'Good night';
    Icon = Moon;
  }

  const dateString = time.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-premium"
      style={{
        padding: '2rem',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
        backgroundImage: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
        border: '1px solid rgba(79, 70, 229, 0.1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--grad-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 10px 20px -5px rgba(79, 70, 229, 0.4)'
        }}>
          <Icon size={32} />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            {greeting}, <span className="text-gradient">{userName}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: '0.25rem 0 0 0' }}>
            Everything looks great at <span style={{ fontWeight: 600 }}>{schoolName}</span> today.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', textAlign: 'right' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', justifyContent: 'flex-end' }}>
            <Calendar size={18} className="text-primary" />
            <span style={{ fontWeight: 600 }}>{dateString}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', justifyContent: 'flex-end' }}>
            <Clock size={18} />
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        
        <div style={{ 
          padding: '0.5rem 1rem', 
          backgroundColor: 'rgba(16, 185, 129, 0.1)', 
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>Campus Status</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#065f46' }}>LIVE</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHero;
