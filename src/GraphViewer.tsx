import { useRef } from 'react';
import { useWebGL } from './hooks/useWebGL';
import { useGraphData } from './hooks/useGraphData';
import { ErrorOverlay } from './components/ErrorOverlay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { StatsCard } from './components/StatsCard';

const GraphViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const webglSupported = useWebGL();
  const { loading, error, nodeCount } = useGraphData({ containerRef, webglSupported });

  return (
    <div className="w-full h-screen relative bg-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        {error && <ErrorOverlay error={error} webglSupported={webglSupported} />}
        
        <div 
          ref={containerRef} 
          className="w-full h-full"
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      {!loading && !error && <StatsCard nodeCount={nodeCount} />}
      {loading && !error && <LoadingSpinner />}
    </div>
  );
};

export default GraphViewer;
