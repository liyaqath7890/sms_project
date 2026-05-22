import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EliteTeacherList from '../pages/EliteTeacherList';
import EliteAddTeacher from '../pages/EliteAddTeacher';
import ProtectedRoute from '../../../components/common/ProtectedRoute';

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EliteTeacherList />} />
      <Route path="add" element={<ProtectedRoute permissions={['teachers:write']}><EliteAddTeacher /></ProtectedRoute>} />
      <Route path="profile/:id" element={<EliteTeacherList />} /> {/* Using Elite List as placeholder for profile for now */}
      <Route path="*" element={<Navigate to="/teachers" replace />} />
    </Routes>
  );
};

export default TeacherRoutes;
