import { useEffect, useState } from 'react';
import { FiDownload, FiAward } from 'react-icons/fi';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const StudentCertificates = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates/my').then(r => setCerts(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const download = async (id) => {
    try {
      const res = await api.get(`/certificates/${id}/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = `certificate-${id}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Failed to download certificate'); }
  };

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">My Certificates</h1>
      {certs.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FiAward size={48} className="text-purple-400/30 mx-auto mb-4" />
          <p className="text-gray-400">No certificates yet. Complete your course to earn one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map(cert => (
            <div key={cert._id} className="glass-card p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:border-purple-500/40 transition-all">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-xl font-bold text-white mb-1">{cert.course?.title}</h3>
              <p className="text-purple-400 text-sm mb-3">{cert.course?.danceStyle}</p>
              <p className="text-gray-400 text-sm">Trainer: <span className="text-white">{cert.trainer?.user?.name}</span></p>
              <p className="text-gray-400 text-sm mb-1">Issued: <span className="text-white">{format(new Date(cert.issueDate), 'dd MMMM yyyy')}</span></p>
              <p className="text-xs font-mono text-purple-400 mb-4">#{cert.certificateNumber}</p>
              <button onClick={() => download(cert._id)} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                <FiDownload size={14} /> Download Certificate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCertificates;
