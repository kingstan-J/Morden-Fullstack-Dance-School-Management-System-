import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import api from '../../utils/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal, { ConfirmModal } from '../../components/common/Modal';
import SearchInput from '../../components/common/SearchInput';
import toast from 'react-hot-toast';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', gender: 'female', address: '', guardianName: '', guardianPhone: '' });

  const fetchStudents = (q = '') => {
    setLoading(true);
    api.get(`/admin/students?search=${q}`).then(r => setStudents(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => { const t = setTimeout(() => fetchStudents(search), 400); return () => clearTimeout(t); }, [search]);

  const openCreate = () => {
    setEditStudent(null);
    setForm({ name: '', email: '', phone: '', password: '', gender: 'female', address: '', guardianName: '', guardianPhone: '' });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditStudent(s);
    setForm({ name: s.user?.name || '', email: s.user?.email || '', phone: s.user?.phone || '', password: '', gender: s.gender || 'female', address: s.address || '', guardianName: s.guardianName || '', guardianPhone: s.guardianPhone || '' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editStudent) {
        await api.put(`/admin/students/${editStudent._id}`, form);
        toast.success('Student updated!');
      } else {
        await api.post('/admin/students', form);
        toast.success('Student created!');
      }
      setShowModal(false);
      fetchStudents(search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/admin/students/${deleteId}`);
      toast.success('Student deleted');
      setDeleteId(null);
      fetchStudents(search);
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage Students</h1>
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search students..." className="w-56" />
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
            <FiPlus size={16} /> Add Student
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center pt-10"><LoadingSpinner /></div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Student ID', 'Name', 'Email', 'Phone', 'Course', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left p-4 text-gray-400 text-sm font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr><td colSpan="7" className="text-center p-8 text-gray-400">No students found.</td></tr>
                ) : students.map(s => (
                  <tr key={s._id} className="border-b border-white/5 table-row">
                    <td className="p-4 text-purple-400 text-sm font-mono">{s.studentId}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                          {s.user?.name?.[0]}
                        </div>
                        <span className="text-white text-sm">{s.user?.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 text-sm">{s.user?.email}</td>
                    <td className="p-4 text-gray-300 text-sm">{s.user?.phone || '-'}</td>
                    <td className="p-4 text-gray-300 text-sm">{s.enrolledCourse?.title || 'Not enrolled'}</td>
                    <td className="p-4"><Badge status={s.user?.isActive ? 'active' : 'inactive'} /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteId(s._id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editStudent ? 'Edit Student' : 'Add Student'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Full Name *</label>
              <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Full name" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email *</label>
              <input className="input-field" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="Email" disabled={!!editStudent} />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Phone</label>
              <input className="input-field" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone number" />
            </div>
            {!editStudent && (
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Password *</label>
                <input className="input-field" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 characters" required minLength={6} />
              </div>
            )}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Gender</label>
              <select className="input-field" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                <option value="female" className="bg-gray-900">Female</option>
                <option value="male" className="bg-gray-900">Male</option>
                <option value="other" className="bg-gray-900">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Guardian Name</label>
              <input className="input-field" value={form.guardianName} onChange={e => setForm({...form, guardianName: e.target.value})} placeholder="Guardian name" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Guardian Phone</label>
              <input className="input-field" value={form.guardianPhone} onChange={e => setForm({...form, guardianPhone: e.target.value})} placeholder="Guardian phone" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Address</label>
            <input className="input-field" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Address" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editStudent ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Student" message="This will permanently delete the student and all their data. Are you sure?"
        loading={deleting}
      />
    </div>
  );
};

export default AdminStudents;
