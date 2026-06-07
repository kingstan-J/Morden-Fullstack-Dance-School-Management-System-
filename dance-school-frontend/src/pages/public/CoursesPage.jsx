import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../utils/api';
import Badge from '../../components/common/Badge';
import { FiArrowRight, FiClock, FiUsers, FiDollarSign } from 'react-icons/fi';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => { api.get('/courses').then(r => setCourses(r.data.data)).catch(() => {}); }, []);

  const levels = ['all', 'beginner', 'intermediate', 'advanced'];
  const filtered = filter === 'all' ? courses : courses.filter(c => c.level === filter);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Our <span className="gradient-text">Dance Courses</span></h1>
          <p className="text-gray-400">Explore our wide range of dance programs for all skill levels.</p>
        </div>

        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {levels.map(l => (
            <button key={l} onClick={() => setFilter(l)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${filter === l ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(course => (
            <div key={course._id} className="glass-card overflow-hidden hover:border-purple-500/40 transition-all group">
              <div className="h-40 bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center text-6xl">
                {{'Bharatanatyam':'💃','Contemporary':'🎭','Hip Hop':'🎤','Salsa':'🕺','Ballet':'🩰'}[course.danceStyle] || '🎵'}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge status={course.level} />
                  <span className="text-purple-400 font-bold">₹{course.fee?.toLocaleString()}/mo</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><FiClock size={12} />{course.duration}</span>
                  <span className="flex items-center gap-1"><FiUsers size={12} />Max {course.maxStudents}</span>
                </div>
                {course.trainer && (
                  <p className="text-sm text-gray-400 mb-4">Trainer: <span className="text-purple-300">{course.trainer?.user?.name || 'TBA'}</span></p>
                )}
                <p className="text-xs text-gray-500 mb-4">📅 {course.schedule}</p>
                <Link to="/auth" className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                  Enroll Now <FiArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CoursesPage;
