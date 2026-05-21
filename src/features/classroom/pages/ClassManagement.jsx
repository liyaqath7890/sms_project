import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Filter, Search, Eye, Edit, Trash2, Mail } from 'lucide-react';
import { useAcademicSession } from '../../../services/academicSessionContext';
import {
  PremiumButton,
  PremiumCard,
  PremiumInput,
  PremiumTable,
  StatCard,
  SessionSwitcher
} from '../../../components/premium';

const ClassManagement = () => {
  const { currentStandard, currentDivision, getClassStudents } = useAcademicSession();
  const [students, setStudents] = useState(getClassStudents());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toString().includes(searchTerm);
    return matchesSearch;
  });

  // Calculate stats
  const maleCount = students.filter(s => s.gender === 'Male').length;
  const femaleCount = students.filter(s => s.gender === 'Female').length;
  const avgAttendance = (students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(1);

  const tableColumns = [
    {
      key: 'rollNumber',
      label: 'Roll No',
      sortable: true,
      align: 'center'
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      align: 'left'
    },
    {
      key: 'email',
      label: 'Email',
      sortable: false,
      align: 'left'
    },
    {
      key: 'gender',
      label: 'Gender',
      sortable: true,
      align: 'center',
      render: (value) => (
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          backgroundColor: value === 'Male' ? '#dbeafe' : '#fce7f3',
          color: value === 'Male' ? '#1e40af' : '#be185d',
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          {value}
        </span>
      )
    },
    {
      key: 'attendance',
      label: 'Attendance',
      sortable: true,
      align: 'center',
      render: (value) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#e5e7eb',
            borderRadius: '9999px',
            overflow: 'hidden',
            minWidth: '60px'
          }}>
            <div style={{
              height: '100%',
              width: `${value}%`,
              backgroundColor: value >= 90 ? '#10b981' : value >= 75 ? '#f59e0b' : '#ef4444',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <span style={{
            fontWeight: 600,
            fontSize: '0.875rem',
            color: value >= 90 ? '#10b981' : value >= 75 ? '#f59e0b' : '#ef4444'
          }}>
            {value}%
          </span>
        </div>
      )
    }
  ];

  const rowActions = [
    {
      label: 'View',
      color: '#3b82f6',
      onClick: (student) => {
        console.log('View', student);
      }
    },
    {
      label: 'Edit',
      color: '#f59e0b',
      onClick: (student) => {
        setEditingStudent(student);
        setShowAddModal(true);
      }
    },
    {
      label: 'Delete',
      color: '#ef4444',
      onClick: (student) => {
        setStudents(students.filter(s => s.id !== student.id));
      }
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ padding: '2rem' }}
    >
      {/* Header */}
      <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
          Class Management
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Manage students for Standard {currentStandard} - Division {currentDivision}
        </p>
      </motion.div>

      {/* Session Switcher */}
      <SessionSwitcher />

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        <StatCard
          label="Total Students"
          value={students.length}
          icon={require('lucide-react').Users}
          color="#3b82f6"
        />
        <StatCard
          label="Male"
          value={maleCount}
          icon={require('lucide-react').User}
          color="#3b82f6"
        />
        <StatCard
          label="Female"
          value={femaleCount}
          icon={require('lucide-react').User}
          color="#ec4899"
        />
        <StatCard
          label="Avg Attendance"
          value={`${avgAttendance}%`}
          icon={require('lucide-react').CalendarCheck}
          color="#10b981"
        />
      </motion.div>

      {/* Controls */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <PremiumInput
          placeholder="Search by name or roll number..."
          icon={Search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, minWidth: '250px' }}
        />
        <PremiumButton
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => {
            setEditingStudent(null);
            setShowAddModal(true);
          }}
        >
          Add Student
        </PremiumButton>
        <PremiumButton
          variant="secondary"
          size="md"
          icon={Download}
        >
          Export
        </PremiumButton>
      </motion.div>

      {/* Students Table */}
      <motion.div variants={itemVariants}>
        <PremiumCard>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
              Students List ({filteredStudents.length})
            </h3>
          </div>
          <PremiumTable
            columns={tableColumns}
            data={filteredStudents}
            rowActions={rowActions}
            pagination={true}
            itemsPerPage={10}
          />
        </PremiumCard>
      </motion.div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAddModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h2>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <PremiumInput
                label="Full Name"
                placeholder="Enter student name"
                defaultValue={editingStudent?.name || ''}
              />
              <PremiumInput
                label="Email"
                type="email"
                placeholder="Enter email address"
                defaultValue={editingStudent?.email || ''}
              />
              <PremiumInput
                label="Phone"
                placeholder="Enter phone number"
                defaultValue={editingStudent?.phone || ''}
              />
              <PremiumInput
                label="Date of Birth"
                type="date"
                defaultValue={editingStudent?.dateOfBirth || ''}
              />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <PremiumButton
                  variant="primary"
                  fullWidth
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAddModal(false);
                  }}
                >
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </PremiumButton>
                <PremiumButton
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </PremiumButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ClassManagement;
