const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin`} />
      {text && <p className="text-purple-300 text-sm">{text}</p>}
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0f0a1e]">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-purple-300 text-lg font-medium">Loading Drizzle Dance...</p>
    </div>
  </div>
);

export default LoadingSpinner;
