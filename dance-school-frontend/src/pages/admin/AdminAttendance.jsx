import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { format } from 'date-fns';

const AdminAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attendance').then(r => setRecords(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const late = records.filter(r => r.status === 'late').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Attendance Records</h1>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: records.length, color: 'text-white' },
          { label: 'Present', value: present, color: 'text-green-400' },
          { label: 'Absent', value: absent, color: 'text-red-400' },
          { label: 'Late', value: late, color: 'text-yellow-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-gray-400 text-sm">{label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Student', 'Course', 'Date', 'Status', 'Remarks'].map(h => (
                  <th key={h} className="text-left p-4 text-gray-400 text-sm font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-8 text-gray-400">No records found.</td></tr>
              ) : records.map(r => (
                <tr key={r._id} className="border-b border-white/5 table-row">
                  <td className="p-4 text-white text-sm">{r.student?.user?.name}</td>
                  <td className="p-4 text-gray-300 text-sm">{r.course?.title}</td>
                  <td className="p-4 text-gray-300 text-sm">{format(new Date(r.date), 'dd MMM yyyy')}</td>
                  <td className="p-4"><Badge status={r.status} /></td>
                  <td className="p-4 text-gray-400 text-sm">{r.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;
