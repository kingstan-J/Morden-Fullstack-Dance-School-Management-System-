import { Link } from 'react-router-dom';
import { FiCheckCircle, FiX, FiBell, FiClock } from 'react-icons/fi';

const NotificationPanel = ({ notifications, loading, onMarkRead, onMarkAllRead, onClose }) => {
  return (
    <div className="absolute right-4 top-14 w-80 max-h-[420px] overflow-hidden bg-[#0b071c] border border-white/10 rounded-3xl shadow-2xl z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-sm text-white font-semibold">
          <FiBell size={16} /> Notifications
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <FiX size={18} />
        </button>
      </div>
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-3">
        <p className="text-xs text-gray-400">Latest updates for your account.</p>
        <button onClick={onMarkAllRead} className="text-xs text-purple-300 hover:text-purple-100">Mark all read</button>
      </div>
      <div className="max-h-[320px] overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No notifications yet.</div>
        ) : (
          notifications.map((item) => (
            <div key={item._id} className={`border-b border-white/10 px-4 py-4 ${item.isRead ? 'bg-white/5' : 'bg-purple-500/5'}`}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="text-sm text-white font-medium">{item.title}</div>
                <span className="text-[10px] uppercase tracking-[.2em] text-pink-300">{item.type}</span>
              </div>
              <p className="text-sm text-gray-300 mb-3 leading-snug">{item.message}</p>
              <div className="flex items-center justify-between gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><FiClock size={12} /> {new Date(item.createdAt).toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  {item.link ? (
                    <Link to={item.link} onClick={onClose} className="text-purple-300 hover:text-purple-100">Open</Link>
                  ) : null}
                  {!item.isRead && (
                    <button onClick={() => onMarkRead(item._id)} className="text-green-300 hover:text-green-100 flex items-center gap-1">
                      <FiCheckCircle size={14} /> Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
