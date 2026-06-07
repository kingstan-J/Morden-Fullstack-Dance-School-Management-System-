import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiPhone, FiSave, FiLock } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const TrainerProfile = () => {
  const { user, fetchProfile, profile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('phone', user.phone);
    }
  }, [user]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.put('/auth/update-profile', data);
      await fetchProfile();
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  const onPasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword } = Object.fromEntries(new FormData(e.target));
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed!');
      e.target.reset();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">My Profile</h1>

      {/* Trainer Info Card */}
      {profile && (
        <div className="glass-card p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-400">Trainer ID:</span> <span className="text-purple-400 font-mono">{profile.trainerId}</span></div>
            <div><span className="text-gray-400">Specialization:</span> <span className="text-white">{profile.specialization || '-'}</span></div>
            <div><span className="text-gray-400">Experience:</span> <span className="text-white">{profile.experience || 0} years</span></div>
            <div><span className="text-gray-400">Assigned Course:</span> <span className="text-white">{profile.assignedCourse?.title || 'None'}</span></div>
          </div>
        </div>
      )}

      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-2xl font-bold text-white">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-purple-400">Trainer</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input {...register('name')} className="input-field pl-9" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input {...register('phone')} className="input-field pl-9" />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input {...register('email')} className="input-field pl-9 opacity-50" readOnly />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            <FiSave size={16} /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FiLock className="text-purple-400" /> Change Password
        </h2>
        <form onSubmit={onPasswordChange} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Current Password</label>
            <input name="currentPassword" type="password" className="input-field" placeholder="Current password" required />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">New Password</label>
            <input name="newPassword" type="password" className="input-field" placeholder="Min 6 characters" required minLength={6} />
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2">
            <FiLock size={16} /> Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrainerProfile;
