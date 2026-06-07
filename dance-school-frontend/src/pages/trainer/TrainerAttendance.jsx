import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import api from '../../utils/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const TrainerAttendance = () => {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendanceMap, setAttendanceMap] = useState({});
  const [tab, setTab] = useState('mark'); // mark | view
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/enrollments/trainer-students'),
      api.get('/attendance/trainer'),
    ]).then(([s, a]) => {
      setStudents(s.data.data);
      setRecords(a.data.data);
      const initial = {};
      s.data.data.forEach(e => { initial[e.student._id] = 'present'; });
      setAttendanceMap(initial);
    }).finally(() => setLoading(false));
  }, []);

  const handleMark = async () => {
    setSaving(true);
    try {
      const attendanceData = students.map(e => ({
        studentId: e.student._id,
        status: attendanceMap[e.student._id] || 'present',
      }));
      await api.post('/attendance', { attendanceData, date });
      toast.success('Attendance marked successfully!');
      const r = await api.get('/attendance/trainer');
      setRecords(r.data.data);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to mark attendance'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Attendance Management</h1>

      <div className="flex gap-3">
        {['mark', 'view'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            {t === 'mark' ? 'Mark Attendance' : 'View Reports'}
          </button>
        ))}
      </div>

      {tab === 'mark' && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Select Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="input-field w-auto" max={format(new Date(), 'yyyy-MM-dd')} />
            </div>
          </div>
          <div className="space-y-2 mb-6">
            {students.length === 0 ? <p className="text-gray-400">No students enrolled.</p> : students.map(e => (
              <div key={e._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {e.student?.user?.name?.[0]}
                  </div>
                  <span className="text-white text-sm">{e.student?.user?.name}</span>
                </div>
                <div className="flex gap-2">
                  {['present', 'absent', 'late'].map(s => (
                    <button key={s} onClick={() => setAttendanceMap({...attendanceMap, [e.student._id]: s})}
                      className={`px-3 py-1 rounded-lg text-xs capitalize transition-all ${attendanceMap[e.student._id] === s
                        ? s === 'present' ? 'bg-green-500 text-white' : s === 'absent' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {students.length > 0 && (
            <button onClick={handleMark} disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          )}
        </div>
      )}

      {tab === 'view' && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Student</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Date</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr><td colSpan="4" className="text-center p-8 text-gray-400">No attendance records.</td></tr>
                ) : records.slice(0, 50).map(r => (
                  <tr key={r._id} className="border-b border-white/5 table-row">
                    <td className="p-4 text-white text-sm">{r.student?.user?.name}</td>
                    <td className="p-4 text-gray-300 text-sm">{format(new Date(r.date), 'dd MMM yyyy')}</td>
                    <td className="p-4"><Badge status={r.status} /></td>
                    <td className="p-4 text-gray-400 text-sm">{r.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerAttendance;
