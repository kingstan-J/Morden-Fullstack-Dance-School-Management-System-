import { Outlet } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FiHome, FiUsers, FiCalendar, FiDollarSign, FiAward, FiUpload, FiUser } from 'react-icons/fi';

const navItems = [
  { to: '/trainer', icon: FiHome, label: 'Dashboard' },
  { to: '/trainer/students', icon: FiUsers, label: 'My Students' },
  { to: '/trainer/attendance', icon: FiCalendar, label: 'Attendance' },
  { to: '/trainer/payments', icon: FiDollarSign, label: 'Fee Status' },
  { to: '/trainer/certificates', icon: FiAward, label: 'Certificates' },
  { to: '/trainer/materials', icon: FiUpload, label: 'Materials' },
  { to: '/trainer/salary', icon: FiDollarSign, label: 'Salary' },
  { to: '/trainer/profile', icon: FiUser, label: 'Profile' },
];

const TrainerLayout = () => (
  <DashboardLayout navItems={navItems} role="trainer">
    <Outlet />
  </DashboardLayout>
);

export default TrainerLayout;
