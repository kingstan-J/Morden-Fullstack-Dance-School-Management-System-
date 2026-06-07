import { useEffect, useState } from 'react';
import { FiUsers, FiUserCheck, FiBook, FiDollarSign, FiList, FiAward } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../utils/api';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const COLORS = ['#a855f7', '#ec4899', '#6366f1', '#22c55e'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/payments').catch(() => ({ data: { data: [] } })),
    ]).then(([s, p]) => {
      setStats(s.data.data);
      setPayments(p.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  // Build monthly revenue chart data
  const monthlyMap = {};
  payments.filter(p => p.status === 'paid').forEach(p => {
    const key = p.month || 'Unknown';
    monthlyMap[key] = (monthlyMap[key] || 0) + p.amount;
  });
  const chartData = Object.entries(monthlyMap).map(([month, revenue]) => ({ month: month.slice(0, 3), revenue }));

  const pieData = [
    { name: 'Students', value: stats?.totalStudents || 0 },
    { name: 'Trainers', value: stats?.totalTrainers || 0 },
    { name: 'Courses', value: stats?.activeCourses || 0 },
    { name: 'Enrollments', value: stats?.activeEnrollments || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400">Welcome to Drizzle Dance Management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={FiUsers} label="Total Students" value={stats?.totalStudents || 0} color="purple" />
        <StatCard icon={FiUserCheck} label="Total Trainers" value={stats?.totalTrainers || 0} color="pink" />
        <StatCard icon={FiBook} label="Active Courses" value={stats?.activeCourses || 0} color="blue" />
        <StatCard icon={FiList} label="Enrollments" value={stats?.activeEnrollments || 0} color="green" />
        <StatCard icon={FiDollarSign} label="Total Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} color="yellow" />
        <StatCard icon={FiAward} label="Pending Salaries" value={stats?.pendingSalaries || 0} color="pink" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Monthly Revenue</h2>
          {chartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400">No revenue data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a0533', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 8, color: '#fff' }}
                  formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Overview Distribution</h2>
          <div className="flex items-center justify-center gap-8">
            <PieChart width={160} height={160}>
              <Pie data={pieData} cx={75} cy={75} innerRadius={45} outerRadius={75} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
            </PieChart>
            <div className="space-y-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-gray-300 text-sm">{d.name}:</span>
                  <span className="text-white font-medium text-sm">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
