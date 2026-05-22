import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_MOCK_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes('/auth/login') &&
      !originalRequest?.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const response = await api.post(apiEndpoints.auth.refresh, { refreshToken });
          localStorage.setItem('authToken', response.data.accessToken || response.data.token);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken || response.data.token}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
        }
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    profile: '/auth/profile',
    changePassword: '/auth/change-password',
    requestPasswordReset: '/auth/password-reset/request',
    resetPassword: '/auth/password-reset/confirm',
    verifyEmail: '/auth/verify-email',
  },

  // Students
  students: {
    list: '/students',
    create: '/students',
    update: (id) => `/students/${id}`,
    delete: (id) => `/students/${id}`,
    getById: (id) => `/students/${id}`,
    getByClass: (standard, division) => `/students/class/${standard}/${division}`,
    search: '/students/search',
    stats: '/students/stats/overview',
    export: '/students/export',
  },

  // Teachers
  teachers: {
    list: '/teachers',
    create: '/teachers',
    update: (id) => `/teachers/${id}`,
    delete: (id) => `/teachers/${id}`,
    getById: (id) => `/teachers/${id}`,
    getBySubject: (subject) => `/teachers/subject/${subject}`,
    stats: '/teachers/stats/overview',
  },

  // Attendance
  attendance: {
    list: '/attendance',
    mark: '/attendance/mark',
    update: (id) => `/attendance/${id}`,
    getByStudent: (studentId) => `/attendance/student/${studentId}`,
    getByClass: (standard, division, date) => `/attendance/class/${standard}/${division}/${date}`,
    getByDate: (date) => `/attendance/date/${date}`,
    bulkMark: '/attendance/bulk-mark',
    report: '/attendance/report',
  },

  // Grades
  grades: {
    list: '/grades',
    create: '/grades',
    update: (id) => `/grades/${id}`,
    delete: (id) => `/grades/${id}`,
    getByStudent: (studentId) => `/grades/student/${studentId}`,
    getByClass: (standard, division) => `/grades/class/${standard}/${division}`,
    bulkUpdate: '/grades/bulk-update',
    report: '/grades/report',
  },

  // Classes
  classes: {
    list: '/classes',
    create: '/classes',
    update: (id) => `/classes/${id}`,
    getById: (id) => `/classes/${id}`,
    getByStandard: (standard) => `/classes/standard/${standard}`,
  },

  // Subjects
  subjects: {
    list: '/subjects',
    create: '/subjects',
    update: (id) => `/subjects/${id}`,
    getByStandard: (standard) => `/subjects/standard/${standard}`,
  },

  // Academic Sessions
  sessions: {
    list: '/sessions',
    create: '/sessions',
    update: (id) => `/sessions/${id}`,
    setActive: (id) => `/sessions/${id}/activate`,
    getCurrent: '/sessions/current',
  },

  // Courses
  courses: {
    list: '/courses',
    create: '/courses',
    update: (id) => `/courses/${id}`,
    getById: (id) => `/courses/${id}`,
    getByGrade: (grade) => `/courses?grade=${grade}`,
    delete: (id) => `/courses/${id}`,
  },

  // Assignments
  assignments: {
    list: '/assignments',
    create: '/assignments',
    update: (id) => `/assignments/${id}`,
    getById: (id) => `/assignments/${id}`,
    getByClass: (standard, division) => `/assignments?standard=${standard}&division=${division}`,
    submit: (assignmentId) => `/assignments/${assignmentId}/submit`,
    delete: (id) => `/assignments/${id}`,
  },

  // Schedule
  schedule: {
    list: '/schedule',
    create: '/schedule',
    update: (id) => `/schedule/${id}`,
    getByClass: (standard, division) => `/schedule?standard=${standard}&division=${division}`,
    getByTeacher: (teacherId) => `/schedule?teacherId=${teacherId}`,
    delete: (id) => `/schedule/${id}`,
  },

  // Reports
  reports: {
    dashboard: '/reports/dashboard',
    attendance: '/reports/attendance',
    grades: '/reports/grades',
    students: '/reports/students',
    teachers: '/reports/teachers',
    export: '/reports/export',
  },

  // Notifications
  notifications: {
    list: '/notifications',
    markAsRead: (id) => `/notifications/${id}/read`,
    markAllAsRead: '/notifications/read-all',
    create: '/notifications',
  },

  // Activities
  activities: {
    getRecent: (limit = 10) => `/activities/recent?limit=${limit}`,
    getAll: '/activities',
    create: '/activities',
  },

  // Files
  files: {
    upload: '/files/upload',
    download: (filename) => `/files/download/${filename}`,
    delete: (filename) => `/files/delete/${filename}`,
  },
};

