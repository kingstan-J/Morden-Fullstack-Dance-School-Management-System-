import { Outlet } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FiHome, FiBook, FiCalendar, FiDollarSign, FiAward, FiUser } from 'react-icons/fi';

const navItems = [
  { to: '/student', icon: FiHome, label: 'Dashboard' },
  { to: '/student/courses', icon: FiBook, label: 'Courses' },
  { to: '/student/attendance', icon: FiCalendar, label: 'Attendance' },
  { to: '/student/fees', icon: FiDollarSign, label: 'Fees' },
  { to: '/student/certificates', icon: FiAward, label: 'Certificates' },
  { to: '/student/profile', icon: FiUser, label: 'Profile' },
];

const StudentLayout = () => (
  <DashboardLayout navItems={navItems} role="student">
    <Outlet />
  </DashboardLayout>
);

export default StudentLayout;
