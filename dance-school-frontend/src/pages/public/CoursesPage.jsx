import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../utils/api';
import Badge from '../../components/common/Badge';
import { FiArrowRight, FiClock, FiUsers } from 'react-icons/fi';

// Image imports
import bharatanatyamImg from '../../assets/courses/bharatanatyam.png';
import contemporaryImg from '../../assets/courses/contemporary.png';
import hiphopImg from '../../assets/courses/hiphop.png';
import salsaImg from '../../assets/courses/salsa.png';
import balletImg from '../../assets/courses/ballet.png';

const courseIcons = { Bharatanatyam: '💃', Contemporary: '🎭', 'Hip Hop': '🎤', Salsa: '🕺', Ballet: '🩰', Kathak: '💫' };

const courseImages = {
  Bharatanatyam: bharatanatyamImg,
  Contemporary: contemporaryImg,
  'Hip Hop': hiphopImg,
  Salsa: salsaImg,
  Ballet: balletImg,
  Kathak: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=600&q=80',
};

const defaultCourseImg = 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80';

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
            <div key={course._id} className="glass-card overflow-hidden hover:border-purple-500/40 transition-all group flex flex-col">
              <div className="h-48 w-full overflow-hidden relative">
                <img 
                  src={courseImages[course.danceStyle] || defaultCourseImg} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                />
                <div className="absolute top-3 right-3 text-xl bg-black/50 backdrop-blur-md w-9 h-9 rounded-full flex items-center justify-center border border-white/10">
                  {courseIcons[course.danceStyle] || '🎵'}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge status={course.level} />
                    <span className="text-purple-400 font-bold">₹{course.fee?.toLocaleString()}/mo</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><FiClock size={12} />{course.duration || 'TBD'}</span>
                    <span className="flex items-center gap-1"><FiUsers size={12} />Max {course.maxStudents || 30}</span>
                  </div>
                  {course.trainer && (
                    <p className="text-sm text-gray-400 mb-4">Trainer: <span className="text-purple-300">{course.trainer?.user?.name || 'TBA'}</span></p>
                  )}
                  <p className="text-xs text-gray-500 mb-4">📅 {course.schedule || 'TBD'}</p>
                </div>
                <Link to="/auth" className="btn-primary w-full flex items-center justify-center gap-2 text-sm mt-auto">
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
