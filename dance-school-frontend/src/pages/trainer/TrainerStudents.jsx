import { useEffect, useState } from 'react';
import api from '../../utils/api';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';

const TrainerStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStudents = (q = '') => {
    api.get(`/enrollments/trainer-students?search=${q}`)
      .then(r => setStudents(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => { const t = setTimeout(() => fetchStudents(search), 400); return () => clearTimeout(t); }, [search]);

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Students ({students.length})</h1>
        <SearchInput value={search} onChange={setSearch} placeholder="Search students..." className="w-64" />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-gray-400 text-sm font-medium">Student</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium">Email</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium">Phone</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium">Progress</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-8 text-gray-400">No students found.</td></tr>
              ) : students.map(e => (
                <tr key={e._id} className="border-b border-white/5 table-row">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                        {e.student?.user?.name?.[0]}
                      </div>
                      <span className="text-white text-sm">{e.student?.user?.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300 text-sm">{e.student?.user?.email}</td>
                  <td className="p-4 text-gray-300 text-sm">{e.student?.user?.phone || '-'}</td>
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

export default TrainerStudents;
