import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, TrendingUp, Award } from 'lucide-react';
import { useAcademicSession } from '../../../services/academicSessionContext';
import AIAnalyticsCard from '../../../components/custom/AIAnalyticsCard';
import {
  PremiumButton,
  PremiumCard,
  PremiumInput,
  PremiumTable,
  StatCard,
  SessionSwitcher,
  BarChart,
  LineChart
} from '../../../components/premium';

const PremiumGradebook = () => {
  const { currentStandard, currentDivision, getSubjectsForStandard, getClassStudents } = useAcademicSession();
  const [students, setStudents] = useState(getClassStudents());
  const [selectedSubject, setSelectedSubject] = useState(getSubjectsForStandard(currentStandard)[0]);
  const [gradeView, setGradeView] = useState('class'); // 'class' or 'student'
  const subjects = getSubjectsForStandard(currentStandard);

  // Mock grades data
  const mockGrades = students.map(student => ({
    ...student,
    grades: subjects.reduce((acc, subject) => {
      acc[subject] = Math.floor(Math.random() * 30) + 70;
      return acc;
    }, {})
  }));

  // Calculate statistics
  const classAverage = (
    mockGrades.reduce((sum, s) => sum + (s.grades[selectedSubject] || 0), 0) / students.length
  ).toFixed(2);

  const toppers = [...mockGrades]
    .sort((a, b) => (b.grades[selectedSubject] || 0) - (a.grades[selectedSubject] || 0))
    .slice(0, 5);

  const gradeDistribution = [
    { label: 'A+ (90-100)', value: mockGrades.filter(s => s.grades[selectedSubject] >= 90).length },
    { label: 'A (80-89)', value: mockGrades.filter(s => s.grades[selectedSubject] >= 80 && s.grades[selectedSubject] < 90).length },
    { label: 'B (70-79)', value: mockGrades.filter(s => s.grades[selectedSubject] >= 70 && s.grades[selectedSubject] < 80).length },
    { label: 'C (60-69)', value: mockGrades.filter(s => s.grades[selectedSubject] >= 60 && s.grades[selectedSubject] < 70).length },
    { label: 'Below 60', value: mockGrades.filter(s => s.grades[selectedSubject] < 60).length }
  ];

  const performanceTrend = [
    { label: 'Unit 1', value: 72 },
    { label: 'Unit 2', value: 75 },
    { label: 'Unit 3', value: 78 },
    { label: 'Unit 4', value: 81 },
    { label: 'Mid Term', value: 79 }
  ];

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
      key: 'grade',
      label: selectedSubject,
      sortable: true,
      align: 'center',
      render: (_, row) => {
        const grade = row.grades[selectedSubject];
        let color = '#10b981';
        if (grade < 60) color = '#ef4444';
        else if (grade < 70) color = '#f59e0b';
        else if (grade < 80) color = '#3b82f6';

        return (
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: color + '15',
            color: color,
            fontWeight: 700,
            fontSize: '0.875rem'
          }}>
            {grade}
          </span>
        );
      }
    },
    {
      key: 'avgGrade',
      label: 'Avg Grade',
      sortable: true,
      align: 'center',
      render: (_, row) => {
        const avg = (Object.values(row.grades).reduce((a, b) => a + b, 0) / subjects.length).toFixed(1);
        return (
          <span style={{
            fontWeight: 700,
            color: '#3b82f6'
          }}>
            {avg}
          </span>
        );
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
          Gradebook
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Manage and analyze grades for Standard {currentStandard} - Division {currentDivision}
        </p>
      </motion.div>

      {/* Session Switcher */}
      <SessionSwitcher />

      {/* Subject Selector */}
      <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
        <PremiumCard gradient>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', margin: 0, marginBottom: '1rem' }}>
            Select Subject
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '0.75rem'
          }}>
            {subjects.map((subject) => (
              <motion.button
                key={subject}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSubject(subject)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: selectedSubject === subject ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                  backgroundColor: selectedSubject === subject ? '#eff6ff' : 'white',
                  color: selectedSubject === subject ? '#3b82f6' : '#1f2937',
                  fontWeight: selectedSubject === subject ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {subject}
              </motion.button>
            ))}
          </div>
        </PremiumCard>
      </motion.div>

      {/* Stats */}
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
          label="Class Average"
          value={classAverage}
          icon={TrendingUp}
          color="#3b82f6"
        />
        <StatCard
          label="Highest Score"
          value={Math.max(...mockGrades.map(s => s.grades[selectedSubject] || 0))}
          icon={Award}
          color="#10b981"
        />
        <StatCard
          label="Lowest Score"
          value={Math.min(...mockGrades.map(s => s.grades[selectedSubject] || 0))}
          icon={Award}
          color="#ef4444"
        />
        <StatCard
          label="Pass Rate"
          value={`${((mockGrades.filter(s => s.grades[selectedSubject] >= 60).length / students.length) * 100).toFixed(1)}%`}
          icon={TrendingUp}
          color="#f59e0b"
        />
      </motion.div>

      {/* AI Insights */}
      <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
        <AIAnalyticsCard type="class" data={{ classId: currentStandard + '-' + currentDivision, grades: mockGrades.map(s => ({ marks: s.grades[selectedSubject] || 0 })) }} title="AI Gradebook Insights" />
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
          <BarChart
            data={gradeDistribution}
            label="Grade Distribution"
            color="#3b82f6"
          />
        </PremiumCard>

        <PremiumCard gradient>
          <LineChart
            data={performanceTrend}
            label="Class Performance Trend"
            color="#10b981"
          />
        </PremiumCard>
      </motion.div>

      {/* Gradebook Table */}
      <motion.div variants={itemVariants}>
        <PremiumCard>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
              {selectedSubject} - Grades
            </h3>
            <PremiumButton
              variant="secondary"
              size="sm"
              icon={Download}
            >
              Export
            </PremiumButton>
          </div>
          <PremiumTable
            columns={tableColumns}
            data={mockGrades}
            pagination={true}
            itemsPerPage={10}
          />
        </PremiumCard>
      </motion.div>

      {/* Toppers Section */}
      <motion.div
        variants={itemVariants}
        style={{ marginTop: '2rem' }}
      >
        <PremiumCard gradient>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>
            Top Performers in {selectedSubject}
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {toppers.map((student, idx) => (
              <motion.div
                key={student.id}
                whileHover={{ y: -4 }}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'white',
                  border: '2px solid #e5e7eb',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: ['#fbbf24', '#c0c0c0', '#cd7f32'][idx] || '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  {'🥇🥈🥉'[idx] || '⭐'}
                </div>
                <p style={{ fontWeight: 700, color: '#1f2937', margin: '0.5rem 0 0 0' }}>
                  {student.name}
                </p>
                <p style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#3b82f6',
                  margin: '0.5rem 0'
                }}>
                  {student.grades[selectedSubject]}
                </p>
              </motion.div>
            ))}
          </div>
        </PremiumCard>
      </motion.div>
    </motion.div>
  );
};

export default PremiumGradebook;
