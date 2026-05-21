import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './authentication/context/AuthContext';
import { AcademicSessionProvider } from './services/academicSessionContext';
import { AppProvider, ErrorBoundary, AppContainer } from './contexts/AppContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import AIChatbot from './components/custom/AIChatbot';

const Dashboard = lazy(() => import('./features/dashboard/pages/PremiumDashboard'));
const Login = lazy(() => import('./authentication/pages/Login'));
const Register = lazy(() => import('./authentication/pages/Register'));
const ForgotPassword = lazy(() => import('./authentication/pages/ForgotPassword'));
const EmailSent = lazy(() => import('./authentication/pages/EmailSent'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const StudentRoutes = lazy(() => import('./features/student/routes/StudentRoutes'));
const TeacherRoutes = lazy(() => import('./features/teacher/routes/TeacherRoutes'));
const CourseRoutes = lazy(() => import('./features/course/routes/CourseRoutes'));
const EnrollmentRoutes = lazy(() => import('./features/enrollment/routes/EnrollmentRoutes'));
const AssignmentRoutes = lazy(() => import('./features/assignment/routes/AssignmentRoutes'));
const AttendanceRoutes = lazy(() => import('./features/attendance/routes/AttendanceRoutes'));
const GradebookRoutes = lazy(() => import('./features/gradebook/routes/GradebookRoutes'));
const ScheduleRoutes = lazy(() => import('./features/schedule/routes/ScheduleRoutes'));
const ClassroomRoutes = lazy(() => import('./features/classroom/routes/ClassroomRoutes'));
const CommunicationRoutes = lazy(() => import('./features/communication/routes/CommunicationRoutes'));
const ReportsRoutes = lazy(() => import('./features/reports/routes/ReportsRoutes'));

const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AuthProvider>
          <AcademicSessionProvider>
            <Router>
              <AppContainer>
                <AIChatbot />
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />
                    <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                    <Route path="/auth/email-sent" element={<EmailSent />} />
                    <Route path="/" element={<ProtectedRoute fallback={<LandingPage />}><Layout><Dashboard /></Layout></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                    <Route path="/students/*" element={<ProtectedRoute><Layout><StudentRoutes /></Layout></ProtectedRoute>} />
                    <Route path="/teachers/*" element={<ProtectedRoute><Layout><TeacherRoutes /></Layout></ProtectedRoute>} />
                    <Route path="/courses/*" element={<ProtectedRoute><Layout><CourseRoutes /></Layout></ProtectedRoute>} />
                    <Route path="/enrollment/*" element={<ProtectedRoute><Layout><EnrollmentRoutes /></Layout></ProtectedRoute>} />
                    <Route path="/assignments/*" element={<ProtectedRoute><Layout><AssignmentRoutes /></Layout></ProtectedRoute>} />
                    <Route path="/attendance/*" element={<ProtectedRoute><Layout><AttendanceRoutes /></Layout></ProtectedRoute>} />
                    <Route path="/gradebook/*" element={<ProtectedRoute><Layout><GradebookRoutes /></Layout></ProtectedRoute>} />
                    <Route path="/schedule/*" element={<ProtectedRoute><Layout><ScheduleRoutes /></Layout></ProtectedRoute>} />
                    <Route path="/classroom/*" element={<ProtectedRoute><Layout><ClassroomRoutes /></Layout></ProtectedRoute>} />
                    <Route path="/communication/*" element={<ProtectedRoute><Layout><CommunicationRoutes /></Layout></ProtectedRoute>} />
                    <Route path="/reports/*" element={<ProtectedRoute><Layout><ReportsRoutes /></Layout></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Suspense>
              </AppContainer>
            </Router>
          </AcademicSessionProvider>
        </AuthProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
