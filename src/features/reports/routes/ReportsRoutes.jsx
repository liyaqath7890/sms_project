import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EliteReports from '../pages/EliteReports';

export default function ReportsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EliteReports />} />
      <Route path="*" element={<Navigate to="/reports" replace />} />
    </Routes>
  );
}
