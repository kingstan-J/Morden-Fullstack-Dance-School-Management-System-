import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiDownload } from 'react-icons/fi';

const TrainerSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/salaries/my').then(r => setSalaries(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const downloadSlip = async (id) => {
    try {
      const res = await api.get(`/salaries/${id}/slip`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = `salary-slip-${id}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Failed to download salary slip'); }
  };

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  const totalPaid = salaries.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">My Salary Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card"><p className="text-2xl font-bold text-green-400">₹{totalPaid.toLocaleString()}</p><p className="text-gray-400 text-sm">Total Earned</p></div>
        <div className="stat-card"><p className="text-2xl font-bold text-white">{salaries.length}</p><p className="text-gray-400 text-sm">Total Records</p></div>
        <div className="stat-card"><p className="text-2xl font-bold text-purple-400">₹{salaries[0]?.amount?.toLocaleString() || 0}</p><p className="text-gray-400 text-sm">Monthly Salary</p></div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/10"><h2 className="font-bold text-white">Salary History</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Month', 'Year', 'Amount', 'Payment Date', 'Status', 'Slip'].map(h => (
                  <th key={h} className="text-left p-4 text-gray-400 text-sm font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salaries.length === 0 ? (
                <tr><td colSpan="6" className="text-center p-8 text-gray-400">No salary records found.</td></tr>
              ) : salaries.map(s => (
                <tr key={s._id} className="border-b border-white/5 table-row">
                  <td className="p-4 text-white text-sm">{s.month}</td>
                  <td className="p-4 text-gray-300 text-sm">{s.year}</td>
                  <td className="p-4 text-white font-medium">₹{s.amount?.toLocaleString()}</td>
                  <td className="p-4 text-gray-300 text-sm">{s.paymentDate ? new Date(s.paymentDate).toLocaleDateString() : '-'}</td>
                  <td className="p-4"><Badge status={s.status} /></td>
                  <td className="p-4">
                    {s.status === 'paid' && (
                      <button onClick={() => downloadSlip(s._id)} className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm">
                        <FiDownload size={14} /> PDF
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrainerSalary;
