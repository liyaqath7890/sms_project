import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EliteAttendance from '../pages/EliteAttendance';
import AttendanceReport from '../pages/AttendanceReport';

const AttendanceRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EliteAttendance />} />
      <Route path="mark" element={<EliteAttendance />} />
      <Route path="report" element={<AttendanceReport />} />
      <Route path="*" element={<Navigate to="/attendance" replace />} />
    </Routes>
  );
};

export default AttendanceRoutes;
