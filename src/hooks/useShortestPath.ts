import { useCallback } from 'react';
import Sigma from 'sigma';
import { API_ENDPOINTS } from '../config';
import type { ShortestPathResponse } from '../types';

export const useShortestPath = (sigmaRef: React.RefObject<Sigma | null>) => {
  const findShortestPath = useCallback(async (startId: number, endId: number) => {
    if (!sigmaRef.current) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.shortestPath}?start_id=${startId}&goal_id=${endId}`);
      if (!response.ok) {
        throw new Error(`Failed to find path: ${response.status}`);
      }

      const data: ShortestPathResponse = await response.json();
      const graph = sigmaRef.current.getGraph();
      const isDark = document.documentElement.classList.contains('dark');

      // Colores normales
      const normalEdgeColor = isDark ? '#52525b' : '#d4d4d8';
      // Color para el camino más corto (siempre naranja, no cambia con el tema)
      const pathEdgeColor = '#f97316'; // orange

      // Resetear todos los bordes a color normal primero
      graph.forEachEdge((edge) => {
        graph.setEdgeAttribute(edge, 'color', normalEdgeColor);
        graph.setEdgeAttribute(edge, 'size', 0.5);
      });

      // Resaltar el camino más corto
      for (let i = 0; i < data.path.length - 1; i++) {
        const sourceId = data.path[i].id.toString();
        const targetId = data.path[i + 1].id.toString();

        // Buscar la arista entre estos dos nodos
        let edge = graph.edge(sourceId, targetId);

        // Si no existe la arista, crearla temporalmente para visualizar el camino
        if (!edge) {
          console.warn(`Edge missing: ${data.path[i].city} → ${data.path[i + 1].city}`);

          // Crear la arista temporalmente
          if (graph.hasNode(sourceId) && graph.hasNode(targetId)) {
            try {
              graph.addEdge(sourceId, targetId, {
                size: 2,
                color: pathEdgeColor,
              });
            } catch (err) {
              console.error(`Failed to add edge ${sourceId} → ${targetId}:`, err);
            }
          }
        } else {
          graph.setEdgeAttribute(edge, 'color', pathEdgeColor);
          graph.setEdgeAttribute(edge, 'size', 2); // Hacer las aristas del camino más gruesas
        }
      }

      sigmaRef.current.refresh();

      console.log(`Path found! Distance: ${data.distance.toFixed(2)} km, Cities explored: ${data.cities_explored}`);
    } catch (err) {
      console.error('Error finding shortest path:', err);
    }
  }, [sigmaRef]);

  return { findShortestPath };
};