const Badge = ({ status, className = '' }) => {
  const colors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    dropped: 'bg-red-500/20 text-red-400 border-red-500/30',
    paid: 'bg-green-500/20 text-green-400 border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    overdue: 'bg-red-500/20 text-red-400 border-red-500/30',
    refunded: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    present: 'bg-green-500/20 text-green-400 border-green-500/30',
    absent: 'bg-red-500/20 text-red-400 border-red-500/30',
    late: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    beginner: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    intermediate: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    advanced: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${colors[status] || colors.active} ${className}`}>
      {status}
    </span>
  );
};

export default Badge;
