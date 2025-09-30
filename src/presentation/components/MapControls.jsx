/**
 * Map Controls Component
 * Controles de filtrado y visualización
 */
import { useState } from 'react';

export const MapControls = ({ summary, onDistanceChange, onReload }) => {
  const [maxDistance, setMaxDistance] = useState(2000);
  const [showStats, setShowStats] = useState(true);

  const handleDistanceChange = (e) => {
    const value = parseInt(e.target.value);
    setMaxDistance(value);
    onDistanceChange(value);
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] space-y-4">
      {/* Stats Panel */}
      {showStats && summary && (
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-xl p-4 text-white min-w-[250px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">Estadísticas</h3>
            <button
              onClick={() => setShowStats(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Ciudades:</span>
              <span className="font-mono font-semibold text-blue-400">
                {summary.num_nodes?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Conexiones:</span>
              <span className="font-mono font-semibold text-purple-400">
                {summary.num_edges?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Distance Filter */}
      <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-xl p-4 text-white">
        <label className="block text-sm font-medium mb-2">
          Distancia Máxima: <span className="text-blue-400">{maxDistance}km</span>
        </label>
        <input
          type="range"
          min="100"
          max="5000"
          step="100"
          value={maxDistance}
          onChange={handleDistanceChange}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>100km</span>
          <span>5000km</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {!showStats && (
          <button
            onClick={() => setShowStats(true)}
            className="bg-slate-900/90 backdrop-blur-sm hover:bg-slate-800 text-white px-4 py-2 rounded-lg shadow-xl transition-colors"
            title="Mostrar estadísticas"
          >
            📊
          </button>
        )}

        <button
          onClick={onReload}
          className="bg-slate-900/90 backdrop-blur-sm hover:bg-slate-800 text-white px-4 py-2 rounded-lg shadow-xl transition-colors"
          title="Recargar datos"
        >
          🔄
        </button>
      </div>
    </div>
  );
};