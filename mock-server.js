import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockData = {
  dashboard: {
    stats: {
      totalStudents: 1284,
      activeTeachers: 84,
      activeCourses: 42,
      avgAttendance: '94.2%',
      topPerformers: 156,
      pendingTasks: 23
    },
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
  },
  activities: [
    { id: 1, user: 'John Doe', avatar: 'JD', action: 'Enrolled in Physics', date: '2 mins ago', status: 'success' },
    { id: 2, user: 'Sarah Smith', avatar: 'SS', action: 'Submitted Assignment 4', date: '45 mins ago', status: 'info' },
    { id: 3, user: 'Dr. Brown', avatar: 'DB', action: 'Scheduled Math Exam', date: '2 hours ago', status: 'warning' },
    { id: 4, user: 'Mike Ross', avatar: 'MR', action: 'Teacher Profile Updated', date: '5 hours ago', status: 'success' },
    { id: 5, user: 'Emma Stone', avatar: 'ES', action: 'Absence recorded', date: 'Yesterday', status: 'danger' },
  ]
};

// Routes
app.get('/api/reports/dashboard', (req, res) => {
  // Simulate API delay
  setTimeout(() => {
    res.json(mockData.dashboard);
  }, 500);
});

app.get('/api/activities/recent', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const recentActivities = mockData.activities.slice(0, limit);

  setTimeout(() => {
    res.json(recentActivities);
  }, 300);
});

