import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Download, 
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Search
} from 'lucide-react';

import { ElitePageHeader, EliteTable, EliteStatCard } from '../../../components/elite';
import AIAnalyticsCard from '../../../components/custom/AIAnalyticsCard';
import { useAcademicSession } from '../../../services/academicSessionContext';
import { dataManager } from '../../../services/dataManager';
import { useAuth } from '../../../authentication/context/AuthContext';

const EliteStudentList = () => {
  const navigate = useNavigate();
  const { currentStandard, currentDivision } = useAcademicSession();
  const { hasPermission } = useAuth();
  const canWriteStudents = hasPermission('students:write');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await dataManager.getStudents({
        standard: currentStandard,
        division: currentDivision,
        limit: 100
      });
      setStudents(data.students || []);
    } catch (err) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentStandard, currentDivision]);

  const columns = [
    {
      key: 'name',
      label: 'Student',
      sortable: true,
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary-light)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--primary)',
            fontWeight: 700
          }}>
            {value.charAt(0)}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>{value}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Roll No: {row.rollNumber}</p>
          </div>
        </div>
      )
    },
    {
      key: 'gender',
      label: 'Gender',
      render: (value) => (
        <span style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'capitalize' }}>
          {value || 'N/A'}
        </span>
      )
    },
    {
      key: 'email',
      label: 'Contact Info',
      render: (value, row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Mail size={12} /> {value}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Phone size={12} /> {row.phone}
          </div>
        </div>
      )
    },
    {
      key: 'attendance',
      label: 'Attendance',
      sortable: true,
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
            <div style={{ 
              width: `${value}%`, 
              height: '100%', 
              backgroundColor: value > 90 ? 'var(--success)' : value > 75 ? 'var(--warning)' : 'var(--danger)',
              borderRadius: '3px'
            }} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{value}%</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <div style={{ display: 'flex', justifyContent: 'center', minWidth: '88px' }}>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/students/profile/${row.id}`);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '72px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap'
            }}
          >
            View
          </button>
        </div>
      )
    }
  ];

  const headerActions = [
    ...(canWriteStudents ? [{ label: 'Add Student', icon: UserPlus, variant: 'primary', onClick: () => navigate('/students/add') }] : []),
    { label: 'Export Data', icon: Download, variant: 'secondary', onClick: () => console.log('Export') }
  ];

  const breadcrumbs = [
    { label: 'Students', path: '/students' },
    { label: `Grade ${currentStandard}` }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <ElitePageHeader 
        title="Student Directory" 
        subtitle={`Viewing all students enrolled in Grade ${currentStandard} - Section ${currentDivision}`}
        breadcrumbs={breadcrumbs}
        actions={headerActions}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <EliteStatCard title="Total Students" value={students.length} icon={Users} sparkData={[20, 25, 22, 28, 26, 30, 28]} trend="+5% this term" />
        <EliteStatCard title="Avg Attendance" value="94.2%" icon={Calendar} color="success" sparkData={[92, 94, 93, 95, 94, 96, 94]} trend="+1.2% vs last month" />
        <EliteStatCard title="Top Performers" value="24" icon={GraduationCap} color="info" sparkData={[18, 20, 22, 19, 21, 24, 23]} trend="+2 new entries" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <EliteTable 
            title="Active Students" 
            columns={columns} 
            data={students} 
            itemsPerPage={10} 
            onRowClick={(row) => navigate(`/students/profile/${row.id}`)}
          />
        </div>
        <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <AIAnalyticsCard 
            type="class" 
            data={{ students }} 
            title="Class Performance Insight" 
          />
        </div>
        <div style={{ gridColumn: 'span 6' }}>
          <div className="card-premium" style={{ backgroundImage: 'var(--grad-dark)', color: 'white', border: 'none' }}>
            <h4 style={{ margin: 0, color: 'white' }}>Quick Filter</h4>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>Filter directory by performance tiers or attendance risk levels.</p>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', textAlign: 'left', fontSize: '0.875rem' }}>🔥 Top Performers (A+)</button>
              <button style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', textAlign: 'left', fontSize: '0.875rem' }}>⚠️ Attendance Risk</button>
              <button style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', textAlign: 'left', fontSize: '0.875rem' }}>📈 Improving Fast</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliteStudentList;
