import { Outlet } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  FiHome, FiUsers, FiBook, FiCalendar, FiDollarSign,
  FiAward, FiUserCheck, FiList, FiBarChart2
} from 'react-icons/fi';

const navItems = [
  { to: '/admin', icon: FiHome, label: 'Dashboard' },
  { to: '/admin/students', icon: FiUsers, label: 'Students' },
  { to: '/admin/trainers', icon: FiUserCheck, label: 'Trainers' },
  { to: '/admin/courses', icon: FiBook, label: 'Courses' },
  { to: '/admin/enrollments', icon: FiList, label: 'Enrollments' },
  { to: '/admin/attendance', icon: FiCalendar, label: 'Attendance' },
  { to: '/admin/payments', icon: FiDollarSign, label: 'Payments' },
  { to: '/admin/salaries', icon: FiDollarSign, label: 'Salaries' },
  { to: '/admin/certificates', icon: FiAward, label: 'Certificates' },
];

const AdminLayout = () => (
  <DashboardLayout navItems={navItems} role="admin">
    <Outlet />
  </DashboardLayout>
);

export default AdminLayout;
