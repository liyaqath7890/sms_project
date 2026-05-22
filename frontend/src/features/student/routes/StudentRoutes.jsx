import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EliteStudentList from '../pages/EliteStudentList';
import EliteAddStudent from '../pages/EliteAddStudent';
import StudentProfile from '../pages/StudentProfile';

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EliteStudentList />} />
      <Route path="add" element={<EliteAddStudent />} />
      <Route path="profile/:id" element={<StudentProfile />} />
      <Route path="*" element={<Navigate to="/students" replace />} />
    </Routes>
  );
};

export default StudentRoutes;
