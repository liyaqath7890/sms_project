import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Filter, Mail, Phone, BookOpen, Users, Award, Clock, TrendingUp, Download } from 'lucide-react';
import CustomTable from '../../../components/custom/CustomTable';
import CustomButton from '../../../components/custom/CustomButton';
import CustomCard from '../../../components/custom/CustomCard';
import CustomDrawer from '../../../components/custom/CustomDrawer';
import AddTeacher from './AddTeacher';
import { exportToCSV } from '../../../utils/csvExport';
import { TableSkeleton } from '../../../components/common/SkeletonLoader';
import dataManager from '../../../services/dataManager';

const PremiumTeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      const data = await dataManager.getTeachers();
      setTeachers(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
      setError('Failed to load teacher data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleOpenAdd = () => {
    setSelectedTeacherId(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleExport = () => {
    exportToCSV(teachers, 'teacher_list.csv');
  };

  const handleAddSuccess = (newTeacher) => {
    const teacherWithId = {
      ...newTeacher,
      id: String(teachers.length + 1),
      status: 'Active',
    };
    setTeachers([...teachers, teacherWithId]);
    setDrawerOpen(false);
  };

  const handleEditSuccess = (updatedTeacher) => {
    setTeachers(teachers.map(teacher =>
      teacher.id === updatedTeacher.id ? updatedTeacher : teacher
    ));
    setDrawerOpen(false);
  };

  const handleDelete = (teacherId) => {
    setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter(t => t.status === 'Active').length;
  const subjectsCount = new Set(teachers.map(t => t.subject)).size;
  const avgExperience = teachers.length > 0
    ? Math.round(teachers.reduce((sum, t) => sum + (t.experience || 0), 0) / teachers.length)
    : 0;

  const tableColumns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      align: 'center'
    },
    {
      key: 'name',
      label: 'Teacher Name',
      sortable: true,
      align: 'left'
    },
    {
      key: 'subject',
      label: 'Subject',
      sortable: true,
      align: 'left'
    },
    {
      key: 'email',
      label: 'Email',
      sortable: false,
      align: 'left',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: false,
      align: 'left',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      align: 'center',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Active' ? 'bg-green-100 text-green-800' :
          value === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'designation',
      label: 'Designation',
      sortable: true,
      align: 'left'
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'center',
      render: (_, row) => (
        <div className="flex gap-2">
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedTeacherId(row.id);
              setDrawerOpen(true);
            }}
          >
            Edit
          </CustomButton>
          <CustomButton
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </CustomButton>
        </div>
      )
    }
  ];

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-medium mb-2">Error Loading Teachers</div>
          <div className="text-gray-600">{error}</div>
          <CustomButton
            onClick={fetchTeachers}
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
          <h1 className="text-3xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor teaching staff</p>
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
            onClick={handleOpenAdd}
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Teacher
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
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-3xl font-bold text-gray-900">{totalTeachers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
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
                <p className="text-sm font-medium text-gray-600">Active Teachers</p>
                <p className="text-3xl font-bold text-green-600">{activeTeachers}</p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
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
                <p className="text-sm font-medium text-gray-600">Subjects</p>
                <p className="text-3xl font-bold text-purple-600">{subjectsCount}</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-500" />
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
                <p className="text-sm font-medium text-gray-600">Avg Experience</p>
                <p className="text-3xl font-bold text-orange-600">{avgExperience} yrs</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CustomCard>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <CustomCard className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <CustomButton variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </CustomButton>
        </div>
      </CustomCard>

      {/* Teachers Table */}
      <CustomCard className="p-6">
        {isLoading ? (
          <TableSkeleton rows={8} columns={8} />
        ) : (
          <CustomTable
            columns={tableColumns}
            data={filteredTeachers}
            searchable={false}
            sortable={true}
            pagination={true}
            pageSize={10}
          />
        )}
      </CustomCard>

      {/* Add/Edit Teacher Drawer */}
      <CustomDrawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        title={selectedTeacherId ? "Edit Teacher" : "Add New Teacher"}
        width="500px"
      >
        <AddTeacher
          teacherId={selectedTeacherId}
          onSuccess={selectedTeacherId ? handleEditSuccess : handleAddSuccess}
          onCancel={handleCloseDrawer}
        />
      </CustomDrawer>
    </div>
  );
};

export default PremiumTeacherList;