import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EliteClassroom from '../pages/EliteClassroom';

const ClassroomRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EliteClassroom />} />
      <Route path="*" element={<Navigate to="/classroom" replace />} />
    </Routes>
  );
};

export default ClassroomRoutes;
