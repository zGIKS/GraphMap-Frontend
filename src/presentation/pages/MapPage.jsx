/**
 * MapPage - Main Application Page
 * Página principal que orquesta todos los componentes
 */
import { useState } from 'react';
import { useGraphData } from '../../application/hooks/useGraphData';
import { GraphMap } from '../components/GraphMap';
import { MapControls } from '../components/MapControls';
import { LoadingScreen } from '../components/LoadingScreen';

export const MapPage = () => {
  const {
    cities,
    edges,
    summary,
    loading,
    error,
    progress,
    reload,
  } = useGraphData();

  const [maxDistance, setMaxDistance] = useState(2000);

  if (loading) {
    return <LoadingScreen progress={progress} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error de conexión</h2>
          <p className="text-slate-300 mb-4">{error}</p>
          <p className="text-slate-400 text-sm mb-4">
            Asegúrate de que el backend esté corriendo en http://127.0.0.1:8000
          </p>
          <button
            onClick={reload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <MapControls
        summary={summary}
        onDistanceChange={setMaxDistance}
        onReload={reload}
      />

      <GraphMap
        cities={cities}
        edges={edges}
        maxDistance={maxDistance}
      />

      {/* Info Badge */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
          <span className="text-slate-400">Mostrando:</span>{' '}
          <span className="font-semibold text-blue-400">
            {cities.length.toLocaleString()}
          </span>{' '}
          ciudades
        </div>
      </div>
    </div>
  );
};