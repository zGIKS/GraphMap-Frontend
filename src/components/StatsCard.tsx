interface StatsCardProps {
  nodeCount: number;
}

export const StatsCard = ({ nodeCount }: StatsCardProps) => {
  return (
    <div className="absolute bottom-6 left-6 bg-gray-800/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-2xl border border-gray-700/50 transition-all hover:bg-gray-800/95">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <div className="text-sm">
          <span className="font-semibold text-gray-300">Nodes:</span>{' '}
          <span className="font-mono text-green-400">{nodeCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