// Auth routes (mock)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Simple mock authentication
  if (email && password) {
    setTimeout(() => {
      res.json({
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 1,
          name: 'Admin User',
          email: email,
          role: 'admin'
        }
      });
    }, 500);
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (token && token.startsWith('mock-jwt-token')) {
    res.json({ valid: true, user: { id: 1, name: 'Admin User', role: 'admin' } });
  } else {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Students API endpoints
const mockStudents = [];
// Generate initial students
for (let grade = 1; grade <= 10; grade++) {
  ['A', 'B', 'C'].forEach(div => {
    for (let i = 1; i <= 5; i++) { // Fewer for mock speed
      mockStudents.push({
        id: `student_${grade}_${div}_${i}`,
        rollNumber: i,
        name: `Student ${grade}${div}${i}`,
        email: `student${grade}${div}${i}@school.com`,
        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        standard: grade,
        division: div,
        class: `Grade ${grade}-${div}`,
        status: 'Active',
        admissionDate: '2024-04-01'
      });
    }
  });
}

app.get('/api/students', (req, res) => {
  const { standard, division, search, page = 1, limit = 20 } = req.query;
  let students = [...mockStudents];

  if (standard) students = students.filter(s => s.standard === parseInt(standard));
  if (division) students = students.filter(s => s.division === division);
  if (search) {
    students = students.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  const startIndex = (page - 1) * limit;
  const paginatedStudents = students.slice(startIndex, startIndex + parseInt(limit));

  res.json({
    students: paginatedStudents,
    total: students.length,
    page: parseInt(page),
    totalPages: Math.ceil(students.length / limit)
  });
});

app.post('/api/students', (req, res) => {
  const newStudent = {
    id: `student_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  mockStudents.unshift(newStudent);
  res.status(201).json(newStudent);
});

// Teachers routes
app.get('/api/teachers', (req, res) => {
  const teachers = [
    { id: 1, name: 'Dr. Rajesh Kumar', subject: 'Mathematics', experience: 15 },
    { id: 2, name: 'Ms. Priya Singh', subject: 'English', experience: 8 },
    { id: 3, name: 'Mr. Amit Patel', subject: 'Science', experience: 12 },
  ];

  setTimeout(() => {
    res.json(teachers);
  }, 300);
});

// Attendance routes
app.get('/api/attendance/date/:date', (req, res) => {
  const { date } = req.params;
  const attendance = [
    { studentId: 1, studentName: 'Aarav Kumar', status: 'present', date },
    { studentId: 2, studentName: 'Priya Sharma', status: 'present', date },
    { studentId: 3, studentName: 'Rohan Singh', status: 'absent', date },
  ];

  setTimeout(() => {
    res.json(attendance);
  }, 300);
});

app.post('/api/attendance/mark', (req, res) => {
  const attendanceData = req.body;

  setTimeout(() => {
    res.status(201).json({ message: 'Attendance marked successfully', data: attendanceData });
  }, 500);
});

// Notifications endpoints
app.get('/api/notifications', (req, res) => {
  const notifications = [
    {
      id: 1,
      title: 'New Student Enrollment',
      message: 'Aarav Kumar has been enrolled in Grade 5-A',
      type: 'info',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      priority: 'normal'
    },
    {
      id: 2,
      title: 'Attendance Alert',
      message: 'Grade 8-B has low attendance today (65%)',
      type: 'warning',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      priority: 'high'
    },
    {
      id: 3,
      title: 'Grade Submission Due',
      message: 'Term 2 grades are due in 2 days',
      type: 'reminder',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      priority: 'normal'
    },
    {
      id: 4,
      title: 'Parent Meeting Scheduled',
      message: 'PTM scheduled for tomorrow at 10:00 AM',
      type: 'info',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      priority: 'normal'
    }
  ];
  res.json(notifications);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  res.json({ success: true, message: `Notification ${id} marked as read` });
});

app.put('/api/notifications/read-all', (req, res) => {
  res.json({ success: true, message: 'All notifications marked as read' });
});

app.post('/api/notifications', (req, res) => {
  const notification = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  res.json(notification);
});

app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const index = mockStudents.findIndex(s => s.id === id);
  if (index !== -1) {
    mockStudents[index] = { ...mockStudents[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json(mockStudents[index]);
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const index = mockStudents.findIndex(s => s.id === id);
  if (index !== -1) {
    mockStudents.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

// Teachers API endpoints
app.get('/api/teachers', (req, res) => {
  const teachers = [];
  const subjects = ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Physical Education', 'Art', 'Computer Science'];
  const names = ['Sharma', 'Gupta', 'Singh', 'Patel', 'Kumar', 'Verma', 'Jain', 'Agarwal', 'Yadav', 'Shukla'];

  for (let i = 1; i <= 50; i++) {
    teachers.push({
      id: `teacher_${i}`,
      employeeId: `EMP${i.toString().padStart(3, '0')}`,
      name: `Teacher ${names[i % names.length]} ${i}`,
      email: `teacher${i}@school.com`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      subjects: [subjects[i % subjects.length], subjects[(i + 1) % subjects.length]],
      classes: [`Grade ${(i % 10) + 1}-A`, `Grade ${(i % 10) + 1}-B`],
      qualification: 'M.Ed',
      experience: Math.floor(Math.random() * 15) + 5,
      salary: Math.floor(Math.random() * 50000) + 30000,
      status: 'Active',
      joinDate: new Date(2015 + (i % 8), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
    });
  }

  res.json({ teachers, total: teachers.length });
});

app.get('/api/teachers/:id', (req, res) => {
  const { id } = req.params;
  const teacher = {
    id,
    employeeId: 'EMP001',
    name: 'Ms. Priya Sharma',
    email: 'priya.sharma@school.com',
    phone: '+91 9876543210',
    subjects: ['English', 'Literature'],
    classes: ['Grade 5-A', 'Grade 6-A', 'Grade 7-A'],
    qualification: 'M.Ed, B.Ed',
    experience: 8,
    salary: 45000,
    status: 'Active',
    joinDate: '2018-04-01',
    address: '456 Teacher Colony, Delhi',
    emergencyContact: '+91 9876543211',
    specializations: ['English Literature', 'Creative Writing'],
    achievements: ['Best Teacher Award 2023', 'Curriculum Development']
  };
  res.json(teacher);
});

// Attendance API endpoints
app.get('/api/attendance', (req, res) => {
  const { date, standard, division } = req.query;
  const attendanceRecords = [];

  // Generate attendance for 35 students
  for (let i = 1; i <= 35; i++) {
    attendanceRecords.push({
      id: `att_${date || '2024-01-15'}_${i}`,
      studentId: `student_${standard || 5}_${division || 'A'}_${i}`,
      studentName: `Student ${standard || 5}${division || 'A'}${i}`,
      rollNumber: i,
      date: date || '2024-01-15',
      status: Math.random() > 0.15 ? 'present' : 'absent',
      checkInTime: Math.random() > 0.15 ? '08:30:00' : null,
      checkOutTime: Math.random() > 0.15 ? '14:30:00' : null,
      remarks: Math.random() > 0.85 ? 'Late arrival' : null
    });
  }

  res.json({
    attendance: attendanceRecords,
    summary: {
      totalStudents: 35,
      present: attendanceRecords.filter(a => a.status === 'present').length,
      absent: attendanceRecords.filter(a => a.status === 'absent').length,
      percentage: ((attendanceRecords.filter(a => a.status === 'present').length / 35) * 100).toFixed(1)
    }
  });
});

app.post('/api/attendance', (req, res) => {
  const attendanceRecord = {
    id: `att_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  res.json(attendanceRecord);
});

app.put('/api/attendance/:id', (req, res) => {
  const { id } = req.params;
  const updatedRecord = {
    id,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json(updatedRecord);
});

// Courses API endpoints
const mockCourses = [];
const subjects = ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Physical Education', 'Art', 'Computer Science'];
subjects.forEach((subject, index) => {
  for (let grade = 1; grade <= 10; grade++) {
    mockCourses.push({
      id: `course_${subject.toLowerCase()}_${grade}`,
      name: `${subject} - Grade ${grade}`,
      title: `${subject} - Grade ${grade}`, // Added title for compatibility
      subject,
      category: subject, // Added category for compatibility
      grade,
      teacherId: `teacher_${(index * 10 + grade) % 50 + 1}`,
      teacherName: `Teacher ${(index * 10 + grade) % 50 + 1}`,
      instructor: `Teacher ${(index * 10 + grade) % 50 + 1}`, // Added instructor for compatibility
      syllabus: `${subject} syllabus for Grade ${grade}`,
      description: `Master the concepts of ${subject} for Grade ${grade} with interactive problem-solving modules.`,
      duration: '240 hours',
      status: 'Active',
      academicYear: '2024-25'
    });
  }
});

app.get('/api/courses', (req, res) => {
  res.json({ courses: mockCourses, total: mockCourses.length });
});

app.post('/api/courses', (req, res) => {
  const newCourse = {
    id: `course_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  mockCourses.unshift(newCourse);
  res.status(201).json(newCourse);
});

app.put('/api/courses/:id', (req, res) => {
  const { id } = req.params;
  const index = mockCourses.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCourses[index] = { ...mockCourses[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json(mockCourses[index]);
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

app.delete('/api/courses/:id', (req, res) => {
  const { id } = req.params;
  const index = mockCourses.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCourses.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

// Assignments API endpoints
const mockAssignments = [];
const assignmentSubjects = ['English', 'Mathematics', 'Science', 'Social Studies'];

for (let i = 1; i <= 20; i++) {
  mockAssignments.push({
    id: `assignment_${i}`,
    title: `Assignment ${i}: ${assignmentSubjects[i % assignmentSubjects.length]} Exercise`,
    subject: assignmentSubjects[i % assignmentSubjects.length],
    course: assignmentSubjects[i % assignmentSubjects.length],
    grade: (i % 10) + 1,
    teacherId: `teacher_${i % 50 + 1}`,
    teacherName: `Teacher ${i % 50 + 1}`,
    description: `Complete exercises ${i * 10}-${i * 10 + 9} from chapter ${Math.floor(i / 2) + 1}`,
    dueDate: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    status: i % 3 === 0 ? 'pending' : i % 3 === 1 ? 'submitted' : 'graded',
    totalSubmissions: Math.floor(Math.random() * 35) + 1,
    createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString()
  });
}

app.get('/api/assignments', (req, res) => {
  res.json({ assignments: mockAssignments, total: mockAssignments.length });
});

app.post('/api/assignments', (req, res) => {
  const newAssignment = {
    id: `assignment_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  mockAssignments.unshift(newAssignment);
  res.status(201).json(newAssignment);
});

app.put('/api/assignments/:id', (req, res) => {
  const { id } = req.params;
  const index = mockAssignments.findIndex(a => a.id === id);
  if (index !== -1) {
    mockAssignments[index] = { ...mockAssignments[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json(mockAssignments[index]);
  } else {
    res.status(404).json({ error: 'Assignment not found' });
  }
});

app.delete('/api/assignments/:id', (req, res) => {
  const { id } = req.params;
  const index = mockAssignments.findIndex(a => a.id === id);
  if (index !== -1) {
    mockAssignments.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Assignment not found' });
  }
});

// Gradebook API endpoints
app.get('/api/grades', (req, res) => {
  const { studentId, subject, grade } = req.query;
  const grades = [];

  // Generate grades for a student across subjects
  const subjects = ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies'];
  subjects.forEach((subj, index) => {
    for (let term = 1; term <= 2; term++) {
      grades.push({
        id: `grade_${studentId || 'student_1'}_${subj}_${term}`,
        studentId: studentId || 'student_1',
        studentName: 'Aarav Kumar',
        subject: subj,
        grade: grade || 5,
        term,
        marks: Math.floor(Math.random() * 20) + 80,
        maxMarks: 100,
        percentage: Math.floor(Math.random() * 20) + 80,
        grade: ['A+', 'A', 'B+', 'B', 'C'][Math.floor(Math.random() * 5)],
        remarks: Math.random() > 0.7 ? 'Excellent performance' : 'Good work',
        examDate: new Date(2024, term === 1 ? 2 : 9, 15).toISOString().split('T')[0],
        teacherId: `teacher_${index + 1}`,
        teacherName: `Teacher ${index + 1}`
      });
    }
  });

  res.json({ grades, total: grades.length });
});

// Schedule API endpoints
const mockSchedule = [];
const scheduleSubjects = ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Physical Education', 'Art'];
const timeSlots = [
  '08:00-08:45', '08:45-09:30', '09:30-10:15', '10:15-11:00',
  '11:00-11:45', '11:45-12:30', '12:30-13:15'
];

// Seed some data
for (let grade = 1; grade <= 10; grade++) {
  timeSlots.forEach((time, index) => {
    mockSchedule.push({
      id: `schedule_${grade}_A_${index + 1}`,
      grade: grade,
      division: 'A',
      day: 'Monday',
      date: '2024-01-15',
      period: index + 1,
      timeSlot: time,
      subject: scheduleSubjects[index % scheduleSubjects.length],
      teacherId: `teacher_${(index % 50) + 1}`,
      teacherName: `Teacher ${(index % 50) + 1}`,
      classroom: `Room ${101 + index}`,
      status: 'scheduled'
    });
  });
}

app.get('/api/schedule', (req, res) => {
  const { grade, division, date } = req.query;
  let schedule = [...mockSchedule];

  if (grade) schedule = schedule.filter(s => s.grade === parseInt(grade));
  if (division) schedule = schedule.filter(s => s.division === division);
  if (date) schedule = schedule.filter(s => s.date === date);

  res.json({ schedule, total: schedule.length });
});

app.post('/api/schedule', (req, res) => {
  const newSchedule = {
    id: `schedule_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  mockSchedule.push(newSchedule);
  res.status(201).json(newSchedule);
});

app.put('/api/schedule/:id', (req, res) => {
  const { id } = req.params;
  const index = mockSchedule.findIndex(s => s.id === id);
  if (index !== -1) {
    mockSchedule[index] = { ...mockSchedule[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json(mockSchedule[index]);
  } else {
    res.status(404).json({ error: 'Schedule entry not found' });
  }
});

app.delete('/api/schedule/:id', (req, res) => {
  const { id } = req.params;
  const index = mockSchedule.findIndex(s => s.id === id);
  if (index !== -1) {
    mockSchedule.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Schedule entry not found' });
  }
});

// Reports API endpoints
app.get('/api/reports/students', (req, res) => {
  const report = {
    totalStudents: 1284,
    activeStudents: 1245,
    newAdmissions: 156,
    gradeWise: [
      { grade: 1, count: 142, boys: 78, girls: 64 },
      { grade: 2, count: 138, boys: 72, girls: 66 },
      { grade: 3, count: 145, boys: 75, girls: 70 },
      { grade: 4, count: 132, boys: 68, girls: 64 },
      { grade: 5, count: 148, boys: 76, girls: 72 },
      { grade: 6, count: 135, boys: 69, girls: 66 },
      { grade: 7, count: 129, boys: 67, girls: 62 },
      { grade: 8, count: 141, boys: 73, girls: 68 },
      { grade: 9, count: 122, boys: 63, girls: 59 },
      { grade: 10, count: 152, boys: 78, girls: 74 }
    ],
    attendance: {
      overall: 94.2,
      gradeWise: [92, 93, 95, 91, 94, 93, 96, 92, 95, 94]
    },
    performance: {
      averageGrade: 'B+',
      topPerformers: 156,
      gradeDistribution: [
        { grade: 'A+', count: 89 },
        { grade: 'A', count: 145 },
        { grade: 'B+', count: 234 },
        { grade: 'B', count: 312 },
        { grade: 'C', count: 198 }
      ]
    }
  };
  res.json(report);
});

app.get('/api/reports/teachers', (req, res) => {
  const report = {
    totalTeachers: 84,
    activeTeachers: 82,
    subjectWise: [
      { subject: 'English', count: 8 },
      { subject: 'Mathematics', count: 7 },
      { subject: 'Science', count: 9 },
      { subject: 'Social Studies', count: 6 },
      { subject: 'Hindi', count: 8 },
      { subject: 'Physical Education', count: 4 },
      { subject: 'Art', count: 3 },
      { subject: 'Computer Science', count: 5 }
    ],
    experience: {
      '0-5 years': 12,
      '5-10 years': 28,
      '10-15 years': 22,
      '15+ years': 22
    },
    qualifications: {
      'M.Ed': 45,
      'B.Ed': 25,
      'M.Sc': 8,
      'Ph.D': 6
    }
  };
  res.json(report);
});

app.get('/api/reports/attendance', (req, res) => {
  const report = {
    overall: {
      averageAttendance: 94.2,
      totalDays: 180,
      presentDays: 169,
      absentDays: 11
    },
    monthly: [
      { month: 'Apr', attendance: 96.5, present: 1695, absent: 62 },
      { month: 'May', attendance: 94.8, present: 1706, absent: 94 },
      { month: 'Jun', attendance: 93.2, present: 1678, absent: 122 },
      { month: 'Jul', attendance: 95.1, present: 1712, absent: 88 },
      { month: 'Aug', attendance: 92.8, present: 1670, absent: 130 },
      { month: 'Sep', attendance: 94.9, present: 1708, absent: 92 }
    ],
    gradeWise: [
      { grade: 1, attendance: 96.2 },
      { grade: 2, attendance: 95.8 },
      { grade: 3, attendance: 94.5 },
      { grade: 4, attendance: 93.7 },
      { grade: 5, attendance: 92.1 },
      { grade: 6, attendance: 94.3 },
      { grade: 7, attendance: 95.6 },
      { grade: 8, attendance: 93.8 },
      { grade: 9, attendance: 91.4 },
      { grade: 10, attendance: 92.7 }
    ]
  };
  res.json(report);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock SMS API server running on port ${PORT}`);
  console.log(`Dashboard data available at http://localhost:${PORT}/api/reports/dashboard`);
  console.log(`Recent activities at http://localhost:${PORT}/api/activities/recent`);
});