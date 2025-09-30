/**
 * API Configuration
 * Configuración centralizada del backend
 */
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000',
  ENDPOINTS: {
    CITIES: '/cities/',
    EDGES: '/graph/edges',
    SUMMARY: '/graph/summary',
    EDGES_VIEWPORT: '/edges/viewport', // Para optimización futura
  },
  TIMEOUT: 30000,
};