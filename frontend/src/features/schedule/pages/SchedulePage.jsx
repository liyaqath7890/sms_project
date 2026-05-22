import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, Book, Edit2, Plus, Filter } from 'lucide-react';
import '../../components/premium/premium.css';

const SchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedGrade, setSelectedGrade] = useState('5');
  const [selectedSection, setSelectedSection] = useState('A');
  const [viewMode, setViewMode] = useState('week');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const sections = ['A', 'B', 'C', 'D', 'E'];

  const schedule = {
    Monday: [
      { time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Mr. Rajesh', room: 'Room 101', type: 'regular' },
      { time: '09:00 - 10:00', subject: 'English', teacher: 'Mrs. Priya', room: 'Room 102', type: 'regular' },
      { time: '10:00 - 10:30', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:30 - 11:30', subject: 'Science', teacher: 'Mr. Vikram', room: 'Lab A', type: 'regular' },
      { time: '11:30 - 12:30', subject: 'Social Studies', teacher: 'Ms. Anjali', room: 'Room 103', type: 'regular' },
      { time: '12:30 - 01:00', subject: 'Lunch', teacher: '', room: '', type: 'break' },
      { time: '01:00 - 02:00', subject: 'Physical Education', teacher: 'Coach Arun', room: 'Sports Field', type: 'regular' }
    ],
    Tuesday: [
      { time: '08:00 - 09:00', subject: 'English', teacher: 'Mrs. Priya', room: 'Room 102', type: 'regular' },
      { time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Mr. Rajesh', room: 'Room 101', type: 'regular' },
      { time: '10:00 - 10:30', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:30 - 11:30', subject: 'Computer Science', teacher: 'Mr. Ajay', room: 'Lab C', type: 'regular' },
      { time: '11:30 - 12:30', subject: 'Hindi', teacher: 'Ms. Kavya', room: 'Room 104', type: 'regular' },
      { time: '12:30 - 01:00', subject: 'Lunch', teacher: '', room: '', type: 'break' },
      { time: '01:00 - 02:00', subject: 'Art & Craft', teacher: 'Ms. Neha', room: 'Art Room', type: 'regular' }
    ],
    Wednesday: [
      { time: '08:00 - 09:00', subject: 'Science', teacher: 'Mr. Vikram', room: 'Lab A', type: 'regular' },
      { time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Mr. Rajesh', room: 'Room 101', type: 'regular' },
      { time: '10:00 - 10:30', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:30 - 11:30', subject: 'English', teacher: 'Mrs. Priya', room: 'Room 102', type: 'regular' },
      { time: '11:30 - 12:30', subject: 'Social Studies', teacher: 'Ms. Anjali', room: 'Room 103', type: 'regular' },
      { time: '12:30 - 01:00', subject: 'Lunch', teacher: '', room: '', type: 'break' },
      { time: '01:00 - 02:00', subject: 'Music', teacher: 'Mr. Rahul', room: 'Music Room', type: 'regular' }
    ],
    Thursday: [
      { time: '08:00 - 09:00', subject: 'Social Studies', teacher: 'Ms. Anjali', room: 'Room 103', type: 'regular' },
      { time: '09:00 - 10:00', subject: 'Science', teacher: 'Mr. Vikram', room: 'Lab A', type: 'regular' },
      { time: '10:00 - 10:30', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:30 - 11:30', subject: 'Mathematics', teacher: 'Mr. Rajesh', room: 'Room 101', type: 'regular' },
      { time: '11:30 - 12:30', subject: 'English', teacher: 'Mrs. Priya', room: 'Room 102', type: 'regular' },
      { time: '12:30 - 01:00', subject: 'Lunch', teacher: '', room: '', type: 'break' },
      { time: '01:00 - 02:00', subject: 'Physical Education', teacher: 'Coach Arun', room: 'Sports Field', type: 'regular' }
    ],
    Friday: [
      { time: '08:00 - 09:00', subject: 'Computer Science', teacher: 'Mr. Ajay', room: 'Lab C', type: 'regular' },
      { time: '09:00 - 10:00', subject: 'English', teacher: 'Mrs. Priya', room: 'Room 102', type: 'regular' },
      { time: '10:00 - 10:30', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:30 - 11:30', subject: 'Mathematics', teacher: 'Mr. Rajesh', room: 'Room 101', type: 'regular' },
      { time: '11:30 - 12:30', subject: 'Art & Craft', teacher: 'Ms. Neha', room: 'Art Room', type: 'regular' },
      { time: '12:30 - 01:00', subject: 'Lunch', teacher: '', room: '', type: 'break' },
      { time: '01:00 - 02:00', subject: 'Assembly', teacher: 'Principal', room: 'Auditorium', type: 'regular' }
    ]
  };

  const getSubjectColor = (subject) => {
    const colors = {
      Mathematics: '#3b82f6',
      English: '#10b981',
      Science: '#f59e0b',
      'Social Studies': '#8b5cf6',
      'Computer Science': '#ec4899',
      'Physical Education': '#ef4444',
      Hindi: '#f97316',
      'Art & Craft': '#06b6d4',
      Music: '#a855f7',
      Assembly: '#6366f1'
    };
    return colors[subject] || '#3b82f6';
  };

  return (
    <div style={{ padding: '2rem', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1f2937', marginBottom: '0.5rem' }}>
          Class Schedule
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Manage and view class timetables</p>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <div>
          <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}>
            Grade
          </label>
          <select 
            value={selectedGrade} 
            onChange={(e) => setSelectedGrade(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '0.95rem',
              color: '#1f2937',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {grades.map(g => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}>
            Section
          </label>
          <select 
            value={selectedSection} 
            onChange={(e) => setSelectedSection(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '0.95rem',
              color: '#1f2937',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {sections.map(s => (
              <option key={s} value={s}>Section {s}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}>
            View Mode
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setViewMode('week')}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: viewMode === 'week' ? 'none' : '1px solid #e5e7eb',
                background: viewMode === 'week' ? '#3b82f6' : 'transparent',
                color: viewMode === 'week' ? 'white' : '#1f2937',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              Week
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setViewMode('day')}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: viewMode === 'day' ? 'none' : '1px solid #e5e7eb',
                background: viewMode === 'day' ? '#3b82f6' : 'transparent',
                color: viewMode === 'day' ? 'white' : '#1f2937',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              Day
            </motion.button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Plus size={18} />
            Add Class
          </motion.button>
        </div>
      </motion.div>

      {/* Days of Week Tabs */}
      {viewMode === 'week' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '2rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}
        >
          {daysOfWeek.map((day, idx) => (
            <motion.button
              key={day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedDay(day)}
              style={{
                padding: '0.75rem 1.5rem',
                border: selectedDay === day ? 'none' : '1px solid #e5e7eb',
                background: selectedDay === day ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'white',
                color: selectedDay === day ? 'white' : '#1f2937',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease',
                boxShadow: selectedDay === day ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none'
              }}
            >
              {day}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Schedule Grid */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.2 }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1rem'
        }}>
          {schedule[viewMode === 'day' ? selectedDay : selectedDay].map((period, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              style={{
                background: 'white',
                borderLeft: `4px solid ${getSubjectColor(period.subject)}`,
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                display: 'grid',
                gridTemplateColumns: '150px 1fr 1fr 1fr auto',
                gap: '1.5rem',
                alignItems: 'center'
              }}
            >
              {/* Time */}
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Time
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1f2937', fontWeight: '600' }}>
                  <Clock size={16} />
                  {period.time}
                </div>
              </div>

              {/* Subject */}
              {period.type === 'regular' ? (
                <>
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Subject
                    </p>
                    <p style={{ color: '#1f2937', fontWeight: '600', fontSize: '1.05rem' }}>
                      {period.subject}
                    </p>
                  </div>

                  {/* Teacher */}
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Teacher
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1f2937' }}>
                      <Users size={16} />
                      {period.teacher}
                    </div>
                  </div>

                  {/* Room */}
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Venue
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1f2937' }}>
                      <MapPin size={16} />
                      {period.room}
                    </div>
                  </div>

                  {/* Action */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    style={{
                      background: '#f3f4f6',
                      border: 'none',
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#3b82f6',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Edit2 size={18} />
                  </motion.button>
                </>
              ) : (
                <>
                  <div style={{
                    gridColumn: '2 / -2',
                    background: period.type === 'break' ? '#fef3c7' : '#e5e7eb',
                    padding: '1rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: period.type === 'break' ? '#92400e' : '#374151'
                  }}>
                    ☕ {period.subject}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}
      >
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Classes/Day</p>
          <p style={{ fontSize: '2rem', fontWeight: '800', color: '#3b82f6' }}>7</p>
        </div>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>Duration</p>
          <p style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>6 Hours</p>
        </div>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>Subjects</p>
          <p style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b' }}>9</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SchedulePage;
