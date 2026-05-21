import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DownloadCloud, Filter, Calendar, TrendingUp, Users, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../components/premium/premium.css';

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('month');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [reportType, setReportType] = useState('overview');

  // Sample data for charts
  const attendanceData = [
    { date: 'Week 1', present: 450, absent: 50, leave: 25 },
    { date: 'Week 2', present: 480, absent: 35, leave: 30 },
    { date: 'Week 3', present: 495, absent: 25, leave: 15 },
    { date: 'Week 4', present: 510, absent: 20, leave: 15 }
  ];

  const performanceData = [
    { name: 'Grade 1', excellent: 45, good: 35, average: 15, poor: 5 },
    { name: 'Grade 2', excellent: 50, good: 30, average: 15, poor: 5 },
    { name: 'Grade 3', excellent: 48, good: 32, average: 15, poor: 5 },
    { name: 'Grade 4', excellent: 52, good: 28, average: 15, poor: 5 },
    { name: 'Grade 5', excellent: 55, good: 25, average: 15, poor: 5 }
  ];

  const gradeDistribution = [
    { name: 'A+', value: 150, color: '#10b981' },
    { name: 'A', value: 200, color: '#3b82f6' },
    { name: 'B', value: 180, color: '#f59e0b' },
    { name: 'C', value: 120, color: '#ef4444' },
    { name: 'D', value: 50, color: '#8b5cf6' }
  ];

  const enrollmentTrend = [
    { month: 'Jan', students: 2500 },
    { month: 'Feb', students: 2650 },
    { month: 'Mar', students: 2800 },
    { month: 'Apr', students: 2950 },
    { month: 'May', students: 3100 },
    { month: 'Jun', students: 3200 }
  ];

  const metrics = [
    { label: 'Total Students', value: '3,200', icon: Users, color: '#3b82f6' },
    { label: 'Average Attendance', value: '94.2%', icon: TrendingUp, color: '#10b981' },
    { label: 'Total Staff', value: '285', icon: Users, color: '#f59e0b' },
    { label: 'Avg. Performance', value: '78.5%', icon: BarChart3, color: '#8b5cf6' }
  ];

  return (
    <div style={{ padding: '2rem', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1f2937', marginBottom: '0.5rem' }}>
          Analytics & Reports
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Comprehensive insights into school performance and student progress</p>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Calendar size={20} color="#3b82f6" />
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '0.95rem',
              color: '#1f2937',
              fontWeight: '500',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Filter size={20} color="#3b82f6" />
          <select 
            value={selectedGrade} 
            onChange={(e) => setSelectedGrade(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '0.95rem',
              color: '#1f2937',
              fontWeight: '500',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">All Grades</option>
            <option value="1">Grade 1</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
            <option value="4">Grade 4</option>
            <option value="5">Grade 5</option>
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            border: 'none',
            padding: '1rem',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <DownloadCloud size={18} />
          Export Report
        </motion.button>
      </motion.div>

      {/* Key Metrics */}
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
        {metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            whileHover={{ y: -5 }}
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              borderTop: `4px solid ${metric.color}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>{metric.label}</p>
              <metric.icon size={24} color={metric.color} />
            </div>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: metric.color }}>{metric.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}
      >
        {/* Attendance Trend */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
            Attendance Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="present" fill="#10b981" name="Present" />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" />
              <Bar dataKey="leave" fill="#f59e0b" name="Leave" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Enrollment Trend */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
            Enrollment Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="students" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                name="Total Students"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Distribution */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
            Grade Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Distribution */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
            Performance by Grade
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="excellent" stackId="a" fill="#10b981" name="Excellent" />
              <Bar dataKey="good" stackId="a" fill="#3b82f6" name="Good" />
              <Bar dataKey="average" stackId="a" fill="#f59e0b" name="Average" />
              <Bar dataKey="poor" stackId="a" fill="#ef4444" name="Poor" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Top Performers Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4 }}
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
          Top Performers
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Rank</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Student Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Grade</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Section</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Average Score</th>
            </tr>
          </thead>
          <tbody>
            {[
              { rank: 1, name: 'Arjun Sharma', grade: '5', section: 'A', score: '98.5%' },
              { rank: 2, name: 'Priya Verma', grade: '5', section: 'B', score: '97.8%' },
              { rank: 3, name: 'Aditya Kumar', grade: '4', section: 'A', score: '97.2%' },
              { rank: 4, name: 'Neha Singh', grade: '5', section: 'C', score: '96.9%' },
              { rank: 5, name: 'Rohan Gupta', grade: '4', section: 'C', score: '96.5%' }
            ].map((student) => (
              <tr key={student.rank} style={{ borderBottom: '1px solid #e5e7eb', background: student.rank % 2 === 0 ? '#f9fafb' : 'white' }}>
                <td style={{ padding: '1rem', color: '#1f2937', fontWeight: '600' }}>#{student.rank}</td>
                <td style={{ padding: '1rem', color: '#1f2937' }}>{student.name}</td>
                <td style={{ padding: '1rem', color: '#6b7280' }}>Grade {student.grade}</td>
                <td style={{ padding: '1rem', color: '#6b7280' }}>Section {student.section}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    background: '#d1fae5',
                    color: '#065f46',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    {student.score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
