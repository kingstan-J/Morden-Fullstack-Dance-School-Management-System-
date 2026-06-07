import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiBell, FiLogOut, FiMusic, FiShield } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import NotificationPanel from '../common/NotificationPanel';

const DashboardLayout = ({ children, navItems, role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const roleColors = { admin: 'from-red-500 to-pink-500', trainer: 'from-purple-500 to-indigo-500', student: 'from-pink-500 to-purple-500' };

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data || []);
      setUnreadCount((data.data || []).filter((n) => !n.isRead).length);
    } catch {
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch {
      toast.error('Could not mark notification read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      fetchNotifications();
    } catch {
      toast.error('Could not mark all notifications read');
    }
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!mounted) return;
      await fetchNotifications();
    };
    run();

    const interval = setInterval(() => {
      if (mounted) fetchNotifications();
    }, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen]);

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:w-16 lg:translate-x-0'
      } transition-all duration-300 flex flex-col bg-black/60 border-r border-white/10 min-h-screen fixed z-30`}>
        <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} p-4 border-b border-white/10`}>
          {sidebarOpen && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                <FiMusic className="text-white" size={14} />
              </div>
              <span className="font-bold text-sm gradient-text">Drizzle Dance</span>
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white p-1">
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        {sidebarOpen && (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${roleColors[role]} flex items-center justify-center text-white font-bold text-sm`}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${roleColors[role]} text-white capitalize`}>{role}</span>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} end={to === '/student' || to === '/trainer' || to === '/admin'}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center' : ''}`}>
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout} className={`sidebar-link w-full hover:!text-red-400 hover:!bg-red-500/10 ${!sidebarOpen ? 'justify-center' : ''}`}>
            <FiLogOut size={18} className="shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} ml-0`}>
        <header className="sticky top-0 z-20 bg-black/40 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all lg:hidden">
              <FiMenu size={18} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            {role === 'admin' && user?.role === 'admin' && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-pink-400 transition-all"
              >
                <FiShield size={16} className="text-white" />
                Admin Panel
              </Link>
            )}
            <h1 className="text-white font-semibold capitalize">{role} Panel</h1>
            <div ref={notificationRef} className="relative">
            <button onClick={() => setNotificationsOpen((prev) => !prev)} className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
              <FiBell size={18} />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full" />}
            </button>
            {notificationsOpen && (
              <NotificationPanel
                notifications={notifications}
                loading={loadingNotifications}
                onMarkRead={handleMarkRead}
                onMarkAllRead={handleMarkAllRead}
                onClose={() => setNotificationsOpen(false)}
              />
            )}
          </div>
          <Link to={`/${role}/profile`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleColors[role]} flex items-center justify-center text-white text-xs font-bold`}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
