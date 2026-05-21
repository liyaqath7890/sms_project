import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAcademicSession } from '../../../services/academicSessionContext';
import { dataManager } from '../../../services/dataManager';
import {
  PremiumButton,
  PremiumCard,
  PremiumTable,
  StatCard,
  SessionSwitcher,
  BarChart,
  LineChart
} from '../../../components/premium';

const PremiumAttendance = () => {
  const { currentStandard, currentDivision } = useAcademicSession();
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch attendance data
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await dataManager.getAttendanceByClass(currentStandard, currentDivision, selectedDate);
      setAttendanceData(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [currentStandard, currentDivision, selectedDate]);

  // Extract data for display
  const students = attendanceData?.attendance || [];
  const summary = attendanceData?.summary || { totalStudents: 0, present: 0, absent: 0, percentage: 0 };

  // Statistics
  const presentCount = summary.present;
  const absentCount = summary.absent;
  const attendancePercentage = summary.percentage;

  // Attendance trend data
  const attendanceTrend = [
    { label: 'Week 1', value: 92 },
    { label: 'Week 2', value: 88 },
    { label: 'Week 3', value: 95 },
    { label: 'Week 4', value: 90 },
    { label: 'Week 5', value: 94 }
  ];

  // Grade-wise attendance
  const gradeWiseAttendance = [
    { label: 'Std 1', value: 91 },
    { label: 'Std 2', value: 89 },
    { label: 'Std 3', value: 92 },
    { label: 'Std 4', value: 88 },
    { label: 'Std 5', value: 90 }
  ];

  const toggleAttendance = async (studentId) => {
    try {
      const currentStatus = students.find(s => s.studentId === studentId)?.status;
      const newStatus = currentStatus === 'present' ? 'absent' : 'present';

      await dataManager.markAttendance({
        studentId,
        date: selectedDate,
        status: newStatus,
        standard: currentStandard,
        division: currentDivision
      });

      // Refresh data
      fetchAttendance();
    } catch (err) {
      console.error('Failed to update attendance:', err);
    }
  };

  const tableColumns = [
    {
      key: 'rollNumber',
      label: 'Roll No',
      sortable: true,
      align: 'center'
    },
    {
      key: 'studentName',
      label: 'Student Name',
      sortable: true,
      align: 'left'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      align: 'center',
      render: (_, row) => {
        const status = row.status;
        return (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleAttendance(row.studentId)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: status === 'present' ? '#d1fae5' : '#fee2e2',
              color: status === 'present' ? '#059669' : '#dc2626',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto',
              fontSize: '0.875rem'
            }}
          >
            {status === 'present' ? (
              <>
                <CheckCircle size={18} />
                Present
              </>
            ) : (
              <>
                <XCircle size={18} />
                Absent
              </>
            )}
          </motion.button>
        );
      }
    },
    {
      key: 'attendance',
      label: 'Overall',
      sortable: true,
      align: 'center',
      render: (value) => (
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          backgroundColor: value >= 90 ? '#d1fae5' : value >= 75 ? '#fef3c7' : '#fee2e2',
          color: value >= 90 ? '#059669' : value >= 75 ? '#d97706' : '#dc2626',
          fontWeight: 700,
          fontSize: '0.875rem'
        }}>
          {value}%
        </span>
      )
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
          Attendance Management
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Track and manage attendance for Standard {currentStandard} - Division {currentDivision}
        </p>
      </motion.div>

      {/* Session Switcher */}
      <SessionSwitcher />

      {/* Date Selector */}
      <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
        <PremiumCard gradient>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#6b7280' }}>
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid #e5e7eb',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  marginTop: '0.5rem'
                }}
              />
            </div>
            <PremiumButton variant="primary" size="md" icon={Download}>
              Save Attendance
            </PremiumButton>
          </div>
        </PremiumCard>
      </motion.div>

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
          label="Present"
          value={presentCount}
          icon={CheckCircle}
          color="#10b981"
          trend={`${attendancePercentage}%`}
          trendDirection="up"
        />
        <StatCard
          label="Absent"
          value={absentCount}
          icon={XCircle}
          color="#ef4444"
        />
        <StatCard
          label="Class Attendance"
          value={`${attendancePercentage}%`}
          icon={require('lucide-react').CalendarCheck}
          color="#f59e0b"
        />
      </motion.div>

      {/* Charts */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        <PremiumCard gradient>
          <LineChart
            data={attendanceTrend}
            label="Weekly Attendance Trend"
            color="#3b82f6"
          />
        </PremiumCard>

        <PremiumCard gradient>
          <BarChart
            data={gradeWiseAttendance}
            label="Grade-wise Attendance"
            color="#10b981"
          />
        </PremiumCard>
      </motion.div>

      {/* Attendance Table */}
      <motion.div variants={itemVariants}>
        <PremiumCard>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
              Mark Attendance - {selectedDate}
            </h3>
            <PremiumButton
              variant="primary"
              size="sm"
              icon={CheckCircle}
            >
              Mark All Present
            </PremiumButton>
          </div>
          <PremiumTable
            columns={tableColumns}
            data={students}
            pagination={true}
            itemsPerPage={15}
          />
        </PremiumCard>
      </motion.div>
    </motion.div>
  );
};

export default PremiumAttendance;
