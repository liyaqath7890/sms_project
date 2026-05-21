import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Save, 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { ElitePageHeader } from '../../../components/elite';
import { dataManager } from '../../../services/dataManager';

const EliteAddSchedule = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [teachers, setTeachers] = useState([]);
  
  const [form, setForm] = useState({ 
    grade: '5', 
    division: 'A', 
    day: 'Monday', 
    timeSlot: '08:00-08:45',
    subject: 'Mathematics',
    teacherId: '',
    teacherName: '',
    classroom: 'Room 302',
    date: new Date().toISOString().split('T')[0]
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '08:00-08:45', '08:45-09:30', '09:30-10:15', '10:15-11:00',
    '11:00-11:45', '11:45-12:30', '12:30-13:15'
  ];

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await dataManager.getTeachers();
        setTeachers(data.teachers || []);
        if (data.teachers?.length > 0) {
          setForm(p => ({ ...p, teacherId: data.teachers[0].id, teacherName: data.teachers[0].name }));
        }
      } catch (err) {
        console.error('Failed to fetch teachers:', err);
      }
    };
    fetchTeachers();
  }, []);

  const handleChange = e => { 
    const { name, value } = e.target;
    if (name === 'teacherId') {
      const selectedTeacher = teachers.find(t => t.id === value);
      setForm(p => ({ ...p, teacherId: value, teacherName: selectedTeacher?.name || '' }));
    } else {
      setForm(p => ({ ...p, [name]: value })); 
    }
    setError(null); 
  };

  const validate = () => { 
    if (!form.subject.trim()) return 'Subject is required.'; 
    if (!form.teacherId) return 'Please select a teacher.'; 
    return null; 
  };

  const handleSubmit = async e => { 
    e.preventDefault(); 
    const err = validate(); 
    if (err) { 
      setError(err); 
      return; 
    } 

    try { 
      setLoading(true); 
      await dataManager.createSchedule({ 
        ...form,
        grade: parseInt(form.grade),
        period: timeSlots.indexOf(form.timeSlot) + 1,
        status: 'scheduled'
      }); 
      setSuccess(true);
      setTimeout(() => navigate('/schedule'), 1500);
    } catch (err) { 
      setError(err.message || 'Failed to create schedule entry. Please try again.'); 
    } finally { 
      setLoading(false); 
    } 
  };

  const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
  const labelStyle = { fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.025em' };
  const inputStyle = { 
    width: '100%', 
    padding: '0.875rem 1rem', 
    borderRadius: 'var(--radius-md)', 
    border: '1px solid var(--border-color)', 
    backgroundColor: 'var(--bg-main)', 
    fontSize: '0.9375rem', 
    color: 'var(--text-main)',
    outline: 'none',
    transition: 'var(--transition)'
  };

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1.5rem' }}
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Schedule Entry Added!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Updating timetable...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <ElitePageHeader 
        title="Schedule Entry" 
        subtitle="Allocate time slots, assigned faculty, and physical learning spaces to optimize academic delivery."
        breadcrumbs={[{ label: 'Schedule', path: '/schedule' }, { label: 'New Entry' }]}
        actions={[
          { label: 'Back to List', icon: ArrowLeft, variant: 'secondary', onClick: () => navigate('/schedule') }
        ]}
      />

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
          
          {/* Main Form Section */}
          <div className="card-premium" style={{ gridColumn: 'span 8', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <Calendar size={20} className="text-primary" />
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>Timing & Allocation</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Academic Day</label>
                <select name="day" value={form.day} onChange={handleChange} style={inputStyle}>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Time Slot</label>
                <select name="timeSlot" value={form.timeSlot} onChange={handleChange} style={inputStyle}>
                  {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Specific Date</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Classroom / Lab</label>
                <input name="classroom" value={form.classroom} onChange={handleChange} style={inputStyle} placeholder="e.g. Room 302" />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', marginTop: '3rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <BookOpen size={20} className="text-info" />
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>Academic Details</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Subject Name</label>
                <input name="subject" value={form.subject} onChange={handleChange} style={inputStyle} placeholder="e.g. Mathematics" />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Target Faculty</label>
                <select name="teacherId" value={form.teacherId} onChange={handleChange} style={inputStyle}>
                  {teachers.length > 0 ? teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>) : <option value="">Select a teacher</option>}
                </select>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card-premium" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <User size={20} className="text-primary" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Student Group</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Grade / Standard</label>
                  <select name="grade" value={form.grade} onChange={handleChange} style={inputStyle}>
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Division / Section</label>
                  <select name="division" value={form.division} onChange={handleChange} style={inputStyle}>
                    {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 600, border: '1px solid rgba(239, 68, 68, 0.2)' }}
              >
                {error}
              </motion.div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  backgroundColor: 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  fontWeight: 800, 
                  fontSize: '1rem', 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {loading ? 'Processing...' : <><Save size={20} /> Add Entry</>}
              </button>
              
              <button 
                type="button"
                onClick={() => navigate('/schedule')}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  backgroundColor: 'white', 
                  color: 'var(--text-muted)', 
                  border: '1px solid var(--border-color)', 
                  fontWeight: 700, 
                  fontSize: '0.9375rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EliteAddSchedule;
