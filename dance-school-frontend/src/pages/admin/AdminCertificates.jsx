import { useEffect, useState } from 'react';
import { FiDownload, FiAward } from 'react-icons/fi';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AdminCertificates = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates').then(r => setCerts(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const download = async (id) => {
    try {
      const res = await api.get(`/certificates/${id}/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url; a.download = `certificate-${id}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Failed to download'); }
  };

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Certificates ({certs.length})</h1>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Certificate No', 'Student', 'Course', 'Issue Date', 'Action'].map(h => (
                  <th key={h} className="text-left p-4 text-gray-400 text-sm font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {certs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-12 text-gray-400">
                    <FiAward size={40} className="mx-auto mb-3 opacity-30" />
                    No certificates issued yet.
                  </td>
                </tr>
              ) : certs.map(c => (
                <tr key={c._id} className="border-b border-white/5 table-row">
                  <td className="p-4 text-purple-400 text-xs font-mono">{c.certificateNumber}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                        {c.student?.user?.name?.[0]}
                      </div>
                      <span className="text-white text-sm">{c.student?.user?.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300 text-sm">{c.course?.title}</td>
                  <td className="p-4 text-gray-300 text-sm">{format(new Date(c.issueDate), 'dd MMM yyyy')}</td>
                  <td className="p-4">
                    <button onClick={() => download(c._id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-sm hover:bg-purple-500/20 transition-all">
                      <FiDownload size={14} /> Download
                    </button>
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

export default AdminCertificates;
