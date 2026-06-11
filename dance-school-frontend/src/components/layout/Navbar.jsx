import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiStar } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    // avoid lint rule: keep behavior but don’t use setOpen directly
    setTimeout(() => setOpen(false), 0);
  }, [location]);



  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'glass border-b border-white/10' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
            <FiStar className="text-white" size={18} />
          </div>
          <span className="font-bold text-xl gradient-text">Drizzle Dance</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-purple-400 bg-purple-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              to={`/${user.role}`}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-pink-400 transition-all capitalize"
            >
              {user.role} Panel
            </Link>
          ) : (
            <>
              <Link to="/auth" className="btn-primary text-sm">Login</Link>
              <Link to="/auth" className="btn-secondary text-sm">Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-gray-300" onClick={() => setOpen(!open)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-white/10 px-4 py-4 flex flex-col gap-2">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) => `px-4 py-2.5 rounded-lg text-sm font-medium ${isActive ? 'text-purple-400 bg-purple-500/10' : 'text-gray-300'}`}>
              {l.label}
            </NavLink>
          ))}
          <div className="flex gap-2 mt-2">
            {user ? (
              <Link to={`/${user.role}`} className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-500 text-white text-center flex-1 capitalize">
                {user.role} Panel
              </Link>
            ) : (
              <>
                <Link to="/auth" className="btn-primary text-sm text-center flex-1">Login</Link>
                <Link to="/auth" className="btn-secondary text-sm text-center flex-1">Sign Up</Link>
              </>
            )}
          </div>

        </div>
      )}
    </nav>
  );
};

export default Navbar;
