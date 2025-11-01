import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { API_ENDPOINTS } from '@/config';

interface GraphSummary {
  num_nodes: number;
  num_edges: number;
}

export const StatsSection = () => {
  const [summary, setSummary] = useState<GraphSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.graphSummary);
        if (response.ok) {
          const data: GraphSummary = await response.json();
          setSummary(data);
        }
      } catch (error) {
        console.error('Error fetching graph summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="px-6 mb-4">
      <Card className="py-3">
        <CardContent className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <div className="text-xs">
              <span className="font-medium text-muted-foreground">Nodes:</span>{' '}
              <span className="font-mono text-foreground font-semibold">
                {loading ? '...' : summary?.num_nodes.toLocaleString() || '0'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
            <div className="text-xs">
              <span className="font-medium text-muted-foreground">Edges:</span>{' '}
              <span className="font-mono text-foreground font-semibold">
                {loading ? '...' : summary?.num_edges.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};