import React, { createContext, useContext, useState, useEffect } from 'react';

const AcademicSessionContext = createContext();

// Standards with subjects and divisions
const STANDARDS_DATA = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  number: i + 1,
  name: `Standard ${i + 1}`,
  shortName: `Std ${i + 1}`,
  divisions: ['A', 'B', 'C'],
  subjects: i + 1 <= 2 
    ? ['English', 'Hindi', 'Mathematics', 'EVS', 'Physical Education', 'Art']
    : i + 1 <= 5
    ? ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Physical Education', 'Art', 'Computer']
    : ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Physical Education', 'Chemistry', 'Biology', 'Physics', 'Computer Science']
}));

// Academic Sessions (2023-2024, 2024-2025, 2025-2026)
const SESSIONS_DATA = [
  {
    id: 'session_2023_2024',
    name: '2023-24',
    year: 2023,
    startDate: '2023-04-01',
    endDate: '2024-03-31',
    status: 'completed',
    totalStudents: 3450,
    totalTeachers: 156,
    totalClasses: 30
  },
  {
    id: 'session_2024_2025',
    name: '2024-25',
    year: 2024,
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    status: 'active',
    totalStudents: 3680,
    totalTeachers: 165,
    totalClasses: 30
  },
  {
    id: 'session_2025_2026',
    name: '2025-26',
    year: 2025,
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    status: 'upcoming',
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0
  }
];

export const AcademicSessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState(SESSIONS_DATA);
  const [currentSession, setCurrentSession] = useState(SESSIONS_DATA[1]); // Active session
  const [currentStandard, setCurrentStandard] = useState(1);
  const [currentDivision, setCurrentDivision] = useState('A');
  const [standards, setStandards] = useState(STANDARDS_DATA);

  // Get all standards
  const getStandards = () => standards;

  // Get standard by number
  const getStandardByNumber = (standardNumber) => {
    return standards.find(s => s.number === standardNumber);
  };

  // Get subjects for a standard
  const getSubjectsForStandard = (standardNumber) => {
    const standard = getStandardByNumber(standardNumber);
    return standard?.subjects || [];
  };

  // Get divisions for a standard
  const getDivisionsForStandard = (standardNumber) => {
    const standard = getStandardByNumber(standardNumber);
    return standard?.divisions || ['A', 'B', 'C'];
  };

  // Switch session
  const switchSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
      setCurrentStandard(1);
      setCurrentDivision('A');
    }
  };

  // Switch standard
  const switchStandard = (standardNumber) => {
    if (standardNumber >= 1 && standardNumber <= 10) {
      setCurrentStandard(standardNumber);
      const divisions = getDivisionsForStandard(standardNumber);
      setCurrentDivision(divisions[0] || 'A');
    }
  };

  // Switch division
  const switchDivision = (division) => {
    const divisions = getDivisionsForStandard(currentStandard);
    if (divisions.includes(division)) {
      setCurrentDivision(division);
    }
  };

  // Get current class info
  const getCurrentClassInfo = () => {
    return {
      standard: currentStandard,
      division: currentDivision,
      subjects: getSubjectsForStandard(currentStandard),
      students: Math.floor(Math.random() * 15) + 30,
      teachers: Math.floor(Math.random() * 3) + 5
    };
  };

  // Get session status color
  const getSessionStatusColor = (status) => {
    const colors = {
      'active': '#10b981',
      'completed': '#6b7280',
      'upcoming': '#f59e0b'
    };
    return colors[status] || '#3b82f6';
  };

  // Get all students for current class (mock data)
  const getClassStudents = () => {
    const studentCount = Math.floor(Math.random() * 15) + 30;
    return Array.from({ length: studentCount }, (_, i) => ({
      id: `student_${i + 1}`,
      rollNumber: i + 1,
      name: `Student ${i + 1}`,
      email: `student${i + 1}@school.com`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      fatherName: `Father ${i + 1}`,
      motherName: `Mother ${i + 1}`,
      dateOfBirth: '2010-05-15',
      gender: i % 2 === 0 ? 'Male' : 'Female',
      address: `Address ${i + 1}`,
      admissionDate: '2020-04-01',
      attendance: Math.floor(Math.random() * 15) + 85
    }));
  };

  const value = {
    sessions,
    currentSession,
    currentStandard,
    currentDivision,
    standards,
    grades: standards, // Alias for backward compatibility
    switchSession,
    switchStandard,
    switchDivision,
    getStandards,
    getStandardByNumber,
    getSubjectsForStandard,
    getDivisionsForStandard,
    getCurrentClassInfo,
    getSessionStatusColor,
    getClassStudents
  };

  return (
    <AcademicSessionContext.Provider value={value}>
      {children}
    </AcademicSessionContext.Provider>
  );
};

export const useAcademicSession = () => {
  const context = useContext(AcademicSessionContext);
  if (!context) {
    throw new Error('useAcademicSession must be used within AcademicSessionProvider');
  }
  return context;
};
