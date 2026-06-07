import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../utils/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal, { ConfirmModal } from '../../components/common/Modal';
import toast from 'react-hot-toast';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', danceStyle: '', level: 'beginner', description: '', fee: '', duration: '', schedule: '', maxStudents: 30, totalClassDays: 100 });

  const fetch = () => {
    setLoading(true);
    Promise.all([api.get('/courses/all'), api.get('/admin/trainers')])
      .then(([c, t]) => { setCourses(c.data.data); setTrainers(t.data.data); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditCourse(null);
    setForm({ title: '', danceStyle: '', level: 'beginner', description: '', fee: '', duration: '', schedule: '', maxStudents: 30 });
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditCourse(c);
    setForm({ title: c.title, danceStyle: c.danceStyle, level: c.level, description: c.description || '', fee: c.fee, duration: c.duration || '', schedule: c.schedule || '', maxStudents: c.maxStudents || 30, totalClassDays: c.totalClassDays || 100 });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editCourse) { await api.put(`/courses/${editCourse._id}`, form); toast.success('Course updated!'); }
      else { await api.post('/courses', form); toast.success('Course created!'); }
      setShowModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await api.delete(`/courses/${deleteId}`); toast.success('Course deleted'); setDeleteId(null); fetch(); }
    catch { toast.error('Delete failed'); } finally { setDeleting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage Courses</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm"><FiPlus size={16} /> Add Course</button>
      </div>

      {loading ? <div className="flex justify-center pt-10"><LoadingSpinner /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c => (
            <div key={c._id} className="glass-card p-5 hover:border-purple-500/40 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-white">{c.title}</h3>
                  <p className="text-purple-400 text-sm">{c.danceStyle}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"><FiEdit2 size={14} /></button>
                  <button onClick={() => setDeleteId(c._id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"><FiTrash2 size={14} /></button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Badge status={c.level} />
                <Badge status={c.isActive ? 'active' : 'inactive'} />
              </div>
              <div className="text-sm space-y-1 text-gray-400">
                <p>💰 ₹{c.fee?.toLocaleString()}/month</p>
                <p>⏱ {c.duration || 'TBD'}</p>
                <p>📅 {c.schedule || 'TBD'}</p>
                <p>👤 Trainer: <span className="text-white">{c.trainer?.user?.name || 'Unassigned'}</span></p>
                <p>👥 Max: {c.maxStudents} students</p>
              </div>
            </div>
          ))}
          {courses.length === 0 && <div className="col-span-3 text-center py-12 text-gray-400">No courses found.</div>}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editCourse ? 'Edit Course' : 'Add Course'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-400 mb-1 block">Course Title *</label>
              <input className="input-field" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Dance Style *</label>
              <input className="input-field" value={form.danceStyle} onChange={e => setForm({...form, danceStyle: e.target.value})} required placeholder="e.g. Bharatanatyam" /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Level</label>
              <select className="input-field" value={form.level} onChange={e => setForm({...form, level: e.target.value})}>
                {['beginner', 'intermediate', 'advanced'].map(l => <option key={l} value={l} className="bg-gray-900 capitalize">{l}</option>)}
              </select></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Monthly Fee (₹) *</label>
              <input className="input-field" type="number" value={form.fee} onChange={e => setForm({...form, fee: e.target.value})} required /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Duration</label>
              <input className="input-field" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="e.g. 6 months" /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Max Students</label>
              <input className="input-field" type="number" value={form.maxStudents} onChange={e => setForm({...form, maxStudents: e.target.value})} /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Total Class Days</label>
              <input className="input-field" type="number" value={form.totalClassDays} onChange={e => setForm({...form, totalClassDays: e.target.value})} placeholder="e.g. 100" /></div>
          </div>
          <div><label className="text-sm text-gray-400 mb-1 block">Schedule</label>
            <input className="input-field" value={form.schedule} onChange={e => setForm({...form, schedule: e.target.value})} placeholder="e.g. Mon, Wed, Fri - 6:00 PM" /></div>
          <div><label className="text-sm text-gray-400 mb-1 block">Description</label>
            <textarea className="input-field resize-none h-20" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editCourse ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Course" message="This will permanently delete the course. Are you sure?" loading={deleting} />
    </div>
  );
};

export default AdminCourses;
