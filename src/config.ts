export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  cities: `${API_BASE_URL}/cities/`,
  citiesCount: `${API_BASE_URL}/cities/count`,
  graphEdges: `${API_BASE_URL}/graph/edges`,
  graphSummary: `${API_BASE_URL}/graph/summary`,
  shortestPath: `${API_BASE_URL}/graph/shortest-path`,
  chat: `${API_BASE_URL}/chat/`,
} as const;