// API service functions
export const apiService = {
  // Authentication
  auth: {
    login: async (credentials) => {
      const response = await api.post(apiEndpoints.auth.login, credentials);
      if (response.data.accessToken || response.data.token) {
        localStorage.setItem('authToken', response.data.accessToken || response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    },

    register: async (userData) => {
      const response = await api.post(apiEndpoints.auth.register, userData);
      if (response.data.accessToken || response.data.token) {
        localStorage.setItem('authToken', response.data.accessToken || response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    },

    getProfile: async () => {
      const response = await api.get(apiEndpoints.auth.profile);
      return response.data;
    },

    changePassword: async (passwordData) => {
      const response = await api.post(apiEndpoints.auth.changePassword, passwordData);
      return response.data;
    },

    requestPasswordReset: async (email) => {
      const response = await api.post(apiEndpoints.auth.requestPasswordReset, { email });
      return response.data;
    },

    resetPassword: async (resetData) => {
      const response = await api.post(apiEndpoints.auth.resetPassword, resetData);
      return response.data;
    },

    verifyEmail: async (token) => {
      const response = await api.post(apiEndpoints.auth.verifyEmail, { token });
      return response.data;
    },

    logout: async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      try {
        if (localStorage.getItem('authToken')) {
          await api.post(apiEndpoints.auth.logout, { refreshToken });
        }
      } catch (error) {
        console.warn('Server logout failed; clearing local session', error);
      }
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
  },

  // Students
  students: {
    getAll: async (params = {}) => {
      const response = await api.get(apiEndpoints.students.list, { params });
      return response.data;
    },

    getById: async (id) => {
      const response = await api.get(apiEndpoints.students.getById(id));
      return response.data;
    },

    create: async (studentData) => {
      const response = await api.post(apiEndpoints.students.create, studentData);
      return response.data;
    },

    update: async (id, studentData) => {
      const response = await api.put(apiEndpoints.students.update(id), studentData);
      return response.data;
    },

    delete: async (id) => {
      const response = await api.delete(apiEndpoints.students.delete(id));
      return response.data;
    },

    getByClass: async (standard, division) => {
      const response = await api.get(apiEndpoints.students.getByClass(standard, division));
      return response.data;
    },

    search: async (query) => {
      const response = await api.get(apiEndpoints.students.search, { params: { q: query } });
      return response.data;
    },

    getStats: async () => {
      const response = await api.get(apiEndpoints.students.stats);
      return response.data;
    },

    export: async (format = 'csv') => {
      const response = await api.get(apiEndpoints.students.export, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    },
  },

  // Teachers
  teachers: {
    getAll: async (params = {}) => {
      const response = await api.get(apiEndpoints.teachers.list, { params });
      return response.data;
    },

    getById: async (id) => {
      const response = await api.get(apiEndpoints.teachers.getById(id));
      return response.data;
    },

    create: async (teacherData) => {
      const response = await api.post(apiEndpoints.teachers.create, teacherData);
      return response.data;
    },

    update: async (id, teacherData) => {
      const response = await api.put(apiEndpoints.teachers.update(id), teacherData);
      return response.data;
    },

    delete: async (id) => {
      const response = await api.delete(apiEndpoints.teachers.delete(id));
      return response.data;
    },

    getBySubject: async (subject) => {
      const response = await api.get(apiEndpoints.teachers.getBySubject(subject));
      return response.data;
    },

    getStats: async () => {
      const response = await api.get(apiEndpoints.teachers.stats);
      return response.data;
    },
  },

  // Attendance
  attendance: {
    getAll: async (params = {}) => {
      const response = await api.get(apiEndpoints.attendance.list, { params });
      return response.data;
    },

    markAttendance: async (attendanceData) => {
      const response = await api.post(apiEndpoints.attendance.mark, attendanceData);
      return response.data;
    },

    updateAttendance: async (id, attendanceData) => {
      const response = await api.put(apiEndpoints.attendance.update(id), attendanceData);
      return response.data;
    },

    getByStudent: async (studentId, params = {}) => {
      const response = await api.get(apiEndpoints.attendance.getByStudent(studentId), { params });
      return response.data;
    },

    getByClass: async (standard, division, date) => {
      const response = await api.get(apiEndpoints.attendance.getByClass(standard, division, date));
      return response.data;
    },

    getByDate: async (date) => {
      const response = await api.get(apiEndpoints.attendance.getByDate(date));
      return response.data;
    },

    bulkMark: async (attendanceData) => {
      const response = await api.post(apiEndpoints.attendance.bulkMark, attendanceData);
      return response.data;
    },

    getReport: async (params) => {
      const response = await api.get(apiEndpoints.attendance.report, { params });
      return response.data;
    },
  },

  // Grades
  grades: {
    getAll: async (params = {}) => {
      const response = await api.get(apiEndpoints.grades.list, { params });
      return response.data;
    },

    getByStudent: async (studentId) => {
      const response = await api.get(apiEndpoints.grades.getByStudent(studentId));
      return response.data;
    },

    getByClass: async (standard, division) => {
      const response = await api.get(apiEndpoints.grades.getByClass(standard, division));
      return response.data;
    },

    create: async (gradeData) => {
      const response = await api.post(apiEndpoints.grades.create, gradeData);
      return response.data;
    },

    updateGrade: async (id, gradeData) => {
      const response = await api.put(apiEndpoints.grades.update(id), gradeData);
      return response.data;
    },

    delete: async (id) => {
      const response = await api.delete(apiEndpoints.grades.delete(id));
      return response.data;
    },

    bulkUpdate: async (gradesData) => {
      const response = await api.post(apiEndpoints.grades.bulkUpdate, gradesData);
      return response.data;
    },

    getReport: async (params) => {
      const response = await api.get(apiEndpoints.grades.report, { params });
      return response.data;
    },
  },

  // Classes
  classes: {
    getAll: async (params = {}) => {
      const response = await api.get(apiEndpoints.classes.list, { params });
      return response.data;
    },

    getById: async (id) => {
      const response = await api.get(apiEndpoints.classes.getById(id));
      return response.data;
    },

    create: async (classData) => {
      const response = await api.post(apiEndpoints.classes.create, classData);
      return response.data;
    },

    update: async (id, classData) => {
      const response = await api.put(apiEndpoints.classes.update(id), classData);
      return response.data;
    },

    getByStandard: async (standard) => {
      const response = await api.get(apiEndpoints.classes.getByStandard(standard));
      return response.data;
    },
  },

  // Subjects
  subjects: {
    getAll: async (params = {}) => {
      const response = await api.get(apiEndpoints.subjects.list, { params });
      return response.data;
    },

    create: async (subjectData) => {
      const response = await api.post(apiEndpoints.subjects.create, subjectData);
      return response.data;
    },

    update: async (id, subjectData) => {
      const response = await api.put(apiEndpoints.subjects.update(id), subjectData);
      return response.data;
    },

    getByStandard: async (standard) => {
      const response = await api.get(apiEndpoints.subjects.getByStandard(standard));
      return response.data;
    },
  },

  // Subjects
  subjects: {
    getAll: async (params = {}) => {
      const response = await api.get('/subjects', { params });
      return response.data;
    },
    create: async (data) => {
      const response = await api.post('/subjects', data);
      return response.data;
    },
  },

  // Sessions
  sessions: {
    getAll: async () => {
      const response = await api.get(apiEndpoints.sessions.list);
      return response.data;
    },

    create: async (sessionData) => {
      const response = await api.post(apiEndpoints.sessions.create, sessionData);
      return response.data;
    },

    update: async (id, sessionData) => {
      const response = await api.put(apiEndpoints.sessions.update(id), sessionData);
      return response.data;
    },

    setActive: async (id) => {
      const response = await api.put(apiEndpoints.sessions.setActive(id));
      return response.data;
    },

    getCurrent: async () => {
      const response = await api.get(apiEndpoints.sessions.getCurrent);
      return response.data;
    },
  },

  // Courses
  courses: {
    getAll: async (params = {}) => {
      const response = await api.get(apiEndpoints.courses.list, { params });
      return response.data;
    },

    getById: async (id) => {
      const response = await api.get(apiEndpoints.courses.getById(id));
      return response.data;
    },

    create: async (courseData) => {
      const response = await api.post(apiEndpoints.courses.create, courseData);
      return response.data;
    },

    update: async (id, courseData) => {
      const response = await api.put(apiEndpoints.courses.update(id), courseData);
      return response.data;
    },

    delete: async (id) => {
      const response = await api.delete(apiEndpoints.courses.delete(id));
      return response.data;
    },
  },

  // Assignments
  assignments: {
    getAll: async (params = {}) => {
      const response = await api.get(apiEndpoints.assignments.list, { params });
      return response.data;
    },

    getById: async (id) => {
      const response = await api.get(apiEndpoints.assignments.getById(id));
      return response.data;
    },

    create: async (assignmentData) => {
      const response = await api.post(apiEndpoints.assignments.create, assignmentData);
      return response.data;
    },

    update: async (id, assignmentData) => {
      const response = await api.put(apiEndpoints.assignments.update(id), assignmentData);
      return response.data;
    },

    delete: async (id) => {
      const response = await api.delete(apiEndpoints.assignments.delete(id));
      return response.data;
    },

    submit: async (assignmentId, submissionData) => {
      const response = await api.post(apiEndpoints.assignments.submit(assignmentId), submissionData);
      return response.data;
    },
  },

  // Schedule
  schedule: {
    getAll: async (params = {}) => {
      const response = await api.get(apiEndpoints.schedule.list, { params });
      return response.data;
    },

    getByClass: async (standard, division) => {
      const response = await api.get(apiEndpoints.schedule.getByClass(standard, division));
      return response.data;
    },

    getByTeacher: async (teacherId) => {
      const response = await api.get(apiEndpoints.schedule.getByTeacher(teacherId));
      return response.data;
    },

    create: async (scheduleData) => {
      const response = await api.post(apiEndpoints.schedule.create, scheduleData);
      return response.data;
    },

    update: async (id, scheduleData) => {
      const response = await api.put(apiEndpoints.schedule.update(id), scheduleData);
      return response.data;
    },

    delete: async (id) => {
      const response = await api.delete(apiEndpoints.schedule.delete(id));
      return response.data;
    },
  },

  // Reports
  reports: {
    getDashboard: async () => {
      const response = await api.get(apiEndpoints.reports.dashboard);
      return response.data;
    },

    getAttendance: async (params) => {
      const response = await api.get(apiEndpoints.reports.attendance, { params });
      return response.data;
    },

    getGrades: async (params) => {
      const response = await api.get(apiEndpoints.reports.grades, { params });
      return response.data;
    },

    getStudents: async (params) => {
      const response = await api.get(apiEndpoints.reports.students, { params });
      return response.data;
    },

    getTeachers: async (params) => {
      const response = await api.get(apiEndpoints.reports.teachers, { params });
      return response.data;
    },

    export: async (params) => {
      const response = await api.get(apiEndpoints.reports.export, {
        params,
        responseType: 'blob'
      });
      return response.data;
    },
  },

  // Notifications
  notifications: {
    getAll: async (params = {}) => {
      const response = await api.get(apiEndpoints.notifications.list, { params });
      return response.data;
    },

    markAsRead: async (id) => {
      const response = await api.put(apiEndpoints.notifications.markAsRead(id));
      return response.data;
    },

    markAllAsRead: async () => {
      const response = await api.put(apiEndpoints.notifications.markAllAsRead);
      return response.data;
    },

    create: async (notificationData) => {
      const response = await api.post(apiEndpoints.notifications.create, notificationData);
      return response.data;
    },
  },

  // Activities
  activities: {
    getRecent: async (limit = 10) => {
      const response = await api.get(apiEndpoints.activities.getRecent(limit));
      return response.data;
    },

    getAll: async (params = {}) => {
      const response = await api.get(apiEndpoints.activities.getAll, { params });
      return response.data;
    },

    create: async (activityData) => {
      const response = await api.post(apiEndpoints.activities.create, activityData);
      return response.data;
    },
  },

  // Files
  files: {
    upload: async (file, type = 'document') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await api.post(apiEndpoints.files.upload, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    download: async (filename) => {
      const response = await api.get(apiEndpoints.files.download(filename), {
        responseType: 'blob'
      });
      return response.data;
    },

    delete: async (filename) => {
      const response = await api.delete(apiEndpoints.files.delete(filename));
      return response.data;
    },
  },

  // Dashboard
  dashboard: {
    getStats: async () => {
      // Get combined stats from different endpoints
      const [studentStats, teacherStats] = await Promise.all([
        apiService.students.getStats(),
        apiService.teachers.getStats()
      ]);

      return {
        students: studentStats.stats,
        teachers: teacherStats.stats,
      };
    },
  },
};

export default api;
