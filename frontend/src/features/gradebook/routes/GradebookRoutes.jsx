import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EliteGradebook from '../pages/EliteGradebook';
import ReportCard from '../pages/ReportCard';

export default function GradebookRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EliteGradebook />} />
      <Route path="entry" element={<EliteGradebook />} />
      <Route path="report-card/:id" element={<ReportCard />} />
      <Route path="*" element={<Navigate to="/gradebook" replace />} />
    </Routes>
  );
}
