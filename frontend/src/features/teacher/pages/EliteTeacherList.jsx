import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Download, 
  Mail, 
  Phone, 
  BookOpen, 
  Search,
  Award,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';

import { ElitePageHeader, EliteTable, EliteStatCard } from '../../../components/elite';
import AIAnalyticsCard from '../../../components/custom/AIAnalyticsCard';
import { dataManager } from '../../../services/dataManager';
import { useAuth } from '../../../authentication/context/AuthContext';

const EliteTeacherList = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const canWriteTeachers = hasPermission('teachers:write');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await dataManager.getTeachers({ force: true });
      setTeachers(data.teachers || []);
    } catch (err) {
      setError('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const columns = [
    {
      key: 'name',
      label: 'Teacher',
      sortable: true,
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: 'var(--primary-light)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--primary)',
            fontWeight: 800,
            fontSize: '1.125rem'
          }}>
            {value.charAt(0)}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>{value}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.designation || 'Senior Faculty'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'subject',
      label: 'Specialization',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={14} className="text-info" />
          <span style={{ fontWeight: 600 }}>{value || row.qualification || 'Not assigned'}</span>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Contact',
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
      key: 'experience',
      label: 'Experience',
      sortable: true,
      render: (value) => (
        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{value || '8'} Years</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#059669' }}>Active</span>
        </div>
      )
    }
  ];

  const headerActions = [
    ...(canWriteTeachers ? [{ label: 'Add Teacher', icon: UserPlus, variant: 'primary', onClick: () => navigate('/teachers/add') }] : []),
    { label: 'Export Directory', icon: Download, variant: 'secondary', onClick: () => console.log('Export') }
  ];

  const breadcrumbs = [
    { label: 'Administration' },
    { label: 'Teachers' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <ElitePageHeader 
        title="Faculty Directory" 
        subtitle="Manage and oversee all teaching staff, their specializations, and performance metrics."
        breadcrumbs={breadcrumbs}
        actions={headerActions}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <EliteStatCard title="Total Faculty" value={teachers.length || 84} icon={Users} sparkData={[78, 80, 82, 84, 83, 84, 84]} trend="+2 this month" />
        <EliteStatCard title="Dept. Heads" value="12" icon={Award} color="info" sparkData={[10, 10, 11, 11, 12, 12, 12]} trend="Stable" />
        <EliteStatCard title="On Campus" value={Math.floor((teachers.length || 84) * 0.92)} icon={CheckCircle2} color="success" sparkData={[75, 78, 80, 77, 81, 79, 82]} trend="92% Present" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
        <div style={{ gridColumn: 'span 9' }}>
          <EliteTable 
            title="Faculty List" 
            columns={columns} 
            data={teachers} 
            itemsPerPage={12} 
            onRowClick={(row) => console.log('View Profile', row.id)}
          />
        </div>
        <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card-premium" style={{ backgroundImage: 'var(--grad-primary)', color: 'white', border: 'none' }}>
            <h3 style={{ color: 'white', fontSize: '1.125rem' }}>Faculty AI Summary</h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
              84% of faculty are meeting their syllabus completion targets. Math department has the highest engagement score this week.
            </p>
            <button style={{ 
              marginTop: '1.5rem', 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: 'white', 
              color: 'var(--primary)', 
              fontWeight: 700,
              fontSize: '0.875rem'
            }}>
              View Full Report
            </button>
          </div>

          <AIAnalyticsCard 
            type="teacher" 
            data={{ teachers }} 
            title="Teaching Efficiency" 
          />
        </div>
      </div>
    </div>
  );
};

export default EliteTeacherList;
