/**
 * Domain Model - City Entity
 * Representa una ciudad en el grafo
 */
export class City {
  constructor(data) {
    this.id = data.id;
    this.name = data.name || data.city; // La API usa 'name', fallback a 'city'
    this.latitude = data.latitude || data.lat; // La API usa 'latitude'
    this.longitude = data.longitude || data.lng; // La API usa 'longitude'
    this.country = data.country;
    this.iso2 = data.iso2;
    this.iso3 = data.iso3;
    this.adminName = data.admin_name;
    this.capital = data.capital;
    this.population = data.population;
    
    // Mantener compatibilidad con código existente
    this.lat = this.latitude;
    this.lng = this.longitude;
  }

  get coordinates() {
    return [this.latitude, this.longitude];
  }

  isInBounds(bounds) {
    return (
      this.latitude >= bounds.minLat &&
      this.latitude <= bounds.maxLat &&
      this.longitude >= bounds.minLng &&
      this.longitude <= bounds.maxLng
    );
  }
}