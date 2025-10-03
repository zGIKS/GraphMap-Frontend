export const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-white">Loading cities...</span>
        </div>
      </div>
    </div>
  );
};
