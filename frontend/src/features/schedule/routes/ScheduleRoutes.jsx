import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EliteSchedule from '../pages/EliteSchedule';
import EliteAddSchedule from '../pages/EliteAddSchedule';

export default function ScheduleRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EliteSchedule />} />
      <Route path="add" element={<EliteAddSchedule />} />
      <Route path="*" element={<Navigate to="/schedule" replace />} />
    </Routes>
  );
}
