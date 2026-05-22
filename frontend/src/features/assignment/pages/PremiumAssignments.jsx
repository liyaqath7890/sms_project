import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Book,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Award,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import CustomTable from '../../../components/custom/CustomTable';
import CustomButton from '../../../components/custom/CustomButton';
import CustomDrawer from '../../../components/custom/CustomDrawer';
import CustomCard from '../../../components/custom/CustomCard';
import SubmitAssignment from './SubmitAssignment';
import { exportToCSV } from '../../../utils/csvExport';
import { CardSkeleton } from '../../../components/common/SkeletonLoader';
import dataManager from '../../../services/dataManager';

const PremiumAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await dataManager.getAssignments();
      setAssignments(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
      setError('Failed to load assignment data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalAssignments = assignments.length;
  const activeAssignments = assignments.filter(a => a.status === 'Active').length;
  const submittedAssignments = assignments.filter(a => a.status === 'Submitted').length;
  const totalSubmissions = assignments.reduce((sum, a) => sum + (a.submissions || 0), 0);

  const handleExport = () => {
    exportToCSV(assignments, 'assignments_list.csv');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-medium mb-2">Error Loading Assignments</div>
          <div className="text-gray-600">{error}</div>
          <CustomButton
            onClick={fetchAssignments}
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
          <h1 className="text-3xl font-bold text-gray-900">Assignment Management</h1>
          <p className="text-gray-600 mt-1">Manage student tasks, deadlines, and submissions</p>
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
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Assignment
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
                <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                <p className="text-3xl font-bold text-gray-900">{totalAssignments}</p>
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
                <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                <p className="text-3xl font-bold text-green-600">{activeAssignments}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
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
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-3xl font-bold text-purple-600">{submittedAssignments}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
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
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-3xl font-bold text-orange-600">{totalSubmissions}</p>
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
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </CustomCard>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))
        ) : (
          filteredAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CustomCard className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-gray-500">{assignment.course}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    assignment.status === 'Active' ? 'bg-green-100 text-green-800' :
                    assignment.status === 'Submitted' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {assignment.status}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{assignment.submissions} submissions</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <CustomButton
                      variant="outline"
                      size="sm"
                      onClick={() => setDrawerOpen(true)}
                    >
                      View Details
                    </CustomButton>
                    <CustomButton
                      variant="primary"
                      size="sm"
                    >
                      Grade
                    </CustomButton>
                  </div>
                </div>
              </CustomCard>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Assignment Drawer */}
      <CustomDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Create New Assignment"
        width="500px"
      >
        <SubmitAssignment
          onSuccess={() => {
            setDrawerOpen(false);
            fetchAssignments();
          }}
          onCancel={() => setDrawerOpen(false)}
        />
      </CustomDrawer>
    </div>
  );
};

export default PremiumAssignments;