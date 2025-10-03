import { useEffect, useRef, useState } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import { API_ENDPOINTS } from '../config';
import type { CitiesResponse, City } from '../types';

interface UseGraphDataProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  webglSupported: boolean;
}

export const useGraphData = ({ containerRef, webglSupported }: UseGraphDataProps) => {
  const sigmaRef = useRef<Sigma | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nodeCount, setNodeCount] = useState(0);

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

        const graph = new Graph();

        data.cities.forEach((city: City) => {
          graph.addNode(city.id.toString(), {
            label: city.city,
            x: city.lng,
            y: city.lat,
            size: 2,
            color: '#1f77b4',
          });
        });

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
  }, [containerRef, webglSupported]);

  return { loading, error, nodeCount };
};
