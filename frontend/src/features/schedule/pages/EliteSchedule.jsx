import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Filter,
  Search,
  Plus
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { ElitePageHeader, EliteStatCard } from '../../../components/elite';
import { dataManager } from '../../../services/dataManager';

const EliteSchedule = () => {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState('Monday');
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const data = await dataManager.getSchedule();
        setScheduleData(data.schedule || []);
      } catch (err) {
        console.error('Failed to fetch schedule:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const filteredSchedule = scheduleData.filter(s => s.day === activeDay);

  return (
    <div style={{ padding: '2rem' }}>
      <ElitePageHeader 
        title="Class Schedule" 
        subtitle="Dynamic academic calendar and automated timetable management for the entire campus."
        breadcrumbs={[{ label: 'Academics' }, { label: 'Schedule' }]}
        actions={[
          { label: 'Add Entry', icon: Plus, variant: 'primary', onClick: () => navigate('/schedule/add') },
          { label: 'Download PDF', icon: Download, variant: 'secondary', onClick: () => {} }
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <EliteStatCard title="Weekly Sessions" value="42" icon={Calendar} sparkData={[38, 40, 42, 41, 42, 42, 42]} trend="Full Capacity" />
        <EliteStatCard title="Room Utilization" value="86%" icon={MapPin} color="success" sparkData={[80, 82, 85, 84, 88, 86, 86]} trend="+4% vs last term" />
        <EliteStatCard title="Teacher Load" value="18h / wk" icon={User} color="info" sparkData={[16, 17, 18, 18, 19, 18, 18]} trend="Optimized" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
        {/* Timetable Section */}
        <div style={{ gridColumn: 'span 9' }}>
          <div className="card-premium" style={{ padding: 0 }}>
            {/* Day Switcher */}
            <div style={{ 
              display: 'flex', 
              borderBottom: '1px solid var(--border-color)',
              overflowX: 'auto'
            }}>
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  style={{
                    padding: '1.25rem 2rem',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: activeDay === day ? 'var(--primary)' : 'var(--text-muted)',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeDay === day ? '2px solid var(--primary)' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Schedule List */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredSchedule.length > 0 ? filteredSchedule.map((session, idx) => {
                  const color = session.color || (idx % 2 === 0 ? 'var(--primary)' : 'var(--info)');
                  return (
                    <motion.div
                      key={session.id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: session.subject.includes('Break') ? 'var(--bg-main)' : 'white',
                        border: '1px solid var(--border-color)',
                        transition: 'var(--transition)'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div style={{ minWidth: '160px' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)' }}>{session.timeSlot || session.time}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{session.type || 'Academic'}</p>
                      </div>

                      <div style={{ width: '2px', height: '40px', backgroundColor: color, opacity: 0.3 }} />

                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)' }}>{session.subject}</h4>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem' }}>
                          {(session.teacherName || session.teacher) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              <User size={14} /> {session.teacherName || session.teacher}
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <MapPin size={14} /> {session.classroom || session.room}
                          </div>
                        </div>
                      </div>

                      {!session.subject.includes('Break') && (
                        <div style={{
                          padding: '0.5rem 1rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: color + '15',
                          color: color,
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {session.status || 'Scheduled'}
                        </div>
                      )}
                    </motion.div>
                  );
                }) : (
                  <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Calendar size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>No sessions scheduled for this day.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card-premium" style={{ backgroundImage: 'var(--grad-primary)', color: 'white', border: 'none' }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.125rem' }}>Schedule Insight</h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
              Your current schedule is 94% optimized. Room 302 is the most utilized space this week.
            </p>
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span>Conflict Rate</span>
                <span>0.4%</span>
              </div>
            </div>
          </div>

          <div className="card-premium">
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.125rem', fontWeight: 700 }}>Upcoming Events</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { title: 'Parent Teacher Meet', time: '14th May, 10:00 AM' },
                { title: 'Annual Sports Day', time: '20th May, 09:00 AM' },
                { title: 'Science Exhibition', time: '22nd May, 11:30 AM' }
              ].map((ev, idx) => (
                <div key={idx}>
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700 }}>{ev.title}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ev.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliteSchedule;
