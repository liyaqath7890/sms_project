import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Download, TrendingUp, Calendar } from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import CustomDropdown from '../../../components/custom/CustomDropdown';
import AnalyticsCard from '../../../components/custom/AnalyticsCard';
import { useAcademicSession } from '../../../services/academicSessionContext';

const AnalyticsReports = () => {
  const { grades, currentSession } = useAcademicSession();
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [selectedMetric, setSelectedMetric] = useState('performance');

  // Mock analytics data
  const performanceData = [
    { month: 'Apr', A: 45, B: 60, C: 48, D: 15 },
    { month: 'May', A: 52, B: 65, C: 42, D: 12 },
    { month: 'Jun', A: 58, B: 68, C: 38, D: 10 },
    { month: 'Jul', A: 62, B: 72, C: 35, D: 8 },
    { month: 'Aug', A: 68, B: 75, C: 32, D: 6 },
    { month: 'Sep', A: 72, B: 78, C: 28, D: 4 },
  ];

  const attendanceData = [
    { week: 'Week 1', present: 450, absent: 35, leave: 15 },
    { week: 'Week 2', present: 460, absent: 28, leave: 12 },
    { week: 'Week 3', present: 480, absent: 18, leave: 2 },
    { week: 'Week 4', present: 475, absent: 22, leave: 3 },
  ];

  const subjectPerformance = [
    { subject: 'English', score: 78 },
    { subject: 'Mathematics', score: 82 },
    { subject: 'Science', score: 85 },
    { subject: 'Social Studies', score: 76 },
    { subject: 'Hindi', score: 80 },
  ];

  const gradeOptions = grades.map(g => ({ value: g.id, label: g.name }));

  const metricOptions = [
    { value: 'performance', label: 'Student Performance' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'subjects', label: 'Subject Wise' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: '2rem' }}
      >
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 700 }}>
              Analytics & Reports
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Comprehensive insights for {currentSession?.name}
            </p>
          </div>
          <CustomButton
            icon={Download}
            onClick={() => console.log('Generate report')}
          >
            Generate PDF
          </CustomButton>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <CustomDropdown
            label="Select Grade"
            options={gradeOptions}
            value={selectedGrade}
            onChange={setSelectedGrade}
            size="sm"
          />
          <CustomDropdown
            label="Select Metric"
            options={metricOptions}
            value={selectedMetric}
            onChange={setSelectedMetric}
            size="sm"
          />
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, staggerChildren: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}
      >
        <motion.div initial={{ y: 10 }} animate={{ y: 0 }}>
          <AnalyticsCard
            title="Average Score"
            value="82.5"
            unit="%"
            icon={TrendingUp}
            trend={{ type: 'up', value: '+4.2%', period: 'vs last month' }}
            color="primary"
          />
        </motion.div>

        <motion.div initial={{ y: 10 }} animate={{ y: 0 }}>
          <AnalyticsCard
            title="Attendance Rate"
            value="94.3"
            unit="%"
            icon={Calendar}
            trend={{ type: 'up', value: '+1.2%', period: 'vs last month' }}
            color="success"
          />
        </motion.div>

        <motion.div initial={{ y: 10 }} animate={{ y: 0 }}>
          <AnalyticsCard
            title="Students Improved"
            value="156"
            icon={TrendingUp}
            color="info"
          />
        </motion.div>

        <motion.div initial={{ y: 10 }} animate={{ y: 0 }}>
          <AnalyticsCard
            title="Grade Distribution"
            value="A: 72"
            icon={TrendingUp}
            color="warning"
          />
        </motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem'
        }}
      >
        {selectedMetric === 'performance' && (
          <>
            {/* Performance Trend */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: 700 }}>
                Grade Distribution Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-main)'
                  }} />
                  <Legend />
                  <Area type="monotone" dataKey="A" stackId="1" stroke="#10b981" fillOpacity={1} fill="url(#colorA)" />
                  <Area type="monotone" dataKey="B" stackId="1" stroke="#3b82f6" fillOpacity={0.3} fill="#3b82f6" />
                  <Area type="monotone" dataKey="C" stackId="1" stroke="#f59e0b" fillOpacity={0.3} fill="#f59e0b" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Comparison */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: 700 }}>
                Grade Wise Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData.slice(-3)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-main)'
                  }} />
                  <Legend />
                  <Bar dataKey="A" fill="#10b981" />
                  <Bar dataKey="B" fill="#3b82f6" />
                  <Bar dataKey="C" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {selectedMetric === 'attendance' && (
          <>
            {/* Attendance Trend */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: 700 }}>
                Weekly Attendance Pattern
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="week" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-main)'
                  }} />
                  <Legend />
                  <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                  <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
                  <Line type="monotone" dataKey="leave" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Attendance Distribution */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: 700 }}>
                Attendance Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Present', value: 470 },
                      { name: 'Absent', value: 26 },
                      { name: 'Leave', value: 5 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip contentStyle={{
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-main)'
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {selectedMetric === 'subjects' && (
          <>
            {/* Subject Performance */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
              gridColumn: '1 / -1'
            }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: 700 }}>
                Subject Wise Average Scores
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis type="number" stroke="var(--text-muted)" />
                  <YAxis dataKey="subject" type="category" stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-main)'
                  }} />
                  <Bar dataKey="score" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <h3 style={{ color: 'var(--text-main)', fontWeight: 700, marginBottom: '1.5rem' }}>
          Key Insights
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            { title: 'Total Students', value: '1,284', change: '+12%' },
            { title: 'Average Score', value: '82.5%', change: '+4.2%' },
            { title: 'Attendance Rate', value: '94.3%', change: '+1.2%' },
            { title: 'Top Performers', value: '156', change: '+8%' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
                {stat.title}
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                {stat.value}
              </p>
              <p style={{ color: '#10b981', fontSize: '0.875rem', margin: 0, marginTop: '0.5rem', fontWeight: 600 }}>
                {stat.change} this month
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsReports;
