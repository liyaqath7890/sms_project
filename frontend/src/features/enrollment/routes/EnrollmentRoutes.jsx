import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EliteEnrollment from '../pages/EliteEnrollment';

const EnrollmentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EliteEnrollment />} />
      <Route path="*" element={<Navigate to="/enrollment" replace />} />
    </Routes>
  );
};

export default EnrollmentRoutes;
