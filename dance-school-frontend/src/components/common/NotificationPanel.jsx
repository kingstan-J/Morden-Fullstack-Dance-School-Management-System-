import { FiBell, FiCheck, FiX } from 'react-icons/fi';

const NotificationPanel = ({ notifications, loading, onMarkRead, onMarkAllRead, onClose }) => (
  <div className="absolute right-0 top-10 w-80 glass-card shadow-xl z-50 overflow-hidden">
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <h3 className="text-white font-semibold flex items-center gap-2">
        <FiBell size={16} className="text-purple-400" /> Notifications
      </h3>
      <div className="flex gap-2">
        {notifications.some(n => !n.isRead) && (
          <button onClick={onMarkAllRead} className="text-xs text-purple-400 hover:text-purple-300">Mark all read</button>
        )}
        <button onClick={onClose} className="text-gray-400 hover:text-white"><FiX size={16} /></button>
      </div>
    </div>
    <div className="max-h-80 overflow-y-auto">
      {loading ? (
        <div className="p-6 text-center text-gray-400 text-sm">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
      ) : notifications.map(n => (
        <div key={n._id}
          className={`flex items-start gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-all ${!n.isRead ? 'bg-purple-500/5' : ''}`}>
          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-purple-400' : 'bg-gray-600'}`} />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium">{n.title}</p>
            <p className="text-gray-400 text-xs mt-0.5">{n.message}</p>
            <p className="text-gray-600 text-xs mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
          </div>
          {!n.isRead && (
            <button onClick={() => onMarkRead(n._id)} className="text-gray-500 hover:text-green-400 shrink-0">
              <FiCheck size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default NotificationPanel;
