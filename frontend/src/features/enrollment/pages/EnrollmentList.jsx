import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Download, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle,
  MoreVertical
} from 'lucide-react';
import CustomTable from '../../../components/custom/CustomTable';
import CustomButton from '../../../components/custom/CustomButton';
import CustomDrawer from '../../../components/custom/CustomDrawer';
import NewAdmission from './NewAdmission';

const dummyEnrollments = [
  { id: 'APP001', name: 'James Wilson', grade: 'Grade 9', date: '2026-04-01', status: 'Pending', score: '85%' },
  { id: 'APP002', name: 'Sophia Chen', grade: 'Grade 10', date: '2026-04-03', status: 'Approved', score: '92%' },
  { id: 'APP003', name: 'Liam Garcia', grade: 'Grade 9', date: '2026-04-05', status: 'In Review', score: '78%' },
  { id: 'APP004', name: 'Emma Martinez', grade: 'Grade 11', date: '2026-04-06', status: 'Rejected', score: '64%' },
  { id: 'APP005', name: 'Oliver Taylor', grade: 'Grade 10', date: '2026-04-08', status: 'Approved', score: '88%' },
];

const EnrollmentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredData = dummyEnrollments.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      title: 'App ID', 
      key: 'id',
      render: (val) => <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{val}</span>
    },
    { title: 'Applicant', key: 'name' },
    { title: 'Target Grade', key: 'grade' },
    { title: 'Applied On', key: 'date' },
    { title: 'Entrance Score', key: 'score' },
    { 
      title: 'Status', 
      key: 'status',
      render: (val) => {
        let variant = 'warning';
        if (val === 'Approved') variant = 'success';
        if (val === 'Rejected') variant = 'danger';
        if (val === 'In Review') variant = 'info';
        return <span className={`badge badge-${variant}`}>{val}</span>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => <MoreVertical size={16} style={{ cursor: 'pointer', color: 'var(--text-light)' }} />
    }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Enrollment & Admissions</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track new student applications and admission status.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <CustomButton variant="outline" icon={Download}>Export API</CustomButton>
          <CustomButton variant="primary" icon={UserPlus} onClick={() => setDrawerOpen(true)}>New Admission</CustomButton>
        </div>
      </div>

      <CustomTable 
        columns={columns}
        data={filteredData}
        onSearch={setSearchTerm}
      />

      <CustomDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Student Admission Form"
        width="800px"
      >
        <NewAdmission onSuccess={() => setDrawerOpen(false)} />
      </CustomDrawer>
    </div>
  );
};

export default EnrollmentList;
