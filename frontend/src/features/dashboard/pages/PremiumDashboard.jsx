import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserSquare2, 
  BookOpen, 
  CalendarCheck, 
  Award, 
  AlertCircle, 
  Download, 
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

// New Components
import DashboardHero from '@/components/custom/DashboardHero';
import MetricCard from '@/components/custom/MetricCard';
import FinancialPulse from '@/components/custom/FinancialPulse';
import QuickActions from '@/features/dashboard/components/QuickActions';
import CampusActivity from '@/features/dashboard/components/CampusActivity';
import AcademicHeatmap from '@/features/dashboard/components/AcademicHeatmap';
import AIAnalyticsCard from '@/components/custom/AIAnalyticsCard';
import AdvancedTable from '@/components/custom/AdvancedTable';

import { useAcademicSession } from '@/services/academicSessionContext';
import { dataManager } from '@/services/dataManager';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function PremiumDashboard() {
  const { currentSession, sessions, switchSession } = useAcademicSession();
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

  const performanceData = dashboardData?.performance?.byGrade || [
    { grade: 'G1', excellent: 25, good: 35, average: 30, poor: 10 },
    { grade: 'G2', excellent: 30, good: 32, average: 28, poor: 10 },
    { grade: 'G3', excellent: 28, good: 38, average: 24, poor: 10 },
    { grade: 'G4', excellent: 32, good: 30, average: 28, poor: 10 },
    { grade: 'G5', excellent: 35, good: 28, average: 25, poor: 12 },
  ];

  const recentStudents = dashboardData?.students?.recent || [
    { id: 1, name: 'Aarav Kumar', class: 'Grade 5-A', enrollment: '2024-04-15', status: 'Active' },
    { id: 2, name: 'Priya Sharma', class: 'Grade 6-B', enrollment: '2024-05-01', status: 'Active' },
    { id: 3, name: 'Rohan Singh', class: 'Grade 7-C', enrollment: '2024-05-10', status: 'Pending' },
    { id: 4, name: 'Divya Patel', class: 'Grade 8-A', enrollment: '2024-05-20', status: 'Active' },
    { id: 5, name: 'Ananya Gupta', class: 'Grade 9-B', enrollment: '2024-06-01', status: 'Active' },
  ];

  if (loading) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:'2rem' }}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: '48px', height: '48px', border: '4px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}
        />
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', fontWeight: 600 }}>Assembling your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      
      {/* Hero Section */}
      <DashboardHero userName="Admin" schoolName="Edustrem Academy" />

      {/* Main Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2.5rem' 
        }}
      >
        <motion.div variants={item}>
          <MetricCard 
            title="Total Students" 
            value="1,284" 
            trend={12} 
            icon={Users} 
            sparkData={[30, 45, 35, 50, 40, 60, 55]} 
            color="primary" 
          />
        </motion.div>
        <motion.div variants={item}>
          <MetricCard 
            title="Active Teachers" 
            value="84" 
            trend={3} 
            icon={UserSquare2} 
            sparkData={[80, 82, 81, 84, 83, 84, 82]} 
            color="info" 
          />
        </motion.div>
        <motion.div variants={item}>
          <MetricCard 
            title="Attendance Rate" 
            value="94.2%" 
            trend={-1.5} 
            icon={CalendarCheck} 
            sparkData={[92, 95, 94, 91, 93, 96, 94]} 
            color="success" 
          />
        </motion.div>
        <motion.div variants={item}>
          <MetricCard 
            title="Revenue Today" 
            value="₹45,280" 
            trend={8} 
            icon={TrendingUp} 
            sparkData={[32000, 38000, 35000, 42000, 40000, 45000, 43000]} 
            color="warning" 
          />
        </motion.div>
      </motion.div>

      {/* Primary Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* Left Column: Financial & AI */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <FinancialPulse />
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <AcademicHeatmap />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <AIAnalyticsCard 
                type="class" 
                data={{ classId: 'current', grades: performanceData }} 
                title="AI Academic Insight" 
              />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <AdvancedTable 
              title="Recent Enrollments" 
              columns={[
                { key:'name', label:'Student Name' }, 
                { key:'class', label:'Class' }, 
                { key:'enrollment', label:'Enrollment Date' }, 
                { key:'status', label:'Status', render: (value) => (
                  <span className={`badge ${value === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                    {value}
                  </span>
                )}
              ]} 
              data={recentStudents} 
              searchable 
              paginated 
              itemsPerPage={5} 
            />
          </motion.div>
        </div>

        {/* Right Column: Actions & Activity */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <QuickActions />
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <CampusActivity />
          </motion.div>

          {/* Integration Note */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5 }}
            className="glass-premium"
            style={{ 
              padding: '1.5rem', 
              borderRadius: 'var(--radius-lg)', 
              textAlign: 'center',
              border: '1px dashed var(--primary)'
            }}
          >
            <BarChart3 className="text-primary" size={32} style={{ marginBottom: '1rem' }} />
            <h4 style={{ margin: 0, color: 'var(--text-main)' }}>Enterprise Analytics</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Full term-wise reporting and data exports are available in the Reports section.
            </p>
            <button style={{ 
              marginTop: '1rem', 
              color: 'var(--primary)', 
              fontWeight: 700, 
              fontSize: '0.875rem' 
            }}>
              Go to Reports &rarr;
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

