/**
 * Domain Model - City Entity
 * Representa una ciudad en el grafo
 */
export class City {
  constructor(data) {
    this.id = data.id;
    this.name = data.city;
    this.lat = data.lat;
    this.lng = data.lng;
    this.country = data.country;
    this.iso2 = data.iso2;
    this.iso3 = data.iso3;
    this.adminName = data.admin_name;
    this.capital = data.capital;
    this.population = data.population;
  }

  get coordinates() {
    return [this.lat, this.lng];
  }

  isInBounds(bounds) {
    return (
      this.lat >= bounds.minLat &&
      this.lat <= bounds.maxLat &&
      this.lng >= bounds.minLng &&
      this.lng <= bounds.maxLng
    );
  }
}