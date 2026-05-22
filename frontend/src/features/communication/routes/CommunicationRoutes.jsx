import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EliteCommunication from '../pages/EliteCommunication';

const CommunicationRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EliteCommunication />} />
      <Route path="*" element={<Navigate to="/communication" replace />} />
    </Routes>
  );
};

export default CommunicationRoutes;
