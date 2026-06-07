import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiDownload } from 'react-icons/fi';
import api from '../../utils/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPayment, setEditPayment] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ student: '', course: '', amount: '', paymentMethod: 'cash', status: 'paid', month: '', year: new Date().getFullYear() });

  const fetch = () => {
    setLoading(true);
    Promise.all([api.get('/payments'), api.get('/admin/students'), api.get('/courses/all')])
      .then(([p, s, c]) => { setPayments(p.data.data); setStudents(s.data.data); setCourses(c.data.data); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openEdit = (p) => {
    setEditPayment(p);
    setForm({ student: p.student?._id || '', course: p.course?._id || '', amount: p.amount, paymentMethod: p.paymentMethod, status: p.status, month: p.month || '', year: p.year || new Date().getFullYear() });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editPayment) {
        await api.put(`/payments/${editPayment._id}`, form);
        toast.success('Payment updated!');
      } else {
        await api.post('/payments', form);
        toast.success('Payment created!');
      }
      setShowModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const downloadReceipt = async (id) => {
    try {
      const res = await api.get(`/payments/${id}/receipt`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = `receipt-${id}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Download failed'); }
  };

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage Payments</h1>
        <button onClick={() => { setEditPayment(null); setForm({ student: '', course: '', amount: '', paymentMethod: 'cash', status: 'paid', month: '', year: new Date().getFullYear() }); setShowModal(true); }}
          className="btn-primary flex items-center gap-2 text-sm"><FiPlus size={16} /> Add Payment</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card"><p className="text-2xl font-bold text-green-400">₹{totalRevenue.toLocaleString()}</p><p className="text-gray-400 text-sm">Total Revenue</p></div>
        <div className="stat-card"><p className="text-2xl font-bold text-white">{payments.length}</p><p className="text-gray-400 text-sm">Total Transactions</p></div>
        <div className="stat-card"><p className="text-2xl font-bold text-yellow-400">{payments.filter(p => p.status === 'pending').length}</p><p className="text-gray-400 text-sm">Pending</p></div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Receipt No', 'Student', 'Course', 'Month', 'Amount', 'Method', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left p-4 text-gray-400 text-sm font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan="9" className="text-center p-8 text-gray-400">No payments found.</td></tr>
              ) : payments.map(p => (
                <tr key={p._id} className="border-b border-white/5 table-row">
                  <td className="p-4 text-purple-400 text-xs font-mono">{p.receiptNumber}</td>
                  <td className="p-4 text-white text-sm">{p.student?.user?.name}</td>
                  <td className="p-4 text-gray-300 text-sm">{p.course?.title}</td>
                  <td className="p-4 text-gray-300 text-sm">{p.month} {p.year}</td>
                  <td className="p-4 text-white font-medium">₹{p.amount?.toLocaleString()}</td>
                  <td className="p-4 text-gray-300 text-sm capitalize">{p.paymentMethod?.replace('_', ' ')}</td>
                  <td className="p-4 text-gray-300 text-sm">{format(new Date(p.paymentDate), 'dd MMM yyyy')}</td>
                  <td className="p-4"><Badge status={p.status} /></td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"><FiEdit2 size={14} /></button>
                      {p.status === 'paid' && (
                        <button onClick={() => downloadReceipt(p._id)} className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20"><FiDownload size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editPayment ? 'Edit Payment' : 'Add Payment'} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          {!editPayment && (
            <>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Student</label>
                <select className="input-field" value={form.student} onChange={e => setForm({...form, student: e.target.value})} required>
                  <option value="" className="bg-gray-900">Select student...</option>
                  {students.map(s => <option key={s._id} value={s._id} className="bg-gray-900">{s.user?.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Course</label>
                <select className="input-field" value={form.course} onChange={e => setForm({...form, course: e.target.value})} required>
                  <option value="" className="bg-gray-900">Select course...</option>
                  {courses.map(c => <option key={c._id} value={c._id} className="bg-gray-900">{c.title}</option>)}
                </select>
              </div>
            </>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-400 mb-1 block">Amount (₹)</label>
              <input className="input-field" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Method</label>
              <select className="input-field" value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})}>
                {['cash', 'card', 'online', 'bank_transfer'].map(m => <option key={m} value={m} className="bg-gray-900 capitalize">{m.replace('_', ' ')}</option>)}
              </select></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Status</label>
              <select className="input-field" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                {['pending', 'paid', 'overdue', 'refunded'].map(s => <option key={s} value={s} className="bg-gray-900 capitalize">{s}</option>)}
              </select></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Month</label>
              <input className="input-field" value={form.month} onChange={e => setForm({...form, month: e.target.value})} placeholder="e.g. January" /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Year</label>
              <input className="input-field" type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} /></div>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editPayment ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPayments;
