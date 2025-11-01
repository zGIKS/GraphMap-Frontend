import { Card, CardContent } from '@/components/ui/card';

interface StatsSectionProps {
  nodeCount: number;
  edgeCount: number;
}

export const StatsSection = ({ nodeCount, edgeCount }: StatsSectionProps) => {
  return (
    <div className="px-6 mb-4">
      <Card className="py-3">
        <CardContent className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <div className="text-xs">
              <span className="font-medium text-muted-foreground">Nodes:</span>{' '}
              <span className="font-mono text-foreground font-semibold">{nodeCount.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
            <div className="text-xs">
              <span className="font-medium text-muted-foreground">Edges:</span>{' '}
              <span className="font-mono text-foreground font-semibold">{edgeCount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};