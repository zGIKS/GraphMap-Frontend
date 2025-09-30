/**
 * Custom Hook - useGraphData
 * Hook para cargar datos del grafo con manejo de estado
 */
import { useState, useEffect } from 'react';
import { graphRepository } from '../../infrastructure/api/GraphRepository';

export const useGraphData = () => {
  const [cities, setCities] = useState([]);
  const [edges, setEdges] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setProgress(0);

      // Cargar summary primero
      const summaryData = await graphRepository.getSummary();
      setSummary(summaryData);
      setProgress(25);

      // Cargar ciudades
      const citiesData = await graphRepository.getCities();
      setCities(citiesData);
      setProgress(60);

      // Cargar aristas (lazy para mejorar performance)
      setTimeout(async () => {
        const edgesData = await graphRepository.getEdges();
        setEdges(edgesData);
        setProgress(100);
        setLoading(false);
      }, 100);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const filterEdgesByDistance = (maxDistance) => {
    return edges.filter(edge => edge.distance <= maxDistance);
  };

  const filterEdgesByViewport = async (bounds) => {
    return await graphRepository.getEdgesInViewport(bounds);
  };

  return {
    cities,
    edges,
    summary,
    loading,
    error,
    progress,
    filterEdgesByDistance,
    filterEdgesByViewport,
    reload: loadData,
  };
};