/**
 * Graph Repository Implementation
 * Implementación concreta del repositorio con caché
 */
import { IGraphRepository } from '../../domain/repositories/IGraphRepository';
import { City } from '../../domain/models/City';
import { Edge } from '../../domain/models/Edge';
import { httpClient } from './httpClient';
import { API_CONFIG } from '../config/api.config';

export class GraphRepository extends IGraphRepository {
  constructor() {
    super();
    this.cache = {
      cities: null,
      edges: null,
      summary: null,
      timestamp: null,
    };
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  }

  isCacheValid() {
    return (
      this.cache.timestamp &&
      Date.now() - this.cache.timestamp < this.CACHE_DURATION
    );
  }

  async getCities() {
    if (this.cache.cities && this.isCacheValid()) {
      return this.cache.cities;
    }

    const data = await httpClient.get(API_CONFIG.ENDPOINTS.CITIES);
    // El endpoint devuelve directamente el array de ciudades
    this.cache.cities = Array.isArray(data) ? data.map((city) => new City(city)) : data.cities.map((city) => new City(city));
    this.cache.timestamp = Date.now();

    return this.cache.cities;
  }

  async getEdges() {
    if (this.cache.edges && this.isCacheValid()) {
      return this.cache.edges;
    }

    const data = await httpClient.get(API_CONFIG.ENDPOINTS.EDGES);
    // El endpoint devuelve directamente el array de edges
    this.cache.edges = Array.isArray(data) ? data.map((edge) => new Edge(edge)) : data.edges.map((edge) => new Edge(edge));

    return this.cache.edges;
  }

  async getSummary() {
    if (this.cache.summary && this.isCacheValid()) {
      return this.cache.summary;
    }

    const data = await httpClient.get(API_CONFIG.ENDPOINTS.SUMMARY);
    this.cache.summary = data;

    return this.cache.summary;
  }

  async getEdgesInViewport(bounds) {
    // Implementación futura con endpoint específico
    // Por ahora filtramos en cliente
    const allEdges = await this.getEdges();
    const cities = await this.getCities();

    const cityMap = new Map(cities.map(c => [c.id, c]));

    return allEdges.filter(edge => {
      const source = cityMap.get(edge.source);
      const target = cityMap.get(edge.target);

      if (!source || !target) return false;

      return source.isInBounds(bounds) || target.isInBounds(bounds);
    });
  }

  clearCache() {
    this.cache = {
      cities: null,
      edges: null,
      summary: null,
      timestamp: null,
    };
  }
}

// Singleton instance
export const graphRepository = new GraphRepository();