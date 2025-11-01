import { useEffect, useRef, useState, useCallback } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import { API_ENDPOINTS } from '../config';
import type { CitiesResponse, City, EdgesResponse, ShortestPathResponse } from '../types';

interface UseGraphDataProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  webglSupported: boolean;
}

export const useGraphData = ({ containerRef, webglSupported }: UseGraphDataProps) => {
  const sigmaRef = useRef<Sigma | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    if (!webglSupported) {
      setError('WebGL is not available in your browser.');
      setLoading(false);
      return;
    }

    let mounted = true;

    // Observar cambios en el tema
    const themeObserver = new MutationObserver(() => {
      if (sigmaRef.current) {
        const isDark = document.documentElement.classList.contains('dark');
        const nodeColor = isDark ? '#e4e4e7' : '#0a0a0a';
        const edgeColor = isDark ? '#52525b' : '#d4d4d8';
        const pathEdgeColor = '#f97316'; // naranja

        const graph = sigmaRef.current.getGraph();

        // Actualizar colores de nodos
        graph.forEachNode((node) => {
          graph.setNodeAttribute(node, 'color', nodeColor);
        });

        // Actualizar colores de aristas solo si NO son naranjas (camino más corto)
        graph.forEachEdge((edge) => {
          const currentColor = graph.getEdgeAttribute(edge, 'color');
          // Solo actualizar si no es el color naranja del camino
          if (currentColor !== pathEdgeColor) {
            graph.setEdgeAttribute(edge, 'color', edgeColor);
          }
        });

        sigmaRef.current.refresh();
      }
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const initGraph = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!containerRef.current) {
          throw new Error('Container not ready');
        }

        await new Promise(resolve => setTimeout(resolve, 100));
        if (!mounted) return;

        const response = await fetch(API_ENDPOINTS.cities);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CitiesResponse = await response.json();
        if (!mounted || !data.cities?.length) return;

        setCities(data.cities);
        const graph = new Graph({ type: 'undirected' });

        // Obtener colores según el tema actual
        const isDark = document.documentElement.classList.contains('dark');

        // Colores para nodos: oscuro en light mode, claro en dark mode
        const nodeColor = isDark ? '#e4e4e7' : '#0a0a0a';

        // Colores para aristas: más sutiles
        const edgeColor = isDark ? '#52525b' : '#d4d4d8';

        data.cities.forEach((city: City) => {
          graph.addNode(city.id.toString(), {
            label: city.city,
            x: city.lng,
            y: city.lat,
            size: 2,
            color: nodeColor,
          });
        });

        // Cargar las aristas
        const edgesResponse = await fetch(API_ENDPOINTS.graphEdges);
        if (edgesResponse.ok) {
          const edgesData: EdgesResponse = await edgesResponse.json();

          console.log('Total edges received from API:', edgesData.edges?.length || 0);

          if (edgesData.edges && mounted) {
            let addedCount = 0;
            let skippedCount = 0;
            const skippedEdges: string[] = [];

            edgesData.edges.forEach((edge) => {
              const sourceId = edge.source.toString();
              const targetId = edge.target.toString();

              // Solo agregar arista si ambos nodos existen
              if (graph.hasNode(sourceId) && graph.hasNode(targetId)) {
                try {
                  graph.addEdge(sourceId, targetId, {
                    size: 0.5,
                    color: edgeColor,
                  });
                  addedCount++;
                } catch (err) {
                  // Edge might already exist
                  skippedCount++;
                  skippedEdges.push(`${sourceId} → ${targetId}`);
                }
              } else {
                skippedCount++;
                if (skippedEdges.length < 10) {
                  skippedEdges.push(`${sourceId} → ${targetId} (missing nodes)`);
                }
              }
            });

            console.log('Edges successfully added to graph:', addedCount);
            console.log('Edges skipped:', skippedCount);
            if (skippedEdges.length > 0) {
              console.log('First few skipped edges:', skippedEdges.slice(0, 10));
            }
            console.log('Final graph edge count:', graph.size);
            console.log('Final graph node count:', graph.order);

            setEdgeCount(graph.size);
          }
        } else {
          console.error('Failed to fetch edges:', edgesResponse.status);
        }

        if (containerRef.current && mounted) {
          if (sigmaRef.current) {
            sigmaRef.current.kill();
          }

          sigmaRef.current = new Sigma(graph, containerRef.current, {
            renderLabels: false,
            enableEdgeEvents: false,
          });

          setNodeCount(graph.order);
        }

        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setLoading(false);
      }
    };

    const timer = setTimeout(initGraph, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      themeObserver.disconnect();
      if (sigmaRef.current) {
        sigmaRef.current.kill();
        sigmaRef.current = null;
      }
    };
  }, [containerRef, webglSupported]);

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
  }, []);

  return { loading, error, nodeCount, edgeCount, cities, findShortestPath };
};
