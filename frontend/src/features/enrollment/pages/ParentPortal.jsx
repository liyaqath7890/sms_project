import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bell, MessageSquare, BookOpen, TrendingUp, CheckCircle, AlertCircle, Download, FileText } from 'lucide-react';
import '../../components/premium/premium.css';

const ParentPortal = () => {
  const [selectedChild, setSelectedChild] = useState('arjun');
  const [activeTab, setActiveTab] = useState('overview');

  const children = [
    { id: 'arjun', name: 'Arjun Sharma', grade: '5', section: 'A', rollNo: '05' },
    { id: 'priya', name: 'Priya Sharma', grade: '3', section: 'B', rollNo: '12' }
  ];

  const selectedStudentData = {
    arjun: {
      name: 'Arjun Sharma',
      grade: '5',
      section: 'A',
      attendance: 95,
      performance: 92,
      lastAttendance: '2024-12-18',
      nextClass: 'Mathematics - 09:00 AM',
      teacher: 'Mr. Rajesh Kumar'
    }
  };

  // Performance Data
  const performanceData = [
    { month: 'Sept', score: 85 },
    { month: 'Oct', score: 88 },
    { month: 'Nov', score: 90 },
    { month: 'Dec', score: 92 }
  ];

  // Attendance Data
  const attendanceData = [
    { week: 'Week 1', present: 5, absent: 0 },
    { week: 'Week 2', present: 4, absent: 1 },
    { week: 'Week 3', present: 5, absent: 0 },
    { week: 'Week 4', present: 5, absent: 0 }
  ];

  // Grades
  const grades = [
    { subject: 'Mathematics', midTerm: 92, finalTerm: 94, grade: 'A+' },
    { subject: 'English', midTerm: 88, finalTerm: 90, grade: 'A' },
    { subject: 'Science', midTerm: 95, finalTerm: 96, grade: 'A+' },
    { subject: 'Social Studies', midTerm: 85, finalTerm: 88, grade: 'A' },
    { subject: 'Computer Science', midTerm: 93, finalTerm: 95, grade: 'A+' }
  ];

  // Announcements
  const announcements = [
    { id: 1, title: 'Parent-Teacher Meeting', date: '2024-12-22', priority: 'high', message: 'Scheduled for all classes' },
    { id: 2, title: 'Winter Break', date: '2024-12-20 to 2024-12-31', priority: 'normal', message: 'School will remain closed' },
    { id: 3, title: 'Assignment Submission', date: '2024-12-20', priority: 'high', message: 'Science project due' }
  ];

  const student = selectedStudentData.arjun;

  const QuickStat = ({ icon: Icon, label, value, color }) => (
    <motion.div
      whileHover={{ y: -5 }}
      style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        borderTop: `4px solid ${color}`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>{label}</p>
        <Icon size={24} color={color} />
      </div>
      <p style={{ fontSize: '2rem', fontWeight: '800', color: color }}>{value}</p>
    </motion.div>
  );

  return (
    <div style={{ padding: '2rem', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1f2937', marginBottom: '0.5rem' }}>
          Parent Portal
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Track your child's academic progress and stay connected</p>
      </motion.div>

      {/* Child Selection */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '12px',
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        {children.map(child => (
          <motion.button
            key={child.id}
            onClick={() => setSelectedChild(child.id)}
            whileHover={{ scale: 1.05 }}
            style={{
              padding: '0.75rem 1.5rem',
              border: selectedChild === child.id ? 'none' : '1px solid #e5e7eb',
              background: selectedChild === child.id ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'transparent',
              color: selectedChild === child.id ? 'white' : '#1f2937',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {child.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.2 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        <QuickStat icon={CheckCircle} label="Attendance" value={`${student.attendance}%`} color="#10b981" />
        <QuickStat icon={TrendingUp} label="Performance" value={`${student.performance}%`} color="#3b82f6" />
        <QuickStat icon={BookOpen} label="Grade" value="A+" color="#f59e0b" />
        <QuickStat icon={AlertCircle} label="Pending Tasks" value="2" color="#ef4444" />
      </motion.div>

      {/* Tabs */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3 }}
        style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}
      >
        {/* Tab Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          borderBottom: '1px solid #e5e7eb'
        }}>
          {['Overview', 'Performance', 'Attendance', 'Grades', 'Messages'].map(tab => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              style={{
                padding: '1rem',
                border: 'none',
                background: activeTab === tab.toLowerCase() ? '#f3f4f6' : 'transparent',
                color: activeTab === tab.toLowerCase() ? '#3b82f6' : '#6b7280',
                fontWeight: activeTab === tab.toLowerCase() ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderBottom: activeTab === tab.toLowerCase() ? '2px solid #3b82f6' : 'none'
              }}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '2rem' }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Student Info */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
                    Student Information
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#6b7280' }}>
                    <p><strong>Name:</strong> {student.name}</p>
                    <p><strong>Grade:</strong> {student.grade}</p>
                    <p><strong>Section:</strong> {student.section}</p>
                    <p><strong>Class Teacher:</strong> {student.teacher}</p>
                    <p><strong>Next Class:</strong> {student.nextClass}</p>
                  </div>
                </div>

                {/* Recent Announcements */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
                    Recent Announcements
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {announcements.slice(0, 3).map(announce => (
                      <div key={announce.id} style={{
                        background: announce.priority === 'high' ? '#fee2e2' : '#f3f4f6',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        borderLeft: `4px solid ${announce.priority === 'high' ? '#ef4444' : '#3b82f6'}`
                      }}>
                        <p style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                          {announce.title}
                        </p>
                        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{announce.message}</p>
                        <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>{announce.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
                Performance Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    name="Average Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
                Attendance Record
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="present" fill="#10b981" name="Present" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Grades Tab */}
          {activeTab === 'grades' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
                Subject Grades
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Subject</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#6b7280' }}>Mid Term</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#6b7280' }}>Final Term</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#6b7280' }}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb', background: idx % 2 === 0 ? '#f9fafb' : 'white' }}>
                      <td style={{ padding: '1rem', color: '#1f2937', fontWeight: '600' }}>{grade.subject}</td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#1f2937' }}>{grade.midTerm}</td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#1f2937' }}>{grade.finalTerm}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          background: '#d1fae5',
                          color: '#065f46',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}>
                          {grade.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
                Messages from Teachers
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { teacher: 'Mr. Rajesh Kumar', subject: 'Mathematics', message: 'Arjun is doing excellent in math. Keep up the good work!', date: '2 days ago' },
                  { teacher: 'Mrs. Priya Sharma', subject: 'English', message: 'Great improvement in writing skills. Please continue practicing.', date: '1 week ago' },
                  { teacher: 'Mr. Vikram Singh', subject: 'Science', message: 'Science project was outstanding!', date: '2 weeks ago' }
                ].map((msg, idx) => (
                  <div key={idx} style={{
                    background: '#f9fafb',
                    padding: '1rem',
                    borderRadius: '8px',
                    borderLeft: '4px solid #3b82f6'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div>
                        <p style={{ fontWeight: '700', color: '#1f2937', marginBottom: '0.25rem' }}>{msg.teacher}</p>
                        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{msg.subject}</p>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{msg.date}</p>
                    </div>
                    <p style={{ color: '#1f2937', lineHeight: '1.5' }}>{msg.message}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '2rem'
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          style={{
            background: 'white',
            border: '2px solid #3b82f6',
            color: '#3b82f6',
            padding: '1rem',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease'
          }}
        >
          <MessageSquare size={18} />
          Message Teacher
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          style={{
            background: 'white',
            border: '2px solid #3b82f6',
            color: '#3b82f6',
            padding: '1rem',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease'
          }}
        >
          <Download size={18} />
          Download Report Card
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          style={{
            background: 'white',
            border: '2px solid #3b82f6',
            color: '#3b82f6',
            padding: '1rem',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease'
          }}
        >
          <FileText size={18} />
          View Documents
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ParentPortal;
