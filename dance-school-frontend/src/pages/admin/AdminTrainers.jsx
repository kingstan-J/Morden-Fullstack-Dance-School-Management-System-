import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../utils/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal, { ConfirmModal } from '../../components/common/Modal';
import toast from 'react-hot-toast';

const AdminTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTrainer, setEditTrainer] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [assignData, setAssignData] = useState({ trainerId: '', courseId: '' });
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', specialization: '', experience: '', bio: '', salary: '', qualifications: '' });

  const fetch = () => {
    setLoading(true);
    Promise.all([api.get('/admin/trainers'), api.get('/courses/all')])
      .then(([t, c]) => { setTrainers(t.data.data); setCourses(c.data.data); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditTrainer(null);
    setForm({ name: '', email: '', phone: '', password: '', specialization: '', experience: '', bio: '', salary: '', qualifications: '' });
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditTrainer(t);
    setForm({ name: t.user?.name || '', email: t.user?.email || '', phone: t.user?.phone || '', password: '', specialization: t.specialization || '', experience: t.experience || '', bio: t.bio || '', salary: t.salary || '', qualifications: (t.qualifications || []).join(', ') });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, qualifications: form.qualifications ? form.qualifications.split(',').map(q => q.trim()) : [] };
      if (editTrainer) {
        await api.put(`/admin/trainers/${editTrainer._id}`, payload);
        toast.success('Trainer updated!');
      } else {
        await api.post('/admin/trainers', payload);
        toast.success('Trainer created!');
      }
      setShowModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/admin/trainers/${deleteId}`);
      toast.success('Trainer deleted');
      setDeleteId(null); fetch();
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(false); }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/assign-trainer', assignData);
      toast.success('Trainer assigned to course!');
      setShowAssign(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Assignment failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage Trainers</h1>
        <div className="flex gap-3">
          <button onClick={() => setShowAssign(true)} className="btn-secondary text-sm">Assign to Course</button>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm"><FiPlus size={16} /> Add Trainer</button>
        </div>
      </div>

      {loading ? <div className="flex justify-center pt-10"><LoadingSpinner /></div> : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Trainer ID', 'Name', 'Email', 'Specialization', 'Course', 'Salary', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left p-4 text-gray-400 text-sm font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trainers.length === 0 ? (
                  <tr><td colSpan="8" className="text-center p-8 text-gray-400">No trainers found.</td></tr>
                ) : trainers.map(t => (
                  <tr key={t._id} className="border-b border-white/5 table-row">
                    <td className="p-4 text-purple-400 text-sm font-mono">{t.trainerId}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                          {t.user?.name?.[0]}
                        </div>
                        <span className="text-white text-sm">{t.user?.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 text-sm">{t.user?.email}</td>
                    <td className="p-4 text-gray-300 text-sm">{t.specialization || '-'}</td>
                    <td className="p-4 text-gray-300 text-sm">{t.assignedCourse?.title || 'Unassigned'}</td>
                    <td className="p-4 text-white text-sm">₹{t.salary?.toLocaleString() || 0}</td>
                    <td className="p-4"><Badge status={t.status} /></td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteId(t._id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTrainer ? 'Edit Trainer' : 'Add Trainer'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-400 mb-1 block">Full Name *</label>
              <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Email *</label>
              <input className="input-field" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required disabled={!!editTrainer} /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Phone</label>
              <input className="input-field" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            {!editTrainer && <div><label className="text-sm text-gray-400 mb-1 block">Password *</label>
              <input className="input-field" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 characters" required minLength={6} /></div>}
            <div><label className="text-sm text-gray-400 mb-1 block">Specialization</label>
              <input className="input-field" value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})} /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Experience (years)</label>
              <input className="input-field" type="number" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Salary (₹/month)</label>
              <input className="input-field" type="number" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Qualifications (comma-separated)</label>
              <input className="input-field" value={form.qualifications} onChange={e => setForm({...form, qualifications: e.target.value})} placeholder="B.A Dance, Certificate..." /></div>
          </div>
          <div><label className="text-sm text-gray-400 mb-1 block">Bio</label>
            <textarea className="input-field resize-none h-20" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} /></div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editTrainer ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* Assign Trainer Modal */}
      <Modal isOpen={showAssign} onClose={() => setShowAssign(false)} title="Assign Trainer to Course" size="sm">
        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Select Trainer</label>
            <select className="input-field" value={assignData.trainerId} onChange={e => setAssignData({...assignData, trainerId: e.target.value})} required>
              <option value="" className="bg-gray-900">Choose trainer...</option>
              {trainers.map(t => <option key={t._id} value={t._id} className="bg-gray-900">{t.user?.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Select Course</label>
            <select className="input-field" value={assignData.courseId} onChange={e => setAssignData({...assignData, courseId: e.target.value})} required>
              <option value="" className="bg-gray-900">Choose course...</option>
              {courses.map(c => <option key={c._id} value={c._id} className="bg-gray-900">{c.title}</option>)}
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowAssign(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Assign</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Trainer" message="This will permanently delete the trainer. Are you sure?" loading={deleting} />
    </div>
  );
};

export default AdminTrainers;
