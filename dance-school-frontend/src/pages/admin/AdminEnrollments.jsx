import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { format } from 'date-fns';

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments').then(r => setEnrollments(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage Enrollments ({enrollments.length})</h1>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Student', 'Course', 'Enrollment Date', 'Progress', 'Status'].map(h => (
                  <th key={h} className="text-left p-4 text-gray-400 text-sm font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enrollments.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-8 text-gray-400">No enrollments found.</td></tr>
              ) : enrollments.map(e => (
                <tr key={e._id} className="border-b border-white/5 table-row">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                        {e.student?.user?.name?.[0]}
                      </div>
                      <div>
                        <p className="text-white text-sm">{e.student?.user?.name}</p>
                        <p className="text-gray-500 text-xs">{e.student?.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300 text-sm">{e.course?.title}</td>
                  <td className="p-4 text-gray-300 text-sm">{format(new Date(e.enrollmentDate), 'dd MMM yyyy')}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${e.progress || 0}%` }} />
                      </div>
                      <span className="text-xs text-gray-400">{e.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="p-4"><Badge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEnrollments;
