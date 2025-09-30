/**
 * Repository Interface - Patrón Repository
 * Define el contrato para acceder a datos del grafo
 */
export class IGraphRepository {
  async getCities() {
    throw new Error('Method not implemented');
  }

  async getEdges() {
    throw new Error('Method not implemented');
  }

  async getSummary() {
    throw new Error('Method not implemented');
  }

  async getEdgesInViewport(bounds) {
    throw new Error('Method not implemented');
  }
}