import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import api from '../../utils/api';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentDashboard = () => {
  const [enrollment, setEnrollment] = useState(null);
  const [attendance, setAttendance] = useState({ stats: {} });
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/enrollments/my').catch(() => ({ data: { data: null } })),
      api.get('/attendance/my').catch(() => ({ data: { stats: {} } })),
      api.get('/payments/my').catch(() => ({ data: { data: [] } })),
      api.get('/certificates/my').catch(() => ({ data: { data: [] } })),
    ]).then(([e, a, p]) => {
      setEnrollment(e.data.data);
      setAttendance(a.data);
      setPayments(p.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" text="Loading dashboard..." /></div>;

  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const paidPayments = payments.filter(p => p.status === 'paid').length;

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiBook} label="Enrolled Course" value={enrollment ? '1' : '0'} color="purple" />
        <StatCard icon={FiCalendar} label="Attendance %" value={`${attendance.stats?.percentage || 0}%`} color="green" />
        <StatCard icon={FiTrendingUp} label="Course Progress" value={`${attendance.stats?.progress ?? enrollment?.progress ?? 0}%`} color="blue" />
        <StatCard icon={FiDollarSign} label="Pending Fees" value={pendingPayments} color="yellow" />
        <StatCard icon={FiDollarSign} label="Paid Fees" value={paidPayments} color="green" />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Card */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FiBook className="text-purple-400" /> My Course</h2>
          {enrollment ? (
            <div>
              <h3 className="text-xl font-bold text-white">{enrollment.course?.title}</h3>
              <p className="text-purple-400 text-sm mb-2">{enrollment.course?.danceStyle}</p>
              <div className="flex items-center gap-3 mb-4">
                <Badge status={enrollment.status} />
                <Badge status={enrollment.course?.level} />
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Course Progress</span>
                  <span className="text-purple-400">{attendance.stats?.progress ?? enrollment?.progress ?? 0}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" style={{ width: `${attendance.stats?.progress ?? enrollment?.progress ?? 0}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {attendance.stats?.present || 0} of {enrollment?.course?.totalClassDays || 100} class days attended
                </p>
              </div>
              <p className="text-sm text-gray-400">📅 {enrollment.course?.schedule}</p>
              {enrollment.trainer && (
                <p className="text-sm text-gray-400 mt-1">👤 Trainer: <span className="text-white">{enrollment.trainer?.user?.name}</span></p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">You're not enrolled in any course yet.</p>
              <Link to="/student/courses" className="btn-primary text-sm">Browse Courses</Link>
            </div>
          )}
        </div>

        {/* Attendance Summary */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FiCalendar className="text-green-400" /> Attendance Summary</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Total', value: attendance.stats?.total || 0, color: 'text-white' },
              { label: 'Present', value: attendance.stats?.present || 0, color: 'text-green-400' },
              { label: 'Absent', value: attendance.stats?.absent || 0, color: 'text-red-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center p-3 rounded-xl bg-white/5">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-gray-400 text-xs">{label}</p>
              </div>
            ))}
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all" style={{ width: `${attendance.stats?.percentage || 0}%` }} />
          </div>
          <p className="text-right text-sm text-gray-400 mt-1">{attendance.stats?.percentage || 0}% attendance rate</p>
          <Link to="/student/attendance" className="text-purple-400 text-sm hover:text-purple-300 mt-2 inline-block">View full report →</Link>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><FiDollarSign className="text-yellow-400" /> Recent Payments</h2>
          <Link to="/student/fees" className="text-purple-400 text-sm hover:text-purple-300">View all →</Link>
        </div>
        {payments.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No payment records found.</p>
        ) : (
          <div className="space-y-2">
            {payments.slice(0, 4).map(p => (

              <div key={p._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                <div>
                  <p className="text-sm font-medium text-white">{p.month} {p.year}</p>
                  <p className="text-xs text-gray-400">{p.course?.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">₹{p.amount?.toLocaleString()}</span>
                  <Badge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
