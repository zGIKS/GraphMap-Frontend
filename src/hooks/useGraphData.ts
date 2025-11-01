import { useState } from 'react';
import { useGraphState } from './useGraphState';
import { useThemeObserver } from './useThemeObserver';
import { useGraphInitialization } from './useGraphInitialization';
import { useShortestPath } from './useShortestPath';
import type { City } from '../types';

interface UseGraphDataProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  webglSupported: boolean;
}

export const useGraphData = ({ containerRef, webglSupported }: UseGraphDataProps) => {
  const [cities, setCities] = useState<City[]>([]);

  const {
    loading,
    error,
    nodeCount,
    edgeCount,
    setLoading,
    setError,
    setNodeCount,
    setEdgeCount,
  } = useGraphState();

  const sigmaRef = useGraphInitialization({
    containerRef,
    webglSupported,
    setLoading,
    setError,
    setCities,
    setNodeCount,
    setEdgeCount,
  });

  useThemeObserver(sigmaRef);

  const { findShortestPath } = useShortestPath(sigmaRef);

  return { loading, error, nodeCount, edgeCount, cities, findShortestPath };
};
