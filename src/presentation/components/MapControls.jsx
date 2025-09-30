/**
 * Map Controls Component
 * Controles de filtrado y visualización
 */
import { useState } from 'react';

export const MapControls = ({ summary, onDistanceChange, isDarkTheme, onToggleTheme }) => {
  const [maxDistance, setMaxDistance] = useState(2000);
  const [showStats, setShowStats] = useState(true);

  const handleDistanceChange = (e) => {
    const value = parseInt(e.target.value);
    setMaxDistance(value);
    onDistanceChange(value);
  };

  // Definir estilos dinámicos basados en el tema
  const themeStyles = {
    container: isDarkTheme 
      ? 'bg-gradient-to-br from-slate-800/95 to-slate-900/95 text-white border-slate-600/50 hover:shadow-blue-500/20'
      : 'bg-gradient-to-br from-white/95 to-gray-50/95 text-gray-900 border-gray-300/50 hover:shadow-blue-500/20',
    text: isDarkTheme ? 'text-slate-200' : 'text-gray-700',
    textMuted: isDarkTheme ? 'text-slate-400' : 'text-gray-500',
    sliderBg: isDarkTheme ? 'bg-slate-700' : 'bg-gray-300',
    badgeBg: isDarkTheme ? 'bg-slate-800/50' : 'bg-gray-200/80'
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] space-y-4 max-w-sm">
      {/* Theme Toggle Button */}
      <div className="flex justify-end">
        <button
          onClick={onToggleTheme}
          className={`${ 
            isDarkTheme 
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-gray-900 shadow-yellow-500/25'
              : 'bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 text-white shadow-slate-500/25'
          } px-4 py-3 rounded-xl shadow-lg transition-all duration-300 border-2 ${
            isDarkTheme ? 'border-yellow-400/30' : 'border-slate-600/30'
          } transform hover:scale-105 hover:shadow-xl`}
          title={isDarkTheme ? 'Cambiar a tema claro ☀️' : 'Cambiar a tema oscuro 🌙'}
        >
          <span className="text-xl font-bold">
            {isDarkTheme ? '☀️' : '🌙'}
          </span>
        </button>
      </div>

      {/* Distance Filter - Diseño mejorado */}
      <div className={`${themeStyles.container} backdrop-blur-md rounded-xl shadow-2xl p-6 border transition-all duration-300`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <label className={`text-sm font-semibold ${themeStyles.text}`}>
            Distancia Máxima
          </label>
        </div>
        
        <div className="text-center mb-4">
          <span className="text-2xl font-bold text-blue-400 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/30">
            {maxDistance}km
          </span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={maxDistance}
            onChange={handleDistanceChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((maxDistance - 100) / 4900) * 100}%, ${isDarkTheme ? '#475569' : '#d1d5db'} ${((maxDistance - 100) / 4900) * 100}%, ${isDarkTheme ? '#475569' : '#d1d5db'} 100%)`
            }}
          />
        </div>
        
        <div className={`flex justify-between text-xs ${themeStyles.textMuted} mt-3 font-medium`}>
          <span className={`${themeStyles.badgeBg} px-2 py-1 rounded`}>100km</span>
          <span className={`${themeStyles.badgeBg} px-2 py-1 rounded`}>5000km</span>
        </div>
      </div>

      {/* Action Buttons - Diseño mejorado */}
      {!showStats && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowStats(true)}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg transition-all duration-300 border border-emerald-500/30 hover:shadow-emerald-500/25 transform hover:scale-105"
            title="Mostrar estadísticas"
          >
            <span className="text-lg">📊</span>
          </button>
        </div>
      )}

      {/* Stats Panel - Diseño mejorado */}
      {showStats && (
        <div className={`${themeStyles.container} backdrop-blur-md rounded-xl shadow-2xl p-6 min-w-[320px] border transition-all duration-300 hover:shadow-purple-500/20`}>
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <h3 className={`text-lg font-bold ${themeStyles.text}`}>Estadísticas del Mapa</h3>
            </div>
            <button
              onClick={() => setShowStats(false)}
              className={`${themeStyles.textMuted} hover:text-red-400 transition-all duration-200 hover:bg-red-500/10 rounded-full p-1 transform hover:scale-110`}
              title="Ocultar estadísticas"
            >
              <span className="text-lg">✕</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 text-lg">🏙️</span>
                <span className={`${themeStyles.text} font-medium`}>Ciudades:</span>
              </div>
              <span className="font-mono font-bold text-xl text-blue-400 bg-blue-500/20 px-3 py-1 rounded-lg">
                {summary?.num_nodes?.toLocaleString() || 0}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-2">
                <span className="text-purple-400 text-lg">🔗</span>
                <span className={`${themeStyles.text} font-medium`}>Conexiones:</span>
              </div>
              <span className="font-mono font-bold text-xl text-purple-400 bg-purple-500/20 px-3 py-1 rounded-lg">
                {summary?.num_edges?.toLocaleString() || 0}
              </span>
            </div>
            
            {/* Información adicional */}
            <div className={`mt-4 pt-4 border-t ${isDarkTheme ? 'border-slate-600/30' : 'border-gray-300/30'}`}>
              <div className={`text-xs ${themeStyles.textMuted} text-center`}>
                <span className={`${themeStyles.badgeBg} px-2 py-1 rounded`}>
                  Red actualizada en tiempo real
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};