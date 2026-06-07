import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ children, roles }) => {
  const { user, token } = useAuthStore();
  if (!token || !user) return <Navigate to="/auth" replace />;
  if (roles && !roles.includes(user.role)) {
    const dashMap = { admin: '/admin', trainer: '/trainer', student: '/student' };
    return <Navigate to={dashMap[user.role] || '/'} replace />;
  }
  return children;
};

export default ProtectedRoute;
