import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Download, Eye, Mail } from 'lucide-react';
import AdvancedTable from '../../../components/custom/AdvancedTable';
import CustomButton from '../../../components/custom/CustomButton';
import CustomModal from '../../../components/custom/CustomModal';
import CustomInput from '../../../components/custom/CustomInput';
import CustomDropdown from '../../../components/custom/CustomDropdown';
import { useAcademicSession } from '../../../services/academicSessionContext';

const StudentListManagement = () => {
  const { grades, sections, currentSession } = useAcademicSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    parentPhone: '',
    section: ''
  });

  // Mock student data
  const mockStudents = [
    { id: 1, name: 'Aarav Kumar', rollNo: '001', email: 'aarav@school.com', parentPhone: '+91-98765-43210', section: 'A', grade: 5, status: 'Active', joinDate: '2024-04-15' },
    { id: 2, name: 'Priya Sharma', rollNo: '002', email: 'priya@school.com', parentPhone: '+91-98765-43211', section: 'A', grade: 5, status: 'Active', joinDate: '2024-04-16' },
    { id: 3, name: 'Rohan Singh', rollNo: '003', email: 'rohan@school.com', parentPhone: '+91-98765-43212', section: 'B', grade: 5, status: 'Inactive', joinDate: '2024-05-01' },
    { id: 4, name: 'Divya Patel', rollNo: '004', email: 'divya@school.com', parentPhone: '+91-98765-43213', section: 'A', grade: 5, status: 'Active', joinDate: '2024-05-10' },
    { id: 5, name: 'Ananya Gupta', rollNo: '005', email: 'ananya@school.com', parentPhone: '+91-98765-43214', section: 'C', grade: 5, status: 'Active', joinDate: '2024-06-01' },
    { id: 6, name: 'Vikram Desai', rollNo: '006', email: 'vikram@school.com', parentPhone: '+91-98765-43215', section: 'B', grade: 5, status: 'Active', joinDate: '2024-06-05' },
  ];

  const filteredStudents = mockStudents.filter(s => s.grade === selectedGradeFilter);

  const gradeOptions = grades.map(g => ({ value: g.id, label: g.name }));

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setFormData({ name: '', email: '', rollNo: '', parentPhone: '', section: '' });
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      rollNo: student.rollNo,
      parentPhone: student.parentPhone,
      section: student.section
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    console.log('Saved:', formData);
  };

  const handleExportStudents = () => {
    console.log('Export students to CSV');
  };

  return (
    <div className="animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <h1 style={{ fontSize: '1.875rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 700 }}>
            Student Management
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage all students for {currentSession?.name}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <CustomButton
            icon={Download}
            onClick={handleExportStudents}
            variant="secondary"
          >
            Export
          </CustomButton>
          <CustomButton
            icon={Plus}
            onClick={handleAddStudent}
          >
            Add Student
          </CustomButton>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{ marginBottom: '2rem', maxWidth: '250px' }}
      >
        <CustomDropdown
          label="Filter by Grade"
          options={gradeOptions}
          value={selectedGradeFilter}
          onChange={setSelectedGradeFilter}
          fullWidth
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <AdvancedTable
          title={`Students - ${grades.find(g => g.id === selectedGradeFilter)?.name}`}
          columns={[
            {
              key: 'name',
              label: 'Student Name',
              render: (value) => (
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  {value}
                </span>
              )
            },
            {
              key: 'rollNo',
              label: 'Roll No.',
              render: (value) => (
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  {value}
                </span>
              )
            },
            {
              key: 'section',
              label: 'Section',
              render: (value) => (
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Section {value}
                </span>
              )
            },
            {
              key: 'email',
              label: 'Email'
            },
            {
              key: 'status',
              label: 'Status',
              render: (value) => (
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: value === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                  color: value === 'Active' ? '#10b981' : '#6b7280',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {value}
                </span>
              )
            },
            {
              key: 'joinDate',
              label: 'Join Date'
            }
          ]}
          data={filteredStudents}
          searchable
          sortable
          paginated
          itemsPerPage={10}
          onExport={handleExportStudents}
          rowActions={(row) => [
            <button
              key="view"
              onClick={() => console.log('View', row.id)}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid var(--primary)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--primary)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.75rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              title="View Details"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--primary)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                e.target.style.color = 'var(--primary)';
              }}
            >
              <Eye size={14} />
            </button>,
            <button
              key="edit"
              onClick={() => handleEditStudent(row)}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid #f59e0b',
                borderRadius: 'var(--radius-sm)',
                color: '#f59e0b',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.75rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              title="Edit"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f59e0b';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
                e.target.style.color = '#f59e0b';
              }}
            >
              <Edit size={14} />
            </button>,
            <button
              key="mail"
              onClick={() => console.log('Send email', row.email)}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid #8b5cf6',
                borderRadius: 'var(--radius-sm)',
                color: '#8b5cf6',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.75rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              title="Send Email"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#8b5cf6';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                e.target.style.color = '#8b5cf6';
              }}
            >
              <Mail size={14} />
            </button>,
            <button
              key="delete"
              onClick={() => console.log('Delete', row.id)}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                borderRadius: 'var(--radius-sm)',
                color: '#ef4444',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.75rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              title="Delete"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#ef4444';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                e.target.style.color = '#ef4444';
              }}
            >
              <Trash2 size={14} />
            </button>
          ]}
        />
      </motion.div>

      {/* Modal */}
      <CustomModal
        isOpen={isModalOpen}
        title={selectedStudent ? `Edit ${selectedStudent.name}` : 'Add New Student'}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <CustomInput
            label="Full Name"
            placeholder="Student Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <CustomInput
            label="Email"
            type="email"
            placeholder="student@school.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <CustomInput
            label="Roll Number"
            placeholder="001"
            value={formData.rollNo}
            onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
          />
          <CustomInput
            label="Parent Phone"
            placeholder="+91-XXXXX-XXXXX"
            value={formData.parentPhone}
            onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
          />
          <CustomInput
            label="Section"
            placeholder="A"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
          />
        </div>
      </CustomModal>
    </div>
  );
};

export default StudentListManagement;
