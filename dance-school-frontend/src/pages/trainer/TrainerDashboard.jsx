import { useEffect, useState } from 'react';
import { FiUsers, FiCalendar, FiBook, FiDollarSign } from 'react-icons/fi';
import api from '../../utils/api';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useAuthStore from '../../store/authStore';

const TrainerDashboard = () => {
  const { user, fetchProfile, profile } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchProfile(),
      api.get('/enrollments/trainer-students').catch(() => ({ data: { data: [] } })),
      api.get('/payments/trainer-view').catch(() => ({ data: { data: [] } })),
      api.get('/salaries/my').catch(() => ({ data: { data: [] } })),
    ]).then(([, s, p, sal]) => {
      setStudents(s.data.data);
      setPayments(p.data.data);
      setSalaries(sal.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  const latestSalary = salaries[0];
  const paidPayments = payments.filter(p => p.status === 'paid').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Trainer Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiUsers} label="Total Students" value={students.length} color="purple" />
        <StatCard icon={FiBook} label="Assigned Course" value={profile?.assignedCourse ? '1' : '0'} color="pink" />
        <StatCard icon={FiCalendar} label="Fees Paid" value={`${paidPayments}/${payments.length}`} color="green" />
        <StatCard icon={FiDollarSign} label="Latest Salary" value={latestSalary ? `₹${latestSalary.amount?.toLocaleString()}` : 'N/A'} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Course */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FiBook className="text-purple-400" /> Assigned Course</h2>
          {profile?.assignedCourse ? (
            <div>
              <h3 className="text-xl font-bold text-white">{profile.assignedCourse.title}</h3>
              <p className="text-purple-400">{profile.assignedCourse.danceStyle}</p>
              <div className="mt-3 space-y-1 text-sm text-gray-400">
                <p>Level: <Badge status={profile.assignedCourse.level} /></p>
                <p className="mt-2">Schedule: {profile.assignedCourse.schedule}</p>
                <p>Fee: ₹{profile.assignedCourse.fee?.toLocaleString()}/month</p>
              </div>
            </div>
          ) : <p className="text-gray-400">No course assigned yet.</p>}
        </div>

        {/* Recent Students */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FiUsers className="text-pink-400" /> Recent Students</h2>
          <div className="space-y-2">
            {students.slice(0, 5).map(e => (
              <div key={e._id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  {e.student?.user?.name?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{e.student?.user?.name}</p>
                  <p className="text-xs text-gray-400">{e.student?.user?.email}</p>
                </div>
              </div>
            ))}
            {students.length === 0 && <p className="text-gray-400 text-sm">No students enrolled yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
