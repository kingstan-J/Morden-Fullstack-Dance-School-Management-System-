import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiDownload } from 'react-icons/fi';
import api from '../../utils/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const AdminSalaries = () => {
  const [salaries, setSalaries] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSalary, setEditSalary] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ trainer: '', amount: '', month: 'January', year: new Date().getFullYear(), status: 'pending', paymentDate: '', remarks: '' });

  const fetch = () => {
    setLoading(true);
    Promise.all([api.get('/salaries'), api.get('/admin/trainers')])
      .then(([s, t]) => { setSalaries(s.data.data); setTrainers(t.data.data); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditSalary(null);
    setForm({ trainer: '', amount: '', month: 'January', year: new Date().getFullYear(), status: 'pending', paymentDate: '', remarks: '' });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditSalary(s);
    setForm({ trainer: s.trainer?._id || '', amount: s.amount, month: s.month, year: s.year, status: s.status, paymentDate: s.paymentDate ? s.paymentDate.split('T')[0] : '', remarks: s.remarks || '' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editSalary) { await api.put(`/salaries/${editSalary._id}`, form); toast.success('Salary updated!'); }
      else { await api.post('/salaries', form); toast.success('Salary record created!'); }
      setShowModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const downloadSlip = async (id) => {
    try {
      const res = await api.get(`/salaries/${id}/slip`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = `salary-slip-${id}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Download failed'); }
  };

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  const totalPaid = salaries.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage Salaries</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm"><FiPlus size={16} /> Add Salary</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card"><p className="text-2xl font-bold text-green-400">₹{totalPaid.toLocaleString()}</p><p className="text-gray-400 text-sm">Total Paid Out</p></div>
        <div className="stat-card"><p className="text-2xl font-bold text-white">{salaries.length}</p><p className="text-gray-400 text-sm">Total Records</p></div>
        <div className="stat-card"><p className="text-2xl font-bold text-yellow-400">{salaries.filter(s => s.status === 'pending').length}</p><p className="text-gray-400 text-sm">Pending</p></div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Trainer', 'Month', 'Year', 'Amount', 'Payment Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left p-4 text-gray-400 text-sm font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salaries.length === 0 ? (
                <tr><td colSpan="7" className="text-center p-8 text-gray-400">No salary records found.</td></tr>
              ) : salaries.map(s => (
                <tr key={s._id} className="border-b border-white/5 table-row">
                  <td className="p-4 text-white text-sm">{s.trainer?.user?.name}</td>
                  <td className="p-4 text-gray-300 text-sm">{s.month}</td>
                  <td className="p-4 text-gray-300 text-sm">{s.year}</td>
                  <td className="p-4 text-white font-medium">₹{s.amount?.toLocaleString()}</td>
                  <td className="p-4 text-gray-300 text-sm">{s.paymentDate ? new Date(s.paymentDate).toLocaleDateString() : '-'}</td>
                  <td className="p-4"><Badge status={s.status} /></td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"><FiEdit2 size={14} /></button>
                      {s.status === 'paid' && (
                        <button onClick={() => downloadSlip(s._id)} className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20"><FiDownload size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editSalary ? 'Edit Salary' : 'Add Salary'} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Trainer</label>
            <select className="input-field" value={form.trainer} onChange={e => setForm({...form, trainer: e.target.value})} required disabled={!!editSalary}>
              <option value="" className="bg-gray-900">Select trainer...</option>
              {trainers.map(t => <option key={t._id} value={t._id} className="bg-gray-900">{t.user?.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-400 mb-1 block">Amount (₹)</label>
              <input className="input-field" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Month</label>
              <select className="input-field" value={form.month} onChange={e => setForm({...form, month: e.target.value})}>
                {MONTHS.map(m => <option key={m} value={m} className="bg-gray-900">{m}</option>)}
              </select></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Year</label>
              <input className="input-field" type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Status</label>
              <select className="input-field" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="pending" className="bg-gray-900">Pending</option>
                <option value="paid" className="bg-gray-900">Paid</option>
              </select></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Payment Date</label>
              <input className="input-field" type="date" value={form.paymentDate} onChange={e => setForm({...form, paymentDate: e.target.value})} /></div>
          </div>
          <div><label className="text-sm text-gray-400 mb-1 block">Remarks</label>
            <input className="input-field" value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} placeholder="Optional remarks..." /></div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editSalary ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminSalaries;
