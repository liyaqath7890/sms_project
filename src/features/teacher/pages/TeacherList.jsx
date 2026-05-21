import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Filter, Mail, Phone, BookOpen } from 'lucide-react';
import CustomTable from '../../../components/custom/CustomTable';
import CustomButton from '../../../components/custom/CustomButton';
import CustomDrawer from '../../../components/custom/CustomDrawer';
import AddTeacher from './AddTeacher';

const dummyTeachers = [
  { id: '1', name: 'Dr. Sarah Wilson', subject: 'Mathematics', email: 's.wilson@school.com', phone: '+1 555-0101', status: 'Active', designation: 'Head of Dept' },
  { id: '2', name: 'Prof. James Brown', subject: 'Physics', email: 'j.brown@school.com', phone: '+1 555-0102', status: 'Active', designation: 'Senior Teacher' },
  { id: '3', name: 'Mrs. Emily Davis', subject: 'English', email: 'e.davis@school.com', phone: '+1 555-0103', status: 'On Leave', designation: 'Teacher' },
  { id: '4', name: 'Mr. Michael Ross', subject: 'History', email: 'm.ross@school.com', phone: '+1 555-0104', status: 'Active', designation: 'Teacher' },
  { id: '5', name: 'Ms. Clara Barton', subject: 'Biology', email: 'c.barton@school.com', phone: '+1 555-0105', status: 'Active', designation: 'Junior Teacher' },
];

import { exportToCSV } from '../../../utils/csvExport';
import { TableSkeleton } from '../../../components/common/SkeletonLoader';
import { Download } from 'lucide-react';

const TeacherList = () => {
  const [teachers, setTeachers] = useState(dummyTeachers);
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenAdd = () => {
    setSelectedTeacherId(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleExport = () => {
    exportToCSV(teachers, 'teacher_list.csv');
  };

  const handleAddSuccess = (newTeacher) => {
    const teacherWithId = {
      ...newTeacher,
      id: String(teachers.length + 1),
      status: 'Active',
      designation: newTeacher.designation || 'Teacher'
    };
    setTeachers(prev => [teacherWithId, ...prev]);
    handleCloseDrawer();
  };

  const filteredData = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.subject && teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (teacher.email && teacher.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    { 
      title: 'Teacher Name', 
      key: 'name',
      render: (value, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.875rem'
          }}>
            {value.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p style={{ fontWeight: 600, margin: 0 }}>{value}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: 0 }}>{record.designation}</p>
          </div>
        </div>
      )
    },
    { 
      title: 'Subject', 
      key: 'subject',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={14} color="var(--primary)" />
          <span>{value}</span>
        </div>
      )
    },
    { title: 'Email', key: 'email' },
    { 
      title: 'Status', 
      key: 'status',
      render: (value) => (
        <span className={`badge badge-${value === 'Active' ? 'success' : 'warning'}`}>
          {value}
        </span>
      )
    },
    { title: 'Phone', key: 'phone' }
  ];

  if (isLoading) return <TableSkeleton rows={8} cols={5} />;

  return (
    <div className="animate-fade-in">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Teachers</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage faculty profiles and academic assignments.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <CustomButton variant="outline" icon={Download} onClick={handleExport}>Export List</CustomButton>
          <CustomButton 
            variant="primary" 
            icon={UserPlus}
            onClick={handleOpenAdd}
          >
            Add New Teacher
          </CustomButton>
        </div>
      </div>

      <CustomTable 
        columns={columns}
        data={filteredData}
        onSearch={setSearchTerm}
        onRowClick={(row) => alert(`Opening profile for ${row.name} in drawer...`)}
      />

      <CustomDrawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        title="Add New Teacher"
        width="600px"
      >
        <AddTeacher onSuccess={handleAddSuccess} />
      </CustomDrawer>
    </div>
  );
};

export default TeacherList;
