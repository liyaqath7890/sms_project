import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EliteCourseList from '../pages/EliteCourseList';
import CourseDetails from '../pages/CourseDetails';
import EliteAddCourse from '../pages/EliteAddCourse';

const CourseRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EliteCourseList />} />
      <Route path="add" element={<EliteAddCourse />} />
      <Route path="details/:id" element={<CourseDetails />} />
      <Route path="*" element={<Navigate to="/courses" replace />} />
    </Routes>
  );
};

export default CourseRoutes;
