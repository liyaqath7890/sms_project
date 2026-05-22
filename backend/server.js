import express from 'express';
import cors from 'cors';
import pool from './config/database.js';
import dotenv from 'dotenv';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (
      !origin ||
      /^http:\/\/localhost:\d+$/.test(origin) ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const healthHandler = (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

app.get('/api/db-status', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, message: 'Database connected', time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      code: err.code,
      detail: err.message
    });
  }
});

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, message: 'Database connected', time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      code: err.code,
      detail: err.message
    });
  }
});

import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import teacherRoutes from './routes/teachers.js';
import attendanceRoutes from './routes/attendance.js';
import courseRoutes from './routes/courses.js';
import gradeRoutes from './routes/grades.js';
import enrollmentRoutes from './routes/enrollments.js';
import classRoutes from './routes/classes.js';
import scheduleRoutes from './routes/schedules.js';
import announcementRoutes from './routes/announcements.js';
import aiRoutes from './routes/ai.js';
import notificationRoutes from './routes/notifications.js';
import subjectRoutes from './routes/subjects.js';

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/subjects', subjectRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (!process.env.VERCEL) {
  process.on('SIGTERM', () => pool.end(() => process.exit(0)));
  process.on('SIGINT', () => pool.end(() => process.exit(0)));

  app.listen(PORT, () => {
    console.log(`Edustrem Server running on port ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
  });
}

export default app;
