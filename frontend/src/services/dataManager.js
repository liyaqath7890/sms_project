import { apiService } from './apiService';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100; // Maximum cached items

class DataManager {
  constructor() {
    this.cache = new Map();
    this.pendingOperations = [];

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.syncPendingOperations();
    });

    window.addEventListener('offline', () => {
      // No need to do anything on offline, getter will handle it
    });
  }

  // Cache management
  setCache(key, data) {
    if (this.cache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clearCache() {
    this.cache.clear();
  }

  // Online status
  get isOnline() {
    return navigator.onLine;
  }

  // Pending operations for offline support
  addPendingOperation(operation) {
    this.pendingOperations.push({
      ...operation,
      id: Date.now() + Math.random(),
      timestamp: Date.now(),
    });
  }

  async syncPendingOperations() {
    if (!this.isOnline || this.pendingOperations.length === 0) return;

    const operations = [...this.pendingOperations];
    this.pendingOperations = [];

    for (const operation of operations) {
      try {
        await this.executeOperation(operation);
      } catch (error) {
        console.error('Failed to sync operation:', operation, error);
        // Re-add failed operations
        this.pendingOperations.push(operation);
      }
    }
  }

  async executeOperation(operation) {
    const { type, endpoint, data, method = 'post' } = operation;

    switch (method.toLowerCase()) {
      case 'post':
        return await api[method](endpoint, data);
      case 'put':
      case 'patch':
        return await api[method](endpoint, data);
      case 'delete':
        return await api.delete(endpoint);
      default:
        return await api.get(endpoint);
    }
  }

  // Students data management
  async getStudents(params = {}) {
    const cacheKey = `students_${JSON.stringify(params)}`;

    // Try cache first
    const cached = this.getCache(cacheKey);
    if (cached && !params.force) return cached;

    try {
      const data = await apiService.students.getAll(params);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (!this.isOnline) {
        // Return cached data if offline
        const cached = this.getCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  async getStudentsByClass(standard, division) {
    const cacheKey = `students_class_${standard}_${division}`;

    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiService.students.getByClass(standard, division);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (!this.isOnline) {
        const cached = this.getCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  async createStudent(studentData) {
    const result = await apiService.students.create(studentData);

    // Invalidate related caches
    this.invalidateStudentCaches();

    // Add to pending operations if offline
    if (!this.isOnline) {
      this.addPendingOperation({
        type: 'create_student',
        endpoint: apiService.students.create,
        data: studentData,
        method: 'post',
      });
    }

    return result;
  }

  async updateStudent(id, studentData) {
    const result = await apiService.students.update(id, studentData);

    // Invalidate related caches
    this.invalidateStudentCaches();

    if (!this.isOnline) {
      this.addPendingOperation({
        type: 'update_student',
        endpoint: apiService.students.update(id),
        data: studentData,
        method: 'put',
      });
    }

    return result;
  }

  async deleteStudent(id) {
    const result = await apiService.students.delete(id);

    // Invalidate related caches
    this.invalidateStudentCaches();

    if (!this.isOnline) {
      this.addPendingOperation({
        type: 'delete_student',
        endpoint: apiService.students.delete(id),
        method: 'delete',
      });
    }

    return result;
  }

  invalidateStudentCaches() {
    // Remove all student-related cache entries
    for (const key of this.cache.keys()) {
      if (key.startsWith('students_')) {
        this.cache.delete(key);
      }
    }
  }

  // Attendance data management
  async getAttendanceByDate(date) {
    const cacheKey = `attendance_date_${date}`;

    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiService.attendance.getByDate(date);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (!this.isOnline) {
        const cached = this.getCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  async getAttendanceByClass(standard, division, date) {
    const cacheKey = `attendance_class_${standard}_${division}_${date}`;

    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiService.attendance.getByClass(standard, division, date);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (!this.isOnline) {
        const cached = this.getCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  async markAttendance(attendanceData) {
    const result = await apiService.attendance.markAttendance(attendanceData);

    // Invalidate related caches
    this.invalidateAttendanceCaches(attendanceData.date);

    if (!this.isOnline) {
      this.addPendingOperation({
        type: 'mark_attendance',
        endpoint: apiService.attendance.mark,
        data: attendanceData,
        method: 'post',
      });
    }

    return result;
  }

  invalidateAttendanceCaches(date) {
    for (const key of this.cache.keys()) {
      if (key.includes('attendance') && (key.includes(date) || key.includes('report'))) {
        this.cache.delete(key);
      }
    }
  }

  // Grades data management
  async getGradesByStudent(studentId) {
    const cacheKey = `grades_student_${studentId}`;

    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiService.grades.getByStudent(studentId);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (!this.isOnline) {
        const cached = this.getCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  async getGradesByClass(standard, division) {
    const cacheKey = `grades_class_${standard}_${division}`;

    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiService.grades.getByClass(standard, division);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (!this.isOnline) {
        const cached = this.getCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  async updateGrade(id, gradeData) {
    const result = await apiService.grades.updateGrade(id, gradeData);

    // Invalidate related caches
    this.invalidateGradeCaches();

    if (!this.isOnline) {
      this.addPendingOperation({
        type: 'update_grade',
        endpoint: apiService.grades.update(id),
        data: gradeData,
        method: 'put',
      });
    }

    return result;
  }

  invalidateGradeCaches() {
    for (const key of this.cache.keys()) {
      if (key.startsWith('grades_')) {
        this.cache.delete(key);
      }
    }
  }

  // Dashboard data management
  async getDashboardData() {
    const cacheKey = 'dashboard_data';

    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      // Get data from multiple endpoints
      const [studentStats, teacherStats] = await Promise.all([
        apiService.students.getStats(),
        apiService.teachers.getStats()
      ]);

      const data = {
        students: studentStats.stats,
        teachers: teacherStats.stats,
        // Mock data for now - will be replaced with real endpoints
        attendance: {
          monthly: [
            { month: 'Jan', attendance: 92, target: 95 },
            { month: 'Feb', attendance: 94, target: 95 },
            { month: 'Mar', attendance: 89, target: 95 },
            { month: 'Apr', attendance: 96, target: 95 },
            { month: 'May', attendance: 93, target: 95 },
            { month: 'Jun', attendance: 95, target: 95 },
          ]
        },
        performance: {
          byGrade: [
            { grade: 'G1', excellent: 25, good: 35, average: 30, poor: 10 },
            { grade: 'G2', excellent: 30, good: 32, average: 28, poor: 10 },
            { grade: 'G3', excellent: 28, good: 38, average: 24, poor: 10 },
            { grade: 'G4', excellent: 32, good: 30, average: 28, poor: 10 },
            { grade: 'G5', excellent: 35, good: 28, average: 25, poor: 12 },
          ]
        },
        grades: {
          distribution: [
            { name: 'A+', value: 18, color: '#10b981' },
            { name: 'A', value: 22, color: '#3b82f6' },
            { name: 'B', value: 30, color: '#f59e0b' },
            { name: 'C', value: 20, color: '#ef4444' },
            { name: 'D', value: 10, color: '#8b5cf6' },
          ]
        },
        students: {
          recent: [
            { id: 1, name: 'Aarav Kumar', class: 'Grade 5-A', enrollment: '2024-04-15', status: 'Active' },
            { id: 2, name: 'Priya Sharma', class: 'Grade 6-B', enrollment: '2024-05-01', status: 'Active' },
            { id: 3, name: 'Rohan Singh', class: 'Grade 7-C', enrollment: '2024-05-10', status: 'Pending' },
            { id: 4, name: 'Divya Patel', class: 'Grade 8-A', enrollment: '2024-05-20', status: 'Active' },
            { id: 5, name: 'Ananya Gupta', class: 'Grade 9-B', enrollment: '2024-06-01', status: 'Active' },
          ]
        }
      };

      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (!this.isOnline) {
        const cached = this.getCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  // Session management
  async getCurrentSession() {
    const cacheKey = 'current_session';

    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiService.sessions.getCurrent();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (!this.isOnline) {
        const cached = this.getCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  async setActiveSession(sessionId) {
    const result = await apiService.sessions.setActive(sessionId);

    // Clear session-related caches
    this.cache.delete('current_session');
    this.clearCache(); // Clear all caches when switching sessions

    return result;
  }

  // Notifications
  async getNotifications() {
    const cacheKey = 'notifications';

    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiService.notifications.getAll();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (!this.isOnline) {
        const cached = this.getCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  // Recent Activities
  async getRecentActivities(limit = 10) {
    const cacheKey = `recent_activities_${limit}`;

    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiService.activities.getRecent(limit);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (!this.isOnline) {
        const cached = this.getCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  async markNotificationAsRead(id) {
    const result = await apiService.notifications.markAsRead(id);

    // Update cache
    const cached = this.getCache('notifications');
    if (cached) {
      const updated = cached.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      );
      this.setCache('notifications', updated);
    }

    return result;
  }

  // Teachers data management
  async getTeachers(params = {}) {
    const cacheKey = `teachers_${JSON.stringify(params)}`;

    const cached = this.getCache(cacheKey);
    if (cached && !params.force) return cached;

    try {
      const data = await apiService.teachers.getAll(params);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (!this.isOnline) {
        const cached = this.getCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  async getTeacherById(id) {
    const cacheKey = `teacher_${id}`;

    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiService.teachers.getById(id);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (!this.isOnline) {
        const cached = this.getCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  async createTeacher(teacherData) {
    const result = await apiService.teachers.create(teacherData);
    this.invalidateTeacherCaches();
    return result;
  }

  async updateTeacher(id, teacherData) {
    const result = await apiService.teachers.update(id, teacherData);
    this.invalidateTeacherCaches();
    return result;
  }

  async deleteTeacher(id) {
    const result = await apiService.teachers.delete(id);
    this.invalidateTeacherCaches();
    return result;
  }

  invalidateTeacherCaches() {
    for (const key of this.cache.keys()) {
      if (key.startsWith('teachers_') || key.startsWith('teacher_')) {
        this.cache.delete(key);
      }
    }
  }

  // Courses data management
  async getCourses(params = {}) {
    const cacheKey = `courses_${JSON.stringify(params)}`;

    const cached = this.getCache(cacheKey);
    if (cached && !params.force) return cached;

    try {
      const data = await apiService.courses.getAll(params);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (!this.isOnline) {
        const cached = this.getCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  async createCourse(courseData) {
    const result = await apiService.courses.create(courseData);
    this.invalidateCourseCaches();
    return result;
  }

  async updateCourse(id, courseData) {
    const result = await apiService.courses.update(id, courseData);
    this.invalidateCourseCaches();
    return result;
  }

  async deleteCourse(id) {
    const result = await apiService.courses.delete(id);
    this.invalidateCourseCaches();
    return result;
  }

  invalidateCourseCaches() {
    for (const key of this.cache.keys()) {
      if (key.startsWith('courses_')) {
        this.cache.delete(key);
      }
    }
  }

  // Assignments data management
  async getAssignments(params = {}) {
    const cacheKey = `assignments_${JSON.stringify(params)}`;

    const cached = this.getCache(cacheKey);
    if (cached && !params.force) return cached;

    try {
      const data = await apiService.assignments.getAll(params);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (!this.isOnline) {
        const cached = this.getCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  async createAssignment(assignmentData) {
    const result = await apiService.assignments.create(assignmentData);
    this.invalidateAssignmentCaches();
    return result;
  }

  async updateAssignment(id, assignmentData) {
    const result = await apiService.assignments.update(id, assignmentData);
    this.invalidateAssignmentCaches();
    return result;
  }

  async deleteAssignment(id) {
    const result = await apiService.assignments.delete(id);
    this.invalidateAssignmentCaches();
    return result;
  }

  invalidateAssignmentCaches() {
    for (const key of this.cache.keys()) {
      if (key.startsWith('assignments_')) {
        this.cache.delete(key);
      }
    }
  }

  // Schedule data management
  async getSchedule(params = {}) {
    const cacheKey = `schedule_${JSON.stringify(params)}`;

    const cached = this.getCache(cacheKey);
    if (cached && !params.force) return cached;

    try {
      const data = await apiService.schedule.getAll(params);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (!this.isOnline) {
        const cached = this.getCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  async getScheduleByClass(standard, division) {
    const cacheKey = `schedule_class_${standard}_${division}`;

    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiService.schedule.getByClass(standard, division);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (!this.isOnline) {
        const cached = this.getCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  async createSchedule(scheduleData) {
    const result = await apiService.schedule.create(scheduleData);
    this.invalidateScheduleCaches();
    return result;
  }

  async updateSchedule(id, scheduleData) {
    const result = await apiService.schedule.update(id, scheduleData);
    this.invalidateScheduleCaches();
    return result;
  }

  async deleteSchedule(id) {
    const result = await apiService.schedule.delete(id);
    this.invalidateScheduleCaches();
    return result;
  }

  invalidateScheduleCaches() {
    for (const key of this.cache.keys()) {
      if (key.startsWith('schedule_')) {
        this.cache.delete(key);
      }
    }
  }

  // Utility methods
  async refreshData() {
    this.clearCache();
    // Optionally prefetch important data
    try {
      await Promise.all([
        this.getCurrentSession(),
        this.getDashboardData(),
        this.getNotifications(),
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: MAX_CACHE_SIZE,
      pendingOperations: this.pendingOperations.length,
      isOnline: this.isOnline,
    };
  }
}

// Create singleton instance
export const dataManager = new DataManager();

export default dataManager;
