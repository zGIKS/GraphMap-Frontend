import { useEffect, useRef, useState } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import { API_ENDPOINTS } from '../config';
import type { CitiesResponse, City, EdgesResponse } from '../types';

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

        const graph = sigmaRef.current.getGraph();

        // Actualizar colores de nodos
        graph.forEachNode((node) => {
          graph.setNodeAttribute(node, 'color', nodeColor);
        });

        // Actualizar colores de aristas
        graph.forEachEdge((edge) => {
          graph.setEdgeAttribute(edge, 'color', edgeColor);
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
        const graph = new Graph();

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
          
          if (edgesData.edges && mounted) {
            edgesData.edges.forEach((edge) => {
              const sourceId = edge.source.toString();
              const targetId = edge.target.toString();
              
              // Solo agregar arista si ambos nodos existen
              if (graph.hasNode(sourceId) && graph.hasNode(targetId)) {
                graph.addEdge(sourceId, targetId, {
                  size: 0.5,
                  color: edgeColor,
                });
              }
            });
            
            setEdgeCount(graph.size);
          }
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

  return { loading, error, nodeCount, edgeCount, cities };
};
