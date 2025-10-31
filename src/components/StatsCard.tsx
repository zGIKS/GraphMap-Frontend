interface StatsCardProps {
  nodeCount: number;
}

export const StatsCard = ({ nodeCount }: StatsCardProps) => {
  return (
    <div className="absolute bottom-6 left-6 bg-card/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-2xl border transition-all hover:bg-card/95">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="text-sm">
          <span className="font-semibold text-muted-foreground">Nodes:</span>{' '}
          <span className="font-mono text-foreground">{nodeCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
