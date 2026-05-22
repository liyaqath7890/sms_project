import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';
import AdvancedTable from '../../../components/custom/AdvancedTable';
import CustomButton from '../../../components/custom/CustomButton';
import CustomModal from '../../../components/custom/CustomModal';
import CustomInput from '../../../components/custom/CustomInput';
import { useAcademicSession } from '../../../services/academicSessionContext';

const GradeManagement = () => {
  const { grades, sections, currentSession } = useAcademicSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [formData, setFormData] = useState({ name: '', capacity: '', classteacher: '' });

  const gradeData = grades.map(grade => ({
    ...grade,
    sections: sections.filter(s => s.gradeId === grade.id).length,
    totalStudents: sections
      .filter(s => s.gradeId === grade.id)
      .reduce((sum, s) => sum + s.currentStrength, 0)
  }));

  const handleAddGrade = () => {
    setSelectedGrade(null);
    setFormData({ name: '', capacity: '', classteacher: '' });
    setIsModalOpen(true);
  };

  const handleEditGrade = (grade) => {
    setSelectedGrade(grade);
    setFormData({ name: grade.name, capacity: '45', classteacher: 'Teacher Name' });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // Save logic here
    setIsModalOpen(false);
    console.log('Saved:', formData);
  };

  return (
    <div className="animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <h1 style={{ fontSize: '1.875rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 700 }}>
            Grade Management
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage grades and classes for {currentSession?.name}
          </p>
        </div>

        <CustomButton
          icon={Plus}
          onClick={handleAddGrade}
        >
          Add Grade
        </CustomButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <AdvancedTable
          title="All Grades"
          columns={[
            { key: 'name', label: 'Grade Name' },
            {
              key: 'level',
              label: 'Level',
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
              key: 'sections',
              label: 'Sections',
              render: (value) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}>
                    {value}
                  </div>
                </div>
              )
            },
            {
              key: 'totalStudents',
              label: 'Total Students',
              render: (value) => (
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  {value} students
                </span>
              )
            }
          ]}
          data={gradeData}
          searchable
          sortable
          paginated
          itemsPerPage={8}
          onExport={() => console.log('Export grades')}
          rowActions={(row) => [
            <button
              key="edit"
              onClick={() => handleEditGrade(row)}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--primary-light)',
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
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--primary)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--primary-light)';
                e.target.style.color = 'var(--primary)';
              }}
            >
              <Edit size={14} />
              Edit
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
              Delete
            </button>
          ]}
        />
      </motion.div>

      {/* Modal */}
      <CustomModal
        isOpen={isModalOpen}
        title={selectedGrade ? `Edit ${selectedGrade.name}` : 'Add New Grade'}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <CustomInput
            label="Grade Name"
            placeholder="e.g., Grade 5"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <CustomInput
            label="Classroom Capacity"
            type="number"
            placeholder="45"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          />
          <CustomInput
            label="Class Teacher"
            placeholder="Teacher Name"
            value={formData.classteacher}
            onChange={(e) => setFormData({ ...formData, classteacher: e.target.value })}
          />
        </div>
      </CustomModal>
    </div>
  );
};

export default GradeManagement;
