import { useState } from 'react';

export const useGraphState = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);

  return {
    loading,
    error,
    nodeCount,
    edgeCount,
    setLoading,
    setError,
    setNodeCount,
    setEdgeCount,
  };
};