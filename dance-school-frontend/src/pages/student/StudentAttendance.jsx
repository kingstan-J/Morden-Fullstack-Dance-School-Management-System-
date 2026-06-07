import { useEffect, useState } from 'react';
import { FiCalendar, FiCheck, FiX, FiClock } from 'react-icons/fi';
import api from '../../utils/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { format } from 'date-fns';

const StudentAttendance = () => {
  const [data, setData] = useState({ data: [], stats: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attendance/my').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">My Attendance</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Classes', value: data.stats.total || 0, color: 'purple' },
          { label: 'Present', value: data.stats.present || 0, color: 'green' },
          { label: 'Absent', value: data.stats.absent || 0, color: 'pink' },
          { label: 'Attendance %', value: `${data.stats.percentage || 0}%`, color: 'yellow' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`stat-card text-center`}>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-gray-400 text-sm">{label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-bold text-white">Attendance Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-gray-400 text-sm font-medium">Date</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium">Course</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {data.data.length === 0 ? (
                <tr><td colSpan="4" className="text-center p-8 text-gray-400">No attendance records found.</td></tr>
              ) : data.data.map(a => (
                <tr key={a._id} className="border-b border-white/5 table-row">
                  <td className="p-4 text-white text-sm">{format(new Date(a.date), 'dd MMM yyyy')}</td>
                  <td className="p-4 text-gray-300 text-sm">{a.course?.title}</td>
                  <td className="p-4"><Badge status={a.status} /></td>
                  <td className="p-4 text-gray-400 text-sm">{a.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
