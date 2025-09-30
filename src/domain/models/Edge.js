/**
 * Domain Model - Edge Entity
 * Representa una conexión entre dos ciudades
 */
export class Edge {
  constructor(data) {
    this.source = data.source;
    this.target = data.target;
    this.distance = data.distance;
  }

  get weight() {
    return this.distance;
  }

  getOpacity() {
    // Aristas más cortas son más opacas
    if (this.distance < 500) return 0.6;
    if (this.distance < 1000) return 0.4;
    if (this.distance < 2000) return 0.25;
    return 0.15;
  }

  getColor() {
    // Color basado en distancia
    if (this.distance < 500) return '#10b981'; // green
    if (this.distance < 1000) return '#3b82f6'; // blue
    if (this.distance < 2000) return '#f59e0b'; // amber
    return '#ef4444'; // red
  }
}