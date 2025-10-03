/**
 * API Configuration
 * Configuración centralizada del backend usando variables de entorno
 */

// Función para validar variables de entorno requeridas
const getEnvVar = (name, defaultValue = null) => {
  const value = import.meta.env[name];
  if (!value && !defaultValue) {
    console.warn(`⚠️ Variable de entorno requerida no encontrada: ${name}`);
  }
  return value || defaultValue;
};

// Validar que las variables críticas estén definidas
const BASE_URL = getEnvVar('VITE_API_BASE_URL', 'http://127.0.0.1:8000');
const TIMEOUT = parseInt(getEnvVar('VITE_API_TIMEOUT', '30000'));

export const API_CONFIG = {
  BASE_URL,
  ENDPOINTS: {
    CITIES: '/cities/',
    EDGES: '/graph/edges',
    SUMMARY: '/graph/summary',
    EDGES_VIEWPORT: '/edges/viewport', // Para optimización futura
  },
  TIMEOUT,
  ENV: getEnvVar('VITE_ENV', 'development'),
};

// Log de configuración en desarrollo
if (API_CONFIG.ENV === 'development') {
  console.log('🔧 API Configuration:', {
    BASE_URL: API_CONFIG.BASE_URL,
    TIMEOUT: API_CONFIG.TIMEOUT,
    ENV: API_CONFIG.ENV
  });
}