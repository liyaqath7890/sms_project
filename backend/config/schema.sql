-- Database Schema for Edustrem SMS
-- Run this script to initialize the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Academic sessions
CREATE TABLE academic_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL, -- e.g., "2024-2025"
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Standards/Grades
CREATE TABLE standards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL, -- e.g., "Grade 1", "Grade 2"
  level INTEGER NOT NULL, -- 1, 2, 3, etc.
  academic_session_id UUID REFERENCES academic_sessions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Divisions/Sections
CREATE TABLE divisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(10) NOT NULL, -- e.g., "A", "B", "C"
  standard_id UUID REFERENCES standards(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subjects
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  academic_session_id UUID REFERENCES academic_sessions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Students
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  admission_number VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  parent_name VARCHAR(200),
  parent_phone VARCHAR(20),
  parent_email VARCHAR(255),
  division_id UUID REFERENCES divisions(id),
  enrollment_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Teachers
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  qualification VARCHAR(255),
  experience_years INTEGER DEFAULT 0,
  joining_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Teacher-Subject assignments
CREATE TABLE teacher_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id),
  subject_id UUID REFERENCES subjects(id),
  division_id UUID REFERENCES divisions(id),
  academic_session_id UUID REFERENCES academic_sessions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(teacher_id, subject_id, division_id, academic_session_id)
);

-- Attendance
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  division_id UUID REFERENCES divisions(id),
  subject_id UUID REFERENCES subjects(id),
  teacher_id UUID REFERENCES teachers(id),
  date DATE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late')),
  remarks TEXT,
  academic_session_id UUID REFERENCES academic_sessions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, date, subject_id)
);

-- Grades/Report Cards
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  subject_id UUID REFERENCES subjects(id),
  division_id UUID REFERENCES divisions(id),
  academic_session_id UUID REFERENCES academic_sessions(id),
  exam_type VARCHAR(50) NOT NULL, -- e.g., "Mid-term", "Final", "Quiz"
  marks_obtained DECIMAL(5,2),
  total_marks DECIMAL(5,2),
  grade VARCHAR(5), -- e.g., "A+", "B", "C"
  percentage DECIMAL(5,2),
  remarks TEXT,
  exam_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES subjects(id),
  division_id UUID REFERENCES divisions(id),
  teacher_id UUID REFERENCES teachers(id),
  academic_session_id UUID REFERENCES academic_sessions(id),
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Announcements/Communications
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  target_audience VARCHAR(50) CHECK (target_audience IN ('all', 'students', 'teachers', 'parents')),
  division_id UUID REFERENCES divisions(id),
  is_urgent BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit log
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_students_division ON students(division_id);
CREATE INDEX idx_students_user ON students(user_id);
CREATE INDEX idx_teachers_user ON teachers(user_id);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_attendance_division_date ON attendance(division_id, date);
CREATE INDEX idx_grades_student_subject ON grades(student_id, subject_id);
CREATE INDEX idx_announcements_published ON announcements(is_published, published_at DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Insert default academic session
INSERT INTO academic_sessions (name, start_date, end_date, is_active) VALUES
('2024-2025', '2024-06-01', '2025-05-31', true);

-- Insert default standards
INSERT INTO standards (name, level, academic_session_id) VALUES
('Grade 1', 1, (SELECT id FROM academic_sessions WHERE name = '2024-2025')),
('Grade 2', 2, (SELECT id FROM academic_sessions WHERE name = '2024-2025')),
('Grade 3', 3, (SELECT id FROM academic_sessions WHERE name = '2024-2025')),
('Grade 4', 4, (SELECT id FROM academic_sessions WHERE name = '2024-2025')),
('Grade 5', 5, (SELECT id FROM academic_sessions WHERE name = '2024-2025')),
('Grade 6', 6, (SELECT id FROM academic_sessions WHERE name = '2024-2025')),
('Grade 7', 7, (SELECT id FROM academic_sessions WHERE name = '2024-2025')),
('Grade 8', 8, (SELECT id FROM academic_sessions WHERE name = '2024-2025')),
('Grade 9', 9, (SELECT id FROM academic_sessions WHERE name = '2024-2025')),
('Grade 10', 10, (SELECT id FROM academic_sessions WHERE name = '2024-2025'));

-- Insert default divisions for each standard
INSERT INTO divisions (name, standard_id)
SELECT 'A', id FROM standards UNION ALL
SELECT 'B', id FROM standards UNION ALL
SELECT 'C', id FROM standards;

-- Insert default subjects
INSERT INTO subjects (name, code, description, academic_session_id) VALUES
('Mathematics', 'MATH', 'Basic mathematics and problem solving', (SELECT id FROM academic_sessions WHERE name = '2024-2025')),
('English', 'ENG', 'English language and literature', (SELECT id FROM academic_sessions WHERE name = '2024-2025')),
('Science', 'SCI', 'General science including physics, chemistry, biology', (SELECT id FROM academic_sessions WHERE name = '2024-2025')),
('Social Studies', 'SST', 'History, geography, and civics', (SELECT id FROM academic_sessions WHERE name = '2024-2025')),
('Computer Science', 'CS', 'Introduction to programming and digital literacy', (SELECT id FROM academic_sessions WHERE name = '2024-2025')),
('Physical Education', 'PE', 'Sports and physical activities', (SELECT id FROM academic_sessions WHERE name = '2024-2025')),
('Art', 'ART', 'Visual arts and creativity', (SELECT id FROM academic_sessions WHERE name = '2024-2025')),
('Music', 'MUS', 'Music theory and practice', (SELECT id FROM academic_sessions WHERE name = '2024-2025'));