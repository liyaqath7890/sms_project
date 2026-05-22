import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, User, Layers, Search, Users, Award, Clock, TrendingUp } from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import CustomCard from '../../../components/custom/CustomCard';
import CustomDrawer from '../../../components/custom/CustomDrawer';
import CreateCourse from './CreateCourse';
import CourseDetails from './CourseDetails';
import { exportToCSV } from '../../../utils/csvExport';
import { CardSkeleton } from '../../../components/common/SkeletonLoader';
import dataManager from '../../../services/dataManager';

const PremiumCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await dataManager.getCourses();
      setCourses(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError('Failed to load course data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
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
    exportToCSV(courses, 'courses_list.csv');
  };

  const handleCreateSuccess = (newCourse) => {
    const courseWithId = {
      ...newCourse,
      id: String(courses.length + 1),
    };
    setCourses([...courses, courseWithId]);
    setDrawerOpen(false);
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalCourses = courses.length;
  const totalStudents = courses.reduce((sum, course) => sum + (course.students || 0), 0);
  const totalSections = courses.reduce((sum, course) => sum + (course.sections || 0), 0);
  const avgStudentsPerCourse = totalCourses > 0 ? Math.round(totalStudents / totalCourses) : 0;

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-medium mb-2">Error Loading Courses</div>
          <div className="text-gray-600">{error}</div>
          <CustomButton
            onClick={fetchCourses}
            className="mt-4"
          >
            Try Again
          </CustomButton>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">Manage academic courses and curriculum</p>
        </div>
        <div className="flex gap-3">
          <CustomButton
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </CustomButton>
          <CustomButton
            onClick={handleOpenCreate}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Course
          </CustomButton>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CustomCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{totalCourses}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CustomCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CustomCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-green-600">{totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CustomCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CustomCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sections</p>
                <p className="text-3xl font-bold text-purple-600">{totalSections}</p>
              </div>
              <Layers className="w-8 h-8 text-purple-500" />
            </div>
          </CustomCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CustomCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Students/Course</p>
                <p className="text-3xl font-bold text-orange-600">{avgStudentsPerCourse}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CustomCard>
        </motion.div>
      </div>

      {/* Search */}
      <CustomCard className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </CustomCard>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))
        ) : (
          filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CustomCard className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleOpenDetails(course.id)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-500">{course.code}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{course.teacher}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Layers className="w-4 h-4" />
                      <span>{course.sections} sections</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{course.students} students</span>
                    </div>
                  </div>
                </div>
              </CustomCard>
            </motion.div>
          ))
        )}
      </div>

      {/* Create/Edit Course Drawer */}
      <CustomDrawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        title={drawerType === 'create' ? "Create New Course" : "Course Details"}
        width="600px"
      >
        {drawerType === 'create' ? (
          <CreateCourse
            onSuccess={handleCreateSuccess}
            onCancel={handleCloseDrawer}
          />
        ) : (
          <CourseDetails
            courseId={selectedCourseId}
            onClose={handleCloseDrawer}
          />
        )}
      </CustomDrawer>
    </div>
  );
};

export default PremiumCourses;