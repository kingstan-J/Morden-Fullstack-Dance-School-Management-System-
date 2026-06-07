import { useEffect, useState } from 'react';
import { FiDownload, FiCreditCard } from 'react-icons/fi';
import api from '../../utils/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const StudentFees = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState(null);
  const [paying, setPaying] = useState(false);
  const [method, setMethod] = useState('online');

  const fetchPayments = () => {
    api.get('/payments/my').then(r => setPayments(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPayments(); }, []);

  const downloadReceipt = async (id) => {
    try {
      const res = await api.get(`/payments/${id}/receipt`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = `receipt-${id}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Failed to download receipt'); }
  };

  const handlePay = async () => {
    if (!payModal) return;
    setPaying(true);
    try {
      // pay only if trainer granted permission + dueAt not passed
      const check = await api.get('/fee-permissions/check-pay');
      if (check.data?.data?.isAllowed === false) {
        toast.error(check.data?.message || 'Fee permission not granted');
        return;
      }

      await api.put(`/payments/${payModal._id}`, { status: 'paid', paymentMethod: method, paymentDate: new Date() });
      toast.success('Payment recorded successfully!');
      setPayModal(null);
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Fee Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card"><p className="text-2xl font-bold text-green-400">₹{totalPaid.toLocaleString()}</p><p className="text-gray-400 text-sm">Total Paid</p></div>
        <div className="stat-card"><p className="text-2xl font-bold text-yellow-400">₹{totalPending.toLocaleString()}</p><p className="text-gray-400 text-sm">Pending Amount</p></div>
        <div className="stat-card"><p className="text-2xl font-bold text-white">{payments.length}</p><p className="text-gray-400 text-sm">Total Records</p></div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/10"><h2 className="font-bold text-white">Payment History</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Receipt No.', 'Month', 'Amount', 'Method', 'Date', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left p-4 text-gray-400 text-sm font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan="7" className="text-center p-8 text-gray-400">No payment records found.</td></tr>
              ) : payments.map(p => (
                <tr key={p._id} className="border-b border-white/5 table-row">
                  <td className="p-4 text-purple-400 text-sm font-mono">{p.receiptNumber}</td>
                  <td className="p-4 text-white text-sm">{p.month} {p.year}</td>
                  <td className="p-4 text-white font-medium">₹{p.amount?.toLocaleString()}</td>
                  <td className="p-4 text-gray-300 text-sm capitalize">{p.paymentMethod?.replace('_', ' ')}</td>
                  <td className="p-4 text-gray-300 text-sm">{format(new Date(p.paymentDate), 'dd MMM yyyy')}</td>
                  <td className="p-4"><Badge status={p.status} /></td>
                  <td className="p-4">
                    {p.status === 'paid' ? (
                      <button onClick={() => downloadReceipt(p._id)} className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm">
                        <FiDownload size={14} /> Receipt
                      </button>
                    ) : p.status === 'pending' ? (
                      <button onClick={() => setPayModal(p)} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-sm hover:bg-green-500/20 transition-all">
                        <FiCreditCard size={14} /> Pay Now
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!payModal} onClose={() => setPayModal(null)} title="Pay Fee" size="sm">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <p className="text-gray-400 text-sm">Month: <span className="text-white font-medium">{payModal?.month} {payModal?.year}</span></p>
            <p className="text-gray-400 text-sm mt-1">Amount: <span className="text-white font-bold text-lg">₹{payModal?.amount?.toLocaleString()}</span></p>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Payment Method</label>
            <select className="input-field" value={method} onChange={e => setMethod(e.target.value)}>
              {['cash', 'card', 'online', 'bank_transfer'].map(m => (
                <option key={m} value={m} className="bg-gray-900 capitalize">{m.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setPayModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={handlePay} disabled={paying} className="btn-primary">
              {paying ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentFees;
