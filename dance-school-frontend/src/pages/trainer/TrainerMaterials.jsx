import { useEffect, useState } from 'react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiUpload, FiFileText, FiTrash2 } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';

const TrainerMaterials = () => {
  const { profile, fetchProfile } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile().finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !profile?.assignedCourse?._id) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title || file.name);
    setUploading(true);
    try {
      await api.post(`/courses/${profile.assignedCourse._id}/materials`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Material uploaded!');
      setTitle(''); setFile(null);
      await fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  const materials = profile?.assignedCourse?.materials || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Learning Materials</h1>

      {!profile?.assignedCourse ? (
        <div className="glass-card p-8 text-center text-gray-400">No course assigned yet.</div>
      ) : (
        <>
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FiUpload className="text-purple-400" /> Upload Material</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Title (optional)</label>
                <input
                  className="input-field"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Material title..."
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">File (PDF, DOC, MP4, Image)</label>
                <input
                  type="file"
                  className="input-field cursor-pointer"
                  accept=".pdf,.doc,.docx,.mp4,.jpg,.jpeg,.png"
                  onChange={e => setFile(e.target.files[0])}
                  required
                />
              </div>
              <button type="submit" disabled={uploading || !file} className="btn-primary flex items-center gap-2">
                <FiUpload size={16} />
                {uploading ? 'Uploading...' : 'Upload Material'}
              </button>
            </form>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h2 className="font-bold text-white">Uploaded Materials ({materials.length})</h2>
            </div>
            {materials.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No materials uploaded yet.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {materials.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <FiFileText className="text-purple-400" size={18} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{m.title}</p>
                        <p className="text-gray-500 text-xs">{new Date(m.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <a
                      href={`/${m.fileUrl.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TrainerMaterials;
