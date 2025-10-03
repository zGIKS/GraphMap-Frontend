/**
 * GraphMap Component - Main Map Visualization
 * Componente principal optimizado con virtualización
 */
import { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { MapService } from '../../application/services/MapService';
import L from 'leaflet';

// Función para ajustar colores en tema claro
const adjustColorForLight = (color) => {
  // Hacer los colores más oscuros y saturados para mejor visibilidad en fondo claro
  const colorMap = {
    '#ff6b6b': '#dc2626', // rojo más oscuro
    '#4ecdc4': '#059669', // verde más oscuro
    '#45b7d1': '#1d4ed8', // azul más oscuro
    '#96ceb4': '#065f46', // verde oscuro
    '#ffd93d': '#d97706', // amarillo más oscuro
    '#6c5ce7': '#5b21b6', // púrpura más oscuro
    '#fd79a8': '#be185d', // rosa más oscuro
    '#e17055': '#ea580c', // naranja más oscuro
  };
  
  return colorMap[color] || '#374151'; // gris oscuro por defecto
};

// Componente para manejar actualizaciones de zoom
function ZoomHandler({ onZoomEnd }) {
  const map = useMap();

  useEffect(() => {
    const handleZoom = () => {
      const zoom = map.getZoom();
      onZoomEnd(zoom);
    };

    map.on('zoomend', handleZoom);
    return () => map.off('zoomend', handleZoom);
  }, [map, onZoomEnd]);

  return null;
}

export const GraphMap = ({ cities, edges, maxDistance, isDarkTheme }) => {
  const [zoomLevel, setZoomLevel] = useState(2);

  // Crear Canvas Renderer para mejor performance
  const canvasRenderer = useMemo(() => {
    return L.canvas({ padding: 0.5 });
  }, []);

  // Memoizar el lookup de ciudades
  const cityMap = useMemo(() => {
    return MapService.createCityLookup(cities);
  }, [cities]);

  // Filtrar edges por distancia máxima
  const distanceFilteredEdges = useMemo(() => {
    return edges.filter(edge => {
      const source = cityMap.get(edge.source);
      const target = cityMap.get(edge.target);
      
      if (!source || !target) return false;
      
      const distance = edge.calculateDistance(source, target);
      return distance <= maxDistance;
    });
  }, [edges, maxDistance, cityMap]);

  // Filtrar edges visibles según zoom (optimización)
  const visibleEdges = useMemo(() => {
    return MapService.filterVisibleEdges(distanceFilteredEdges, cityMap, zoomLevel);
  }, [distanceFilteredEdges, cityMap, zoomLevel]);

  // Handler de zoom
  const handleZoomEnd = useCallback((zoom) => {
    setZoomLevel(zoom);
  }, []);

  // URLs de tiles según el tema
  const tileUrl = isDarkTheme 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={12}
      className={`w-full h-screen transition-all duration-500 z-10 relative ${
        isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'
      }`}
      zoomControl={false}
      attributionControl={false}
      scrollWheelZoom={true}
      doubleClickZoom={true}
      touchZoom={true}
      dragging={true}
    >
      <TileLayer
        url={tileUrl}
        attribution={attribution}
        key={isDarkTheme ? 'dark' : 'light'}
        className="transition-opacity duration-500"
      />
      
      <ZoomHandler onZoomEnd={handleZoomEnd} />

      {/* Renderizar aristas (líneas) */}
      {visibleEdges.map((edge, idx) => {
        const source = cityMap.get(edge.source);
        const target = cityMap.get(edge.target);

        if (!source || !target) return null;

        // Ajustar color de las líneas según el tema
        const baseColor = edge.getColor();
        const themeAdjustedColor = isDarkTheme ? baseColor : adjustColorForLight(baseColor);

        return (
          <Polyline
            key={`edge-${idx}`}
            positions={[source.coordinates, target.coordinates]}
            color={themeAdjustedColor}
            opacity={isDarkTheme ? edge.getOpacity() : Math.min(edge.getOpacity() + 0.2, 1)}
            weight={zoomLevel > 5 ? 2 : 1}
          />
        );
      })}

      {/* Renderizar ciudades (puntos) */}
      {cities.map((city) => (
        <CircleMarker
          key={`city-${city.id}`}
          center={city.coordinates}
          radius={zoomLevel > 5 ? 4 : 2}
          fillColor={isDarkTheme ? "#3b82f6" : "#1d4ed8"}
          color={isDarkTheme ? "#60a5fa" : "#3b82f6"}
          fillOpacity={0.8}
          weight={1}
        >
          {/* Tooltip que aparece al hacer hover */}
          {zoomLevel > 6 && (
            <Tooltip direction="top" offset={[0, -10]} permanent={false}>
              <div className="text-center">
                <div className={`font-bold text-sm ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{city.name}</div>
                <div className={`text-xs ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{city.country}</div>
              </div>
            </Tooltip>
          )}
        </CircleMarker>
      ))}
    </MapContainer>
  );
};