/**
 * Domain Model - Edge Entity
 * Representa una conexión entre dos ciudades
 */
export class Edge {
  constructor(data) {
    this.source = data.source;
    this.target = data.target;
    // La API no devuelve distancia, la calcularemos dinámicamente
    this.distance = data.distance || null;
    this._calculatedDistance = null;
  }

  // Calcular distancia usando coordenadas si no está disponible
  calculateDistance(sourceCity, targetCity) {
    if (this._calculatedDistance !== null) return this._calculatedDistance;
    if (this.distance) return this.distance;
    
    if (!sourceCity || !targetCity) return 0;
    
    // Fórmula de Haversine para calcular distancia entre coordenadas
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(targetCity.latitude - sourceCity.latitude);
    const dLng = this.deg2rad(targetCity.longitude - sourceCity.longitude);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(sourceCity.latitude)) * Math.cos(this.deg2rad(targetCity.latitude)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Cache la distancia calculada
    this._calculatedDistance = distance;
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  get weight() {
    return this._calculatedDistance || this.distance || 0;
  }

  getOpacity() {
    const distance = this._calculatedDistance || this.distance || 0;
    // Aristas más cortas son más opacas
    if (distance < 500) return 0.6;
    if (distance < 1000) return 0.4;
    if (distance < 2000) return 0.25;
    return 0.15;
  }

  getColor() {
    const distance = this._calculatedDistance || this.distance || 0;
    // Color basado en distancia
    if (distance < 500) return '#10b981'; // green
    if (distance < 1000) return '#3b82f6'; // blue
    if (distance < 2000) return '#f59e0b'; // amber
    return '#ef4444'; // red
  }
}