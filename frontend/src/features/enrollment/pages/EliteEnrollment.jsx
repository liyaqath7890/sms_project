import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Search, 
  Download,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  ArrowRight
} from 'lucide-react';

import { ElitePageHeader, EliteTable, EliteStatCard } from '../../../components/elite';
import { dataManager } from '../../../services/dataManager';

const EliteEnrollment = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      // Mock data for enrollments
      const data = [
        { id: 1, name: 'Aryan Khanna', grade: 'Grade 5', date: '2024-05-01', status: 'Pending', email: 'aryan@example.com', phone: '9876543210' },
        { id: 2, name: 'Saira Bano', grade: 'Grade 1', date: '2024-05-02', status: 'Approved', email: 'saira@example.com', phone: '9876543211' },
        { id: 3, name: 'Kabir Singh', grade: 'Grade 8', date: '2024-05-03', status: 'Rejected', email: 'kabir@example.com', phone: '9876543212' },
        { id: 4, name: 'Ishita Iyer', grade: 'Grade 4', date: '2024-05-04', status: 'Pending', email: 'ishita@example.com', phone: '9876543213' },
        { id: 5, name: 'Zayan Malik', grade: 'Grade 10', date: '2024-05-05', status: 'Approved', email: 'zayan@example.com', phone: '9876543214' },
      ];
      setEnrollments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const columns = [
    {
      key: 'name',
      label: 'Applicant',
      sortable: true,
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: 'var(--radius-sm)', 
            backgroundColor: 'var(--bg-main)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 800,
            color: 'var(--primary)'
          }}>
            {value.charAt(0)}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700 }}>{value}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Applied: {row.date}</p>
          </div>
        </div>
      )
    },
    {
      key: 'grade',
      label: 'Applying For',
      sortable: true
    },
    {
      key: 'contact',
      label: 'Contact Info',
      render: (_, row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Mail size={12} /> {row.email}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Phone size={12} /> {row.phone}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors = {
          'Approved': 'badge-success',
          'Pending': 'badge-warning',
          'Rejected': 'badge-danger'
        };
        return <span className={`badge ${colors[value] || 'badge-info'}`}>{value}</span>;
      }
    }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <ElitePageHeader 
        title="Enrollment Center" 
        subtitle="Manage new admissions, process applications, and track your enrollment funnel in real-time."
        breadcrumbs={[{ label: 'Administration' }, { label: 'Enrollment' }]}
        actions={[
          { label: 'New Application', icon: UserPlus, variant: 'primary', onClick: () => {} },
          { label: 'Export List', icon: Download, variant: 'secondary', onClick: () => {} }
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <EliteStatCard title="Total Applied" value="124" icon={FileText} sparkData={[100, 110, 105, 115, 120, 124, 124]} trend="+14% this month" />
        <EliteStatCard title="Pending Review" value="38" icon={Clock} color="warning" sparkData={[20, 25, 30, 32, 35, 38, 38]} trend="Needs Attention" />
        <EliteStatCard title="Approved" value="72" icon={CheckCircle2} color="success" sparkData={[50, 55, 60, 65, 70, 72, 72]} trend="92% conversion" />
        <EliteStatCard title="Target Reach" value="84%" icon={ArrowRight} color="info" sparkData={[70, 75, 78, 80, 82, 84, 84]} trend="On track" />
      </div>

      <div className="card-premium" style={{ padding: 0 }}>
        <EliteTable 
          title="Admission Applications" 
          columns={columns} 
          data={enrollments} 
          itemsPerPage={10} 
        />
      </div>
    </div>
  );
};

export default EliteEnrollment;
