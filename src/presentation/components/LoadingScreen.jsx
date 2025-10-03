/**
 * LoadingScreen Component
 * Pantalla de carga simple
 */
export const LoadingScreen = ({ isDarkTheme = true }) => {
  const themeClasses = isDarkTheme
    ? 'bg-slate-900 text-white'
    : 'bg-gray-50 text-gray-900';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${themeClasses}`}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
      </div>
    </div>
  );
};
