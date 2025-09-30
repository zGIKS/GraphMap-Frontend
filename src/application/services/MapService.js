/**
 * Map Service - Business Logic
 * Lógica de negocio para operaciones del mapa
 */
export class MapService {
  static createCityLookup(cities) {
    const lookup = new Map();
    cities.forEach(city => {
      lookup.set(city.id, city);
    });
    return lookup;
  }

  static filterVisibleEdges(edges, cityMap, zoomLevel) {
    // Estrategia de optimización basada en zoom
    let maxDistance;

    if (zoomLevel <= 3) {
      maxDistance = 2000; // Zoom bajo: solo conexiones continentales
    } else if (zoomLevel <= 5) {
      maxDistance = 1500;
    } else if (zoomLevel <= 7) {
      maxDistance = 1000;
    } else {
      maxDistance = 500; // Zoom alto: conexiones locales
    }

    return edges.filter(edge => {
      if (edge.distance > maxDistance) return false;

      const source = cityMap.get(edge.source);
      const target = cityMap.get(edge.target);

      return source && target;
    });
  }

  static getBounds(map) {
    const bounds = map.getBounds();
    return {
      minLat: bounds.getSouth(),
      maxLat: bounds.getNorth(),
      minLng: bounds.getWest(),
      maxLng: bounds.getEast(),
    };
  }

  static calculateZoomLevel(map) {
    return map.getZoom();
  }
}