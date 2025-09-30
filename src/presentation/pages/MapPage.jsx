/**
 * MapPage - Main Application Page
 * Página principal que orquesta todos los componentes
 */
import React, { useState } from 'react';
import { useGraphData } from '../../application/hooks/useGraphData';
import { GraphMap } from '../components/GraphMap';
import { MapControls } from '../components/MapControls';

export const MapPage = () => {
  const {
    cities,
    edges,
    summary,
    error,
    reload,
  } = useGraphData();

  const [maxDistance, setMaxDistance] = useState(2000);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    // Aplicar tema al body
    document.body.className = !isDarkTheme 
      ? 'bg-slate-900 text-white transition-colors duration-500' 
      : 'bg-gray-100 text-gray-900 transition-colors duration-500';
  };

  // Aplicar tema inicial al body
  React.useEffect(() => {
    document.body.className = isDarkTheme 
      ? 'bg-slate-900 text-white transition-colors duration-500' 
      : 'bg-gray-100 text-gray-900 transition-colors duration-500';
  }, [isDarkTheme]);

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
    <div className={`relative w-full h-screen transition-all duration-500 ${
      isDarkTheme 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Overlay para mejorar contraste del tema */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        isDarkTheme ? 'bg-slate-900/20' : 'bg-white/30'
      }`}></div>
      
      <MapControls
        summary={summary}
        onDistanceChange={setMaxDistance}
        isDarkTheme={isDarkTheme}
        onToggleTheme={toggleTheme}
      />

      <GraphMap
        cities={cities}
        edges={edges}
        maxDistance={maxDistance}
        isDarkTheme={isDarkTheme}
      />
    </div>
  );
};