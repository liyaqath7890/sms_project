import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, User, Layers, Search } from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import CustomCard from '../../../components/custom/CustomCard';
import CustomDrawer from '../../../components/custom/CustomDrawer';
import CreateCourse from './CreateCourse';
import CourseDetails from './CourseDetails';

const dummyCourses = [
  { id: '1', name: 'Advanced Mathematics', code: 'MATH401', teacher: 'Dr. Sarah Wilson', sections: 3, students: 84, color: 'primary' },
  { id: '2', name: 'General Physics', code: 'PHY101', teacher: 'Prof. James Brown', sections: 2, students: 45, color: 'info' },
  { id: '3', name: 'English Literature', code: 'ENG205', teacher: 'Mrs. Emily Davis', sections: 4, students: 112, color: 'warning' },
  { id: '4', name: 'Modern World History', code: 'HIS301', teacher: 'Mr. Michael Ross', sections: 2, students: 38, color: 'success' },
  { id: '5', name: 'Cell Biology', code: 'BIO202', teacher: 'Ms. Clara Barton', sections: 3, students: 62, color: 'danger' },
];

import { Download } from 'lucide-react';
import { exportToCSV } from '../../../utils/csvExport';
import { CardSkeleton } from '../../../components/common/SkeletonLoader';

const CourseList = () => {
  const [courses, setCourses] = useState(dummyCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenCreate = () => {
    setDrawerType('create');
    setDrawerOpen(true);
  };

  const handleOpenDetails = (id) => {
    setSelectedCourseId(id);
    setDrawerType('details');
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleExport = () => {
    exportToCSV(courses, 'course_catalog.csv');
  };

  const handleCreateSuccess = (newCourse) => {
    const freshCourse = {
      ...newCourse,
      id: String(courses.length + 1),
      sections: 1,
      students: 0,
      color: 'primary'
    };
    setCourses(prev => [...prev, freshCourse]);
    handleCloseDrawer();
  };

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Course Catalog</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage academic curriculum and course assignments.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <CustomButton variant="outline" icon={Download} onClick={handleExport}>Export Catalog</CustomButton>
          <CustomButton variant="primary" icon={Plus} onClick={handleOpenCreate}>Create New Course</CustomButton>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
        <Search size={20} color="var(--text-light)" />
        <input 
          type="text" 
          placeholder="Search courses by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }}
        />
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredCourses.map((course) => (
            <CustomCard 
              key={course.id}
              style={{ 
                cursor: 'pointer',
                borderTop: `4px solid var(--${course.color})` 
              }}
              onClick={() => handleOpenDetails(course.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)' }}>{course.code}</span>
                <BookOpen size={20} color={`var(--${course.color})`} />
              </div>
              
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{course.name}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <User size={14} color="var(--text-light)" />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{course.teacher}</span>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '1.5rem', 
                paddingTop: '1rem', 
                borderTop: '1px solid var(--border-color)',
                marginTop: 'auto'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={14} color="var(--text-light)" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{course.sections} <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>Sections</span></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={14} color="var(--text-light)" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{course.students} <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>Students</span></span>
                </div>
              </div>
            </CustomCard>
          ))}
        </div>
      )}

      <CustomDrawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        title={drawerType === 'create' ? 'Create New Course' : 'Course Details'}
        width={drawerType === 'create' ? '500px' : '900px'}
      >
        {drawerType === 'create' ? (
          <CreateCourse onSuccess={handleCreateSuccess} />
        ) : (
          <CourseDetails id={selectedCourseId} isInternal />
        )}
      </CustomDrawer>
    </div>
  );
};

export default CourseList;
