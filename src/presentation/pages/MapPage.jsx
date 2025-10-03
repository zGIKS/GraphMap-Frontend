/**
 * MapPage - Main Application Page
 * Página principal que orquesta todos los componentes
 */
import React, { useState } from 'react';
import { useGraphData } from '../../application/hooks/useGraphData';
import { GraphMap } from '../components/GraphMap';
import { LoadingScreen } from '../components/LoadingScreen';

export const MapPage = () => {
  const {
    cities,
    edges,
    loading,
    error,
    reload,
  } = useGraphData();

  const [maxDistance] = useState(2000);
  const [isDarkTheme] = useState(true);

  // Aplicar tema inicial al body
  React.useEffect(() => {
    document.body.className = isDarkTheme
      ? 'bg-slate-900 text-white transition-colors duration-500'
      : 'bg-gray-100 text-gray-900 transition-colors duration-500';
  }, [isDarkTheme]);

  // Mostrar loading screen
  if (loading) {
    return <LoadingScreen isDarkTheme={isDarkTheme} />;
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <p className={`text-lg mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Error de conexión</p>
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

      <GraphMap
        cities={cities}
        edges={edges}
        maxDistance={maxDistance}
        isDarkTheme={isDarkTheme}
      />
    </div>
  );
};