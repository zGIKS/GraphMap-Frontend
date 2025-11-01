import { useEffect, useRef } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import { API_ENDPOINTS } from '../config';
import type { CitiesResponse, City, EdgesResponse } from '../types';

interface UseGraphInitializationProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  webglSupported: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCities: (cities: City[]) => void;
  setNodeCount: (count: number) => void;
  setEdgeCount: (count: number) => void;
}

export const useGraphInitialization = ({
  containerRef,
  webglSupported,
  setLoading,
  setError,
  setCities,
  setNodeCount,
  setEdgeCount,
}: UseGraphInitializationProps) => {
  const sigmaRef = useRef<Sigma | null>(null);

  useEffect(() => {
    if (!webglSupported) {
      setError('WebGL is not available in your browser.');
      setLoading(false);
      return;
    }

    let mounted = true;

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
                } catch {
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
      if (sigmaRef.current) {
        sigmaRef.current.kill();
        sigmaRef.current = null;
      }
    };
  }, [containerRef, webglSupported, setLoading, setError, setCities, setNodeCount, setEdgeCount]);

  return sigmaRef;
};