import { useEffect, useState } from 'react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiAward, FiCheck } from 'react-icons/fi';

const TrainerCertificates = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(null);

  useEffect(() => {
    api.get('/enrollments/trainer-students').then(r => setStudents(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const issueCertificate = async (studentId) => {
    setIssuing(studentId);
    try {
      await api.post('/certificates/generate', { studentId });
      toast.success('Certificate issued successfully!');
      // Refresh
      const r = await api.get('/enrollments/trainer-students');
      setStudents(r.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue certificate');
    } finally { setIssuing(null); }
  };

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Issue Certificates</h1>
      <p className="text-gray-400 text-sm">Issue certificates to students who have completed the course.</p>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Student', 'Email', 'Progress', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left p-4 text-gray-400 text-sm font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-8 text-gray-400">No students enrolled.</td></tr>
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
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${e.progress || 0}%` }} />
                      </div>
                      <span className="text-xs text-gray-400">{e.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300 text-sm capitalize">{e.status}</td>
                  <td className="p-4">
                    {e.status === 'completed' ? (
                      <span className="flex items-center gap-1 text-green-400 text-sm"><FiCheck size={14} /> Issued</span>
                    ) : (
                      <button
                        onClick={() => issueCertificate(e.student._id)}
                        disabled={!!issuing}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 text-sm hover:bg-purple-500/30 transition-all"
                      >
                        <FiAward size={14} />
                        {issuing === e.student._id ? 'Issuing...' : 'Issue Certificate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrainerCertificates;
