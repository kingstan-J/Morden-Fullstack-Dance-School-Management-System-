import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { format } from 'date-fns';

const TrainerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/trainer-view').then(r => setPayments(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  const paid = payments.filter(p => p.status === 'paid').length;
  const pending = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Student Fee Status</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card text-center"><p className="text-2xl font-bold text-white">{payments.length}</p><p className="text-gray-400 text-sm">Total Records</p></div>
        <div className="stat-card text-center"><p className="text-2xl font-bold text-green-400">{paid}</p><p className="text-gray-400 text-sm">Paid</p></div>
        <div className="stat-card text-center"><p className="text-2xl font-bold text-yellow-400">{pending}</p><p className="text-gray-400 text-sm">Pending</p></div>
      </div>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Student', 'Month', 'Amount', 'Payment Date', 'Status'].map(h => (
                  <th key={h} className="text-left p-4 text-gray-400 text-sm font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-8 text-gray-400">No payment records found.</td></tr>
              ) : payments.map(p => (
                <tr key={p._id} className="border-b border-white/5 table-row">
                  <td className="p-4 text-white text-sm">{p.student?.user?.name}</td>
                  <td className="p-4 text-gray-300 text-sm">{p.month} {p.year}</td>
                  <td className="p-4 text-white font-medium">₹{p.amount?.toLocaleString()}</td>
                  <td className="p-4 text-gray-300 text-sm">{format(new Date(p.paymentDate), 'dd MMM yyyy')}</td>
                  <td className="p-4"><Badge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrainerPayments;
