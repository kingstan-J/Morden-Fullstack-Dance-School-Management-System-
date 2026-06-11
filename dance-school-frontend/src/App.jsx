import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Scroll Restoration
import ScrollToTop from './components/common/ScrollToTop';

// Auth
import ProtectedRoute from './components/common/ProtectedRoute';


// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import CoursesPage from './pages/public/CoursesPage';
import FAQPage from './pages/public/FAQPage';
import ContactPage from './pages/public/ContactPage';
import PrivacyPage from './pages/public/PrivacyPage';
import TermsPage from './pages/public/TermsPage';

// Auth Page
import AuthPage from './pages/auth/AuthPage';

// Student
import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentFees from './pages/student/StudentFees';
import StudentCertificates from './pages/student/StudentCertificates';
import StudentProfile from './pages/student/StudentProfile';

// Trainer
import TrainerLayout from './pages/trainer/TrainerLayout';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerStudents from './pages/trainer/TrainerStudents';
import TrainerAttendance from './pages/trainer/TrainerAttendance';
import TrainerPayments from './pages/trainer/TrainerPayments';
import TrainerCertificates from './pages/trainer/TrainerCertificates';
import TrainerMaterials from './pages/trainer/TrainerMaterials';
import TrainerSalary from './pages/trainer/TrainerSalary';
import TrainerProfile from './pages/trainer/TrainerProfile';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminTrainers from './pages/admin/AdminTrainers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminEnrollments from './pages/admin/AdminEnrollments';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminPayments from './pages/admin/AdminPayments';
import AdminSalaries from './pages/admin/AdminSalaries';
import AdminCertificates from './pages/admin/AdminCertificates';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a0533', color: '#fff', border: '1px solid rgba(168,85,247,0.3)' },
          success: { iconTheme: { primary: '#a855f7', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password/:token" element={<AuthPage />} />

        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute roles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }>
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="certificates" element={<StudentCertificates />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* Trainer Routes */}
        <Route path="/trainer" element={
          <ProtectedRoute roles={['trainer']}>
            <TrainerLayout />
          </ProtectedRoute>
        }>
          <Route index element={<TrainerDashboard />} />
          <Route path="students" element={<TrainerStudents />} />
          <Route path="attendance" element={<TrainerAttendance />} />
          <Route path="payments" element={<TrainerPayments />} />
          <Route path="certificates" element={<TrainerCertificates />} />
          <Route path="materials" element={<TrainerMaterials />} />
          <Route path="salary" element={<TrainerSalary />} />
          <Route path="profile" element={<TrainerProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="trainers" element={<AdminTrainers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="enrollments" element={<AdminEnrollments />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="salaries" element={<AdminSalaries />} />
          <Route path="certificates" element={<AdminCertificates />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
