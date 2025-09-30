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
    <>
    <div className="absolute top-4 left-4 z-[1000] space-y-4">

      {/* Distance Filter */}
      <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-xl p-4 text-white border-2 border-slate-700">
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
            className="bg-slate-900/90 backdrop-blur-sm hover:bg-slate-800 text-white px-4 py-2 rounded-lg shadow-xl transition-colors border-2 border-slate-700"
            title="Mostrar estadísticas"
          >
            📊
          </button>
        )}

        <button
          onClick={onReload}
          className="bg-slate-900/90 backdrop-blur-sm hover:bg-slate-800 text-white px-4 py-2 rounded-lg shadow-xl transition-colors border-2 border-slate-700"
          title="Recargar datos"
        >
          🔄
        </button>
      </div>
    </div>

    {/* Stats Panel - Bottom Right */}
    <div className="absolute bottom-4 right-4 z-[1000]">
      <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-xl p-4 text-white min-w-[250px] border-2 border-slate-700">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Mostrando:</span>
            <span className="font-mono font-semibold text-blue-400">
              {summary?.num_nodes?.toLocaleString() || 0} ciudades
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Ciudades:</span>
            <span className="font-mono font-semibold text-blue-400">
              {summary?.num_nodes?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Conexiones:</span>
            <span className="font-mono font-semibold text-purple-400">
              {summary?.num_edges?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};