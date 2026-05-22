import React from 'react';
import { 
  Users, 
  UserSquare2, 
  BookOpen, 
  CalendarCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAcademicSession } from '../../../services/academicSessionContext';
import {
  PremiumCard,
  StatCard,
  SessionSwitcher,
  BarChart,
  LineChart
} from '../../../components/premium';
import StatsCard from '../components/StatsCard';
import DashboardCharts from '../components/DashboardCharts';
import RecentActivity from '../components/RecentActivity';
import QuickActions from '../components/QuickActions';

const Dashboard = () => {
  const { currentSession, currentStandard, currentDivision, getCurrentClassInfo } = useAcademicSession();
  const classInfo = getCurrentClassInfo();

  const attendanceData = [
    { label: 'Mon', value: 92 },
    { label: 'Tue', value: 95 },
    { label: 'Wed', value: 88 },
    { label: 'Thu', value: 96 },
    { label: 'Fri', value: 94 },
  ];

  const performanceData = [
    { label: 'Week 1', value: 78 },
    { label: 'Week 2', value: 82 },
    { label: 'Week 3', value: 85 },
    { label: 'Week 4', value: 88 },
    { label: 'Week 5', value: 91 },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Dashboard Overview
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Welcome back, Alex! Here's what's happening with your school today.
        </p>
      </div>

      {/* Session & Class Selector */}
      <SessionSwitcher />

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <StatCard
          label="Class Strength"
          value={classInfo.students}
          icon={Users}
          color="#3b82f6"
          trend={`Std ${currentStandard}-${currentDivision}`}
        />
        <StatCard
          label="Teachers"
          value={classInfo.teachers}
          icon={UserSquare2}
          color="#8b5cf6"
        />
        <StatCard
          label="Average Attendance"
          value="94.2%"
          icon={CalendarCheck}
          color="#10b981"
          trend="90-98%"
          trendDirection="up"
        />
        <StatCard
          label="Average Grade"
          value="A-"
          icon={Award}
          color="#f59e0b"
        />
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <PremiumCard gradient>
          <BarChart
            data={attendanceData}
            label="Weekly Attendance"
            color="#3b82f6"
          />
        </PremiumCard>

        <PremiumCard gradient>
          <LineChart
            data={performanceData}
            label="Academic Progress"
            color="#10b981"
          />
        </PremiumCard>
      </div>

      {/* Legacy Charts Section */}
      <DashboardCharts />

      {/* Bottom Section: Activity & Quick Actions */}
      <div style={{ 
        display: 'flex', 
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
