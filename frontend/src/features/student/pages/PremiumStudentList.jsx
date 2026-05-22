import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Mail, Phone, User, Search } from 'lucide-react';
import { useAcademicSession } from '../../../services/academicSessionContext';
import { dataManager } from '../../../services/dataManager';
import {
  PremiumButton,
  PremiumCard,
  PremiumInput,
  PremiumTable,
  StatCard,
  SessionSwitcher
} from '../../../components/premium';

const PremiumStudentList = () => {
  const { currentStandard, currentDivision } = useAcademicSession();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');

  // Fetch students data
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await dataManager.getStudents({
        standard: currentStandard,
        division: currentDivision,
        search: searchTerm || undefined,
        limit: 50
      });
      setStudents(data.students || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setError('Failed to load students data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentStandard, currentDivision, searchTerm]);

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toString().includes(searchTerm);
    const matchesGender = genderFilter === 'all' || student.gender === genderFilter;
    return matchesSearch && matchesGender;
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
      label: 'Student Name',
      sortable: true,
      align: 'left'
    },
    {
      key: 'email',
      label: 'Email',
      sortable: false,
      align: 'left',
      render: (value) => (
        <a href={`mailto:${value}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
          {value}
        </a>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: false,
      align: 'left',
      render: (value) => (
        <a href={`tel:${value}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
          {value}
        </a>
      )
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
            width: '60px',
            height: '6px',
            backgroundColor: '#e5e7eb',
            borderRadius: '9999px',
            overflow: 'hidden'
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
            color: value >= 90 ? '#10b981' : value >= 75 ? '#f59e0b' : '#ef4444',
            minWidth: '40px'
          }}>
            {value}%
          </span>
        </div>
      )
    }
  ];

  const rowActions = [
    {
      label: 'Contact',
      color: '#3b82f6',
      onClick: (student) => {
        console.log('Contact', student);
      }
    },
    {
      label: 'Edit',
      color: '#f59e0b',
      onClick: (student) => {
        console.log('Edit', student);
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
          Student Management
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
          icon={User}
          color="#3b82f6"
        />
        <StatCard
          label="Male Students"
          value={maleCount}
          icon={User}
          color="#3b82f6"
          trend={`${((maleCount/students.length)*100).toFixed(0)}%`}
        />
        <StatCard
          label="Female Students"
          value={femaleCount}
          icon={User}
          color="#ec4899"
          trend={`${((femaleCount/students.length)*100).toFixed(0)}%`}
        />
        <StatCard
          label="Avg Attendance"
          value={`${avgAttendance}%`}
          icon={User}
          color="#10b981"
        />
      </motion.div>

      {/* Filters & Controls */}
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
          placeholder="Search by name, email or roll number..."
          icon={Search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, minWidth: '250px' }}
        />

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Male', 'Female'].map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGenderFilter(filter === 'All' ? 'all' : filter)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: genderFilter === (filter === 'All' ? 'all' : filter) ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                backgroundColor: genderFilter === (filter === 'All' ? 'all' : filter) ? '#eff6ff' : 'white',
                color: genderFilter === (filter === 'All' ? 'all' : filter) ? '#3b82f6' : '#1f2937',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.875rem'
              }}
            >
              {filter}
            </motion.button>
          ))}
        </div>

        <PremiumButton
          variant="primary"
          size="md"
          icon={Plus}
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
              Students ({filteredStudents.length}/{students.length})
            </h3>
          </div>
          <PremiumTable
            columns={tableColumns}
            data={filteredStudents}
            rowActions={rowActions}
            pagination={true}
            itemsPerPage={15}
          />
        </PremiumCard>
      </motion.div>
    </motion.div>
  );
};

export default PremiumStudentList;
