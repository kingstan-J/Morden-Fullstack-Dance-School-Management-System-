import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiUsers, FiAward, FiMusic, FiPlay } from 'react-icons/fi';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../utils/api';

const courseIcons = { Bharatanatyam: '💃', Contemporary: '🎭', 'Hip Hop': '🎤', Salsa: '🕺', Ballet: '🩰', Kathak: '💫' };

const HomePage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get('/courses').then(r => setCourses(r.data.data.slice(0, 4))).catch(() => {});
  }, []);

  const stats = [
    { icon: FiUsers, value: '500+', label: 'Happy Students' },
    { icon: FiAward, value: '15+', label: 'Expert Trainers' },
    { icon: FiMusic, value: '10+', label: 'Dance Styles' },
    { icon: FiStar, value: '8+', label: 'Years Experience' },
  ];

  const features = [
    { icon: '🎓', title: 'Expert Trainers', desc: 'Learn from certified professionals with years of performance experience.' },
    { icon: '📅', title: 'Flexible Schedule', desc: 'Classes at convenient timings for students of all age groups.' },
    { icon: '🏆', title: 'Certified Courses', desc: 'Receive internationally recognized certificates upon completion.' },
    { icon: '💻', title: 'Digital Resources', desc: 'Access learning materials and track progress online anytime.' },
    { icon: '👥', title: 'Small Batches', desc: 'Personalized attention with limited students per batch.' },
    { icon: '🎪', title: 'Annual Events', desc: 'Showcase your talent at our annual dance performances.' },
  ];

  const testimonials = [
    { name: 'Ananya K.', course: 'Bharatanatyam', text: 'The training here is exceptional. My trainer is so patient and knowledgeable!', rating: 5 },
    { name: 'Rohan D.', course: 'Hip Hop', text: "Best dance academy in the city. The curriculum is well-structured and fun!", rating: 5 },
    { name: 'Sneha P.', course: 'Contemporary', text: 'I joined as a complete beginner and now I perform confidently. Highly recommend!', rating: 5 },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-6">
              <FiMusic size={16} /> Welcome to Drizzle Dance Academy
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Where Every <span className="gradient-text">Step</span><br />Tells a Story
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover the joy of dance with world-class trainers. From classical to contemporary, find your rhythm and express your soul.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/auth" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                Start Your Journey <FiArrowRight />
              </Link>
              <Link to="/courses" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
                <FiPlay /> Explore Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center mx-auto mb-3">
                  <Icon className="text-purple-400" size={22} />
                </div>
                <p className="text-3xl font-bold gradient-text">{value}</p>
                <p className="text-gray-400 text-sm">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Our <span className="gradient-text">Courses</span></h2>
          <p className="text-gray-400 max-w-xl mx-auto">Choose from our diverse range of dance styles taught by expert trainers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, i) => (
            <motion.div key={course._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card p-6 hover:border-purple-500/40 transition-all group cursor-pointer">
              <div className="text-4xl mb-4">{courseIcons[course.danceStyle] || '🎵'}</div>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 capitalize">{course.level}</span>
              <h3 className="text-lg font-bold text-white mt-3 mb-2">{course.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-bold">₹{course.fee?.toLocaleString()}/mo</span>
                <Link to="/auth" className="text-xs text-pink-400 flex items-center gap-1 hover:gap-2 transition-all">Enroll <FiArrowRight size={12} /></Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/courses" className="btn-secondary inline-flex items-center gap-2">View All Courses <FiArrowRight size={16} /></Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why <span className="gradient-text">Drizzle Dance</span>?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card p-6 hover:border-purple-500/40 transition-all">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Student <span className="gradient-text">Stories</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => <FiStar key={j} className="text-yellow-400 fill-yellow-400" size={14} />)}
              </div>
              <p className="text-gray-300 text-sm mb-4 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{t.name}</p>
                  <p className="text-purple-400 text-xs">{t.course}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card p-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to <span className="gradient-text">Dance</span>?</h2>
            <p className="text-gray-300 mb-8">Join hundreds of students already enrolled at Drizzle Dance Academy.</p>
            <Link to="/auth" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              Enroll Now <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
