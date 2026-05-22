import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EliteAssignments from '../pages/EliteAssignments';
import EliteAddAssignment from '../pages/EliteAddAssignment';

const AssignmentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EliteAssignments />} />
      <Route path="add" element={<EliteAddAssignment />} />
      <Route path="*" element={<Navigate to="/assignments" replace />} />
    </Routes>
  );
};

export default AssignmentRoutes;
