import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiArrowRight } from 'react-icons/fi';

const danceStyleIcons = {
  Bharatanatyam: '💃',
  Contemporary: '🎭',
  'Hip Hop': '🎤',
  Salsa: '🕺',
  Jazz: '🎷',
  Kathak: '🕉️',
  Ballet: '🩰',
  Bollywood: '🎬',
  Zumba: '🔥',
};

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/courses'),
      api.get('/enrollments/my').catch(() => ({ data: { data: null } })),
    ]).then(([c, e]) => {
      setCourses(c.data.data);
      setEnrollment(e.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (courseId) => {
    setEnrolling(courseId);
    try {
      await api.post('/enrollments', { courseId });
      const e = await api.get('/enrollments/my');
      setEnrollment(e.data.data);
      toast.success('Enrolled successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally { setEnrolling(null); }
  };

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Browse Courses</h1>

      {enrollment && (
        <div className="glass-card p-6 border-green-500/30 bg-green-500/5 space-y-4">
          <h2 className="text-lg font-bold text-green-400">✓ You are enrolled!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Course</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{danceStyleIcons[enrollment.course?.danceStyle] || '🎵'}</span>
                <div>
                  <p className="text-white font-bold">{enrollment.course?.title}</p>
                  <p className="text-gray-400 text-xs">{enrollment.course?.danceStyle} · {enrollment.course?.level}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">📅 {enrollment.course?.schedule}</p>
              <p className="text-gray-400 text-sm">⏱ {enrollment.course?.duration}</p>
              <p className="text-gray-400 text-sm">💰 ₹{enrollment.course?.fee?.toLocaleString()}/month</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Your Trainer</p>
              {enrollment.trainer ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {enrollment.trainer?.user?.name?.[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold">{enrollment.trainer?.user?.name}</p>
                    <p className="text-gray-400 text-xs">{enrollment.trainer?.user?.email}</p>
                    <p className="text-gray-400 text-xs">{enrollment.trainer?.specialization} · {enrollment.trainer?.experience} yrs exp</p>
                  </div>
                </div>
              ) : (
                <p className="text-yellow-400 text-sm">⚠ No trainer assigned yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="glass-card p-6 text-gray-300 bg-white/5 border border-gray-700">
          <p className="text-lg font-medium">No courses available yet.</p>
          <p className="text-sm text-gray-400 mt-2">Please check back soon for new class openings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="glass-card p-6 hover:border-purple-500/40 transition-all">
              <div className="text-4xl mb-3">{danceStyleIcons[course.danceStyle] || '🎵'}</div>
              <Badge status={course.level} />
              <h3 className="text-xl font-bold text-white mt-3 mb-2">{course.title}</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{course.description}</p>
              <div className="text-sm text-gray-400 space-y-1 mb-4">
                <p>💰 ₹{course.fee?.toLocaleString()}/month</p>
                <p>⏱ {course.duration}</p>
                <p>📅 {course.schedule}</p>
                {course.trainer && <p>👤 {course.trainer?.user?.name}</p>}
              </div>
              {enrollment ? (
                enrollment.course?._id === course._id ? (
                  <div className="w-full py-2 text-center text-sm text-green-400 bg-green-500/10 rounded-xl border border-green-500/20">
                    ✓ Currently Enrolled
                  </div>
                ) : (
                  <div className="w-full py-2 text-center text-sm text-gray-500 bg-white/5 rounded-xl cursor-not-allowed">
                    Already enrolled in another course
                  </div>
                )
              ) : (
                <button
                  onClick={() => handleEnroll(course._id)}
                  disabled={!!enrolling}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                >
                  {enrolling === course._id ? 'Enrolling...' : <><FiArrowRight size={14} /> Enroll Now</>}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
