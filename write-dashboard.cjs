const fs = require('fs');
const dest = 'src/features/dashboard/pages/PremiumDashboard.jsx';
const content = `import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserSquare2, BookOpen, CalendarCheck, Award, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AnalyticsCard from '@/components/custom/AnalyticsCard.jsx';
import CustomDropdown from '@/components/custom/CustomDropdown.jsx';
import AdvancedTable from '@/components/custom/AdvancedTable.jsx';
import AIAnalyticsCard from '@/components/custom/AIAnalyticsCard.jsx';
import { useAcademicSession } from '@/services/academicSessionContext.jsx';
import { dataManager } from '@/services/dataManager.js';

export default function PremiumDashboard() {
  const { currentSession, sessions, grades, getDivisionsForStandard, switchSession } = useAcademicSession();
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async (force = false) => {
    try {
      setRefreshing(force);
      const data = await dataManager.getDashboardData();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const attendanceData = dashboardData?.attendance?.monthly || [
    { month: 'Jan', attendance: 92, target: 95 },
    { month: 'Feb', attendance: 94, target: 95 },
    { month: 'Mar', attendance: 89, target: 95 },
    { month: 'Apr', attendance: 96, target: 95 },
    { month: 'May', attendance: 93, target: 95 },
    { month: 'Jun', attendance: 95, target: 95 },
  ];

  const performanceData = dashboardData?.performance?.byGrade || [
    { grade: 'G1', excellent: 25, good: 35, average: 30, poor: 10 },
    { grade: 'G2', excellent: 30, good: 32, average: 28, poor: 10 },
    { grade: 'G3', excellent: 28, good: 38, average: 24, poor: 10 },
    { grade: 'G4', excellent: 32, good: 30, average: 28, poor: 10 },
    { grade: 'G5', excellent: 35, good: 28, average: 25, poor: 12 },
  ];

  const gradeDistribution = dashboardData?.grades?.distribution || [
    { name: 'A+', value: 18, color: '#10b981' },
    { name: 'A', value: 22, color: '#3b82f6' },
    { name: 'B', value: 30, color: '#f59e0b' },
    { name: 'C', value: 20, color: '#ef4444' },
    { name: 'D', value: 10, color: '#8b5cf6' },
  ];

  const recentStudents = dashboardData?.students?.recent || [
    { id: 1, name: 'Aarav Kumar', class: 'Grade 5-A', enrollment: '2024-04-15', status: 'Active' },
    { id: 2, name: 'Priya Sharma', class: 'Grade 6-B', enrollment: '2024-05-01', status: 'Active' },
    { id: 3, name: 'Rohan Singh', class: 'Grade 7-C', enrollment: '2024-05-10', status: 'Pending' },
    { id: 4, name: 'Divya Patel', class: 'Grade 8-A', enrollment: '2024-05-20', status: 'Active' },
    { id: 5, name: 'Ananya Gupta', class: 'Grade 9-B', enrollment: '2024-06-01', status: 'Active' },
  ];

  const sectionData = getDivisionsForStandard(selectedGrade);
  const sessionOptions = sessions.map(s => ({ value: s.id, label: s.name }));
  const gradeOptions = grades.map(g => ({ value: g.id, label: g.name }));

  if (loading) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:'2rem' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:'2rem', textAlign:'center' }}>
        <AlertCircle size={64} color="var(--danger)" />
        <div>
          <h2 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Failed to Load Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <button onClick={() => fetchDashboardData(true)} style={{ padding:'0.75rem 1.5rem', backgroundColor:'var(--primary)', color:'white', border:'none', borderRadius:'var(--radius-md)', cursor:'pointer', fontWeight:600 }}>Try Again</button>
        </div>
    );
  }

  const btnStyle = { padding:'0.75rem 1.5rem', display:'flex', alignItems:'center', gap:'0.5rem', border:'none', borderRadius:'var(--radius-md)', cursor:'pointer', fontWeight:600 };

  const chartContainer = { backgroundColor:'var(--bg-secondary)', borderRadius:'var(--radius-lg)', padding:'1.5rem', border:'1px solid var(--border-color)', boxShadow:'var(--shadow-sm)' };

  return (
    <div className="animate-fade-in" style={{ padding:'1.5rem' }}>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }} style={{ marginBottom:'2.5rem', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'2rem', color:'var(--text-main)', marginBottom:'0.5rem', fontWeight:700 }}>Dashboard Overview</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.95rem' }}>Welcome back! Real-time insights for {currentSession?.name || 'your school'}</p>
        </div>
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
          <CustomDropdown label="Academic Session" options={sessionOptions} value={currentSession?.id} onChange={switchSession} size="md" />
          <button style={{ ...btnStyle, backgroundColor:'var(--primary)', color:'white' }} onClick={() => fetchDashboardData(true)} disabled={refreshing}><RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh Data'}</button>
          <button style={{ ...btnStyle, backgroundColor:'var(--success)', color:'white' }}><Download size={18} /> Generate Report</button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.4, staggerChildren:0.1 }} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'1.5rem', marginBottom:'2.5rem' }}>
        <motion.div initial={{ y:10 }} animate={{ y:0 }}><AnalyticsCard title="Total Students" value={dashboardData?.stats?.totalStudents || "1,284"} icon={Users} trend={{ type:'up', value:'+12%', period:'vs last year' }} color="primary" onExport={() => console.log('Export students')} /></motion.div>
        <motion.div initial={{ y:10 }} animate={{ y:0 }}><AnalyticsCard title="Active Teachers" value={dashboardData?.stats?.activeTeachers || "84"} icon={UserSquare2} trend={{ type:'up', value:'+3%', period:'vs last year' }} color="info" onExport={() => console.log('Export teachers')} /></motion.div>
        <motion.div initial={{ y:10 }} animate={{ y:0 }}><AnalyticsCard title="Active Courses" value={dashboardData?.stats?.activeCourses || "42"} icon={BookOpen} color="warning" onExport={() => console.log('Export courses')} /></motion.div>
        <motion.div initial={{ y:10 }} animate={{ y:0 }}><AnalyticsCard title="Avg. Attendance" value={dashboardData?.stats?.avgAttendance || "94.2%"} icon={CalendarCheck} trend={{ type:'down', value:'-1.5%', period:'vs last month' }} color="success" onExport={() => console.log('Export attendance')} /></motion.div>
        <motion.div initial={{ y:10 }} animate={{ y:0 }}><AnalyticsCard title="Top Performers" value={dashboardData?.stats?.topPerformers || "156"} icon={Award} color="primary" onExport={() => console.log('Export performers')} /></motion.div>
        <motion.div initial={{ y:10 }} animate={{ y:0 }}><AnalyticsCard title="Pending Tasks" value={dashboardData?.stats?.pendingTasks || "23"} icon={AlertCircle} color="danger" onExport={() => console.log('Export tasks')} /></motion.div>
      </motion.div>

      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.5, delay:0.15 }} style={{ marginBottom:'2.5rem' }}>
        <AIAnalyticsCard type="class" data={{ classId: currentSession?.id, grades: performanceData.flatMap(g => [{ marks: g.excellent*10 }, { marks: g.good*8 }, { marks: g.average*6 }, { marks: g.poor*4 }]) }} title="AI Class Performance Insights" />
      </motion.div>

      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.5, delay:0.2 }} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(500px, 1fr))', gap:'2rem', marginBottom:'2.5rem' }}>
        <div style={chartContainer}>
          <h3 style={{ marginBottom:'1.5rem', color:'var(--text-main)', fontWeight:700 }}>Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" domain={[80,100]} />
              <Tooltip contentStyle={{ backgroundColor:'var(--bg-main)', border:'1px solid var(--border-color)', borderRadius:'var(--radius-md)', color:'var(--text-main)' }} />
              <Legend />
              <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} dot={{ fill:'#3b82f6' }} />
              <Line type="monotone" dataKey="target" stroke="#10b981" strokeDasharray="5 5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={chartContainer}>
          <h3 style={{ marginBottom:'1.5rem', color:'var(--text-main)', fontWeight:700 }}>Performance by Grade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="grade" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ backgroundColor:'var(--bg-main)', border:'1px solid var(--border-color)', borderRadius:'var(--radius-md)', color:'var(--text-main)' }} />
              <Legend />
              <Bar dataKey="excellent" stackId="a" fill="#10b981" />
              <Bar dataKey="good" stackId="a" fill="#3b82f6" />
              <Bar dataKey="average" stackId="a" fill="#f59e0b" />
              <Bar dataKey="poor" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.5, delay:0.3 }} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'2rem', marginBottom:'2rem' }}>
        <div style={chartContainer}>
          <h3 style={{ marginBottom:'1.5rem', color:'var(--text-main)', fontWeight:700 }}>Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={gradeDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => name + ' (' + value + ')'} outerRadius={80} fill="#8884d8" dataKey="value">
                {gradeDistribution.map((entry, index) => <Cell key={'cell-' + index} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor:'var(--bg-main)', border:'1px solid var(--border-color)', borderRadius:'var(--radius-md)', color:'var(--text-main)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={chartContainer}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
            <h3 style={{ color:'var(--text-main)', fontWeight:700, margin:0 }}>Sections Overview</h3>
            <CustomDropdown options={gradeOptions} value={selectedGrade} onChange={setSelectedGrade} size="sm" />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {sectionData.map(section => (
              <SectionRow key={section.id} section={section} />
            ))}
          </div>
      </motion.div>

      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.5, delay:0.4 }}>
        <AdvancedTable title="Recent Enrollments" columns={[{ key:'name', label:'Student Name' }, { key:'class', label:'Class' }, { key:'enrollment', label:'Enrollment Date' }, { key:'status', label:'Status', render: (value) => <span style={{ padding:'0.25rem 0.75rem', borderRadius:'var(--radius-sm)', fontSize:'0.75rem', fontWeight:600, backgroundColor: value === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(249, 115, 22, 0.2)', color: value === 'Active' ? '#10b981' : '#f97316' }}>{value}</span> }]} data={recentStudents} onRowClick={(row) => console.log('Row clicked:', row)} searchable sortable paginated itemsPerPage={5} onExport={() => console.log('Export enrollments')} />
      </motion.div>
    </div>
  );
}

function SectionRow({ section }) {
  const [hovered, setHovered] = React.useState(false);
  const pct = (section.currentStrength / section.capacity) * 100;
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ padding:'1rem', borderRadius:'var(--radius-md)', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid ' + (hovered ? 'var(--primary)' : 'var(--border-color)'), backgroundColor: hovered ? 'var(--primary-light)' : 'var(--bg-main)', transition:'all 0.2s', cursor:'pointer' }}>
      <div>
        <p style={{ fontWeight:600, color:'var(--text-main)', margin:0, marginBottom:'0.25rem' }}>{section.gradeName} - Section {section.section}</p>
        <p style={{ fontSize:'0.875rem', color:'var(--text-muted)', margin:0 }}>{section.classTeacher}</p>
      </div>
      <div style={{ textAlign:'right' }}>
        <p style={{ fontWeight:700, color:'var(--primary)', margin:0 }}>{section.currentStrength}/{section.capacity}</p>
        <div style={{ width:'100px', height:'6px', backgroundColor:'var(--bg-secondary)', borderRadius:'3px', marginTop:'0.5rem', overflow:'hidden' }}>
          <div style={{ width: pct + '%', height:'100%', backgroundColor:'var(--primary)', borderRadius:'3px' }} />
        </div>
    </div>
  );
}
`;

fs.writeFileSync(dest, content);
console.log('Written ' + dest);
