import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import AdvancedTable from '../../../components/custom/AdvancedTable';
import CustomButton from '../../../components/custom/CustomButton';
import CustomModal from '../../../components/custom/CustomModal';
import CustomInput from '../../../components/custom/CustomInput';
import CustomDropdown from '../../../components/custom/CustomDropdown';
import { useAcademicSession } from '../../../services/academicSessionContext';

const SectionManagement = () => {
  const { grades, sections, currentSession } = useAcademicSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState(1);
  const [formData, setFormData] = useState({ section: '', classteacher: '', strength: '' });

  const filteredSections = sections.filter(s => s.gradeId === selectedGradeFilter);

  const gradeOptions = grades.map(g => ({ value: g.id, label: g.name }));

  const handleAddSection = () => {
    setSelectedSection(null);
    setFormData({ section: '', classteacher: '', strength: '' });
    setIsModalOpen(true);
  };

  const handleEditSection = (section) => {
    setSelectedSection(section);
    setFormData({
      section: section.section,
      classteacher: section.classTeacher,
      strength: section.currentStrength.toString()
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    console.log('Saved:', formData);
  };

  const getSectionCapacityPercent = (current, capacity) => {
    return Math.round((current / capacity) * 100);
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
            Section Management
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage class sections and student capacity
          </p>
        </div>

        <CustomButton
          icon={Plus}
          onClick={handleAddSection}
        >
          Add Section
        </CustomButton>
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
          title={`Sections - ${grades.find(g => g.id === selectedGradeFilter)?.name}`}
          columns={[
            {
              key: 'section',
              label: 'Section',
              render: (value, row) => (
                <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>
                  {row.gradeName} - {value}
                </span>
              )
            },
            {
              key: 'classTeacher',
              label: 'Class Teacher',
              render: (value) => (
                <span style={{ color: 'var(--text-main)' }}>
                  {value}
                </span>
              )
            },
            {
              key: 'currentStrength',
              label: 'Students',
              render: (value, row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '120px',
                    height: '6px',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${getSectionCapacityPercent(value, row.capacity)}%`,
                      height: '100%',
                      backgroundColor: 'var(--primary)',
                      borderRadius: '3px',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    minWidth: '45px'
                  }}>
                    {value}/{row.capacity}
                  </span>
                </div>
              )
            },
            {
              key: 'capacity',
              label: 'Capacity %',
              render: (value, row) => (
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: getSectionCapacityPercent(row.currentStrength, value) > 80 
                    ? 'rgba(239, 68, 68, 0.1)' 
                    : 'rgba(16, 185, 129, 0.1)',
                  color: getSectionCapacityPercent(row.currentStrength, value) > 80 
                    ? '#ef4444' 
                    : '#10b981',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  {getSectionCapacityPercent(row.currentStrength, value)}%
                </span>
              )
            }
          ]}
          data={filteredSections}
          searchable
          sortable
          paginated
          itemsPerPage={10}
          onExport={() => console.log('Export sections')}
          rowActions={(row) => [
            <button
              key="edit"
              onClick={() => handleEditSection(row)}
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
        title={selectedSection ? `Edit Section ${selectedSection.section}` : 'Add New Section'}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <CustomInput
            label="Section"
            placeholder="e.g., A, B, C"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
          />
          <CustomInput
            label="Class Teacher"
            placeholder="Teacher Name"
            value={formData.classteacher}
            onChange={(e) => setFormData({ ...formData, classteacher: e.target.value })}
          />
          <CustomInput
            label="Current Strength"
            type="number"
            placeholder="0"
            value={formData.strength}
            onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
          />
        </div>
      </CustomModal>
    </div>
  );
};

export default SectionManagement;
