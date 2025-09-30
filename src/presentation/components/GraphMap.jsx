/**
 * GraphMap Component - Main Map Visualization
 * Componente principal optimizado con virtualización
 */
import { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from 'react-leaflet';
import { MapService } from '../../application/services/MapService';

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

export const GraphMap = ({ cities, edges, maxDistance }) => {
  const [zoomLevel, setZoomLevel] = useState(2);

  // Memoizar el lookup de ciudades
  const cityMap = useMemo(() => {
    return MapService.createCityLookup(cities);
  }, [cities]);

  // Filtrar edges por distancia máxima
  const distanceFilteredEdges = useMemo(() => {
    return edges.filter(edge => edge.distance <= maxDistance);
  }, [edges, maxDistance]);

  // Filtrar edges visibles según zoom (optimización)
  const visibleEdges = useMemo(() => {
    return MapService.filterVisibleEdges(distanceFilteredEdges, cityMap, zoomLevel);
  }, [distanceFilteredEdges, cityMap, zoomLevel]);

  // Handler de zoom
  const handleZoomEnd = useCallback((zoom) => {
    setZoomLevel(zoom);
  }, []);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={12}
      className="w-full h-screen"
      zoomControl={true}
      attributionControl={false}
    >
      {/* Tema oscuro moderno */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        maxZoom={19}
      />

      <ZoomHandler onZoomEnd={handleZoomEnd} />

      {/* Renderizar aristas (líneas) */}
      {visibleEdges.map((edge, idx) => {
        const source = cityMap.get(edge.source);
        const target = cityMap.get(edge.target);

        if (!source || !target) return null;

        return (
          <Polyline
            key={`edge-${idx}`}
            positions={[source.coordinates, target.coordinates]}
            color={edge.getColor()}
            opacity={edge.getOpacity()}
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
          fillColor="#3b82f6"
          color="#60a5fa"
          fillOpacity={0.8}
          weight={1}
        >
          {/* Tooltip con información */}
          {zoomLevel > 6 && (
            <div className="leaflet-popup-content">
              <div className="text-xs">
                <p className="font-bold">{city.name}</p>
                <p className="text-gray-600">{city.country}</p>
              </div>
            </div>
          )}
        </CircleMarker>
      ))}
    </MapContainer>
  );
};