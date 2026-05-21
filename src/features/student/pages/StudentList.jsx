import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Filter, Download, BookOpen } from 'lucide-react';
import CustomTable from '../../../components/custom/CustomTable';
import CustomButton from '../../../components/custom/CustomButton';
import CustomDrawer from '../../../components/custom/CustomDrawer';
import AddStudent from './AddStudent';
import StudentProfile from './StudentProfile';

const dummyStudents = [
  { id: '1', name: 'Alice Smith', class: 'Grade 10-A', email: 'alice@school.com', status: 'Active', phone: '+1 234 567 890' },
  { id: '2', name: 'Bob Johnson', class: 'Grade 11-B', email: 'bob@school.com', status: 'Inactive', phone: '+1 234 567 891' },
  { id: '3', name: 'Charlie Brown', class: 'Grade 9-C', email: 'charlie@school.com', status: 'Active', phone: '+1 234 567 892' },
  { id: '4', name: 'Diana Prince', class: 'Grade 12-A', email: 'diana@school.com', status: 'Active', phone: '+1 234 567 893' },
  { id: '5', name: 'Edward Norton', class: 'Grade 10-B', email: 'edward@school.com', status: 'Inactive', phone: '+1 234 567 894' },
];

import { exportToCSV } from '../../../utils/csvExport';
import { TableSkeleton } from '../../../components/common/SkeletonLoader';

const StudentList = () => {
  const [students, setStudents] = useState(dummyStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial load
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenAdd = () => {
    setDrawerType('add');
    setDrawerOpen(true);
  };

  const handleOpenProfile = (id) => {
    setSelectedStudentId(id);
    setDrawerType('profile');
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedStudentId(null);
  };

  const handleExport = () => {
    exportToCSV(students, 'student_list.csv');
  };

  const handleAddSuccess = (newStudent) => {
    const studentWithId = {
      ...newStudent,
      id: String(students.length + 1),
      status: 'Active',
      class: newStudent.class || 'N/A'
    };
    setStudents(prev => [studentWithId, ...prev]);
    handleCloseDrawer();
  };

  const filteredData = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.class && student.class.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    { 
      title: 'Student Name', 
      key: 'name',
      render: (value, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.75rem'
          }}>
            {value.split(' ').map(n => n[0]).join('')}
          </div>
          <span style={{ fontWeight: 600 }}>{value}</span>
        </div>
      )
    },
    { title: 'Class', key: 'class' },
    { title: 'Email', key: 'email' },
    { 
      title: 'Status', 
      key: 'status',
      render: (value) => (
        <span className={`badge badge-${value === 'Active' ? 'success' : 'danger'}`}>
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
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Students</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage and monitor student enrollments.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <CustomButton variant="outline" icon={Download} onClick={handleExport}>Export List</CustomButton>
          <CustomButton 
            variant="primary" 
            icon={UserPlus}
            onClick={handleOpenAdd}
          >
            Add New Student
          </CustomButton>
        </div>
      </div>

      <CustomTable 
        columns={columns}
        data={filteredData}
        onSearch={setSearchTerm}
        onRowClick={(row) => handleOpenProfile(row.id)}
      />

      <CustomDrawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        title={drawerType === 'add' ? 'Add New Student' : 'Student Profile'}
        width={drawerType === 'add' ? '600px' : '900px'}
      >
        {drawerType === 'add' ? (
          <AddStudent onSuccess={handleAddSuccess} />
        ) : (
          <StudentProfile id={selectedStudentId} />
        )}
      </CustomDrawer>
    </div>
  );
};

export default StudentList;
