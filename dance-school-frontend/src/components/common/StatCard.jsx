const StatCard = ({ icon: Icon, label, value, color = 'purple', trend }) => {
  const colors = {
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400',
    pink: 'from-pink-500/20 to-pink-600/10 border-pink-500/20 text-pink-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/20 text-green-400',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20 text-yellow-400',
  };
  return (
    <div className={`stat-card bg-gradient-to-br ${colors[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]}`}>
          <Icon size={22} className={colors[color].split(' ')[3]} />
        </div>
        {trend && <span className={`text-xs font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>{trend > 0 ? '+' : ''}{trend}%</span>}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
};

export default StatCard;
