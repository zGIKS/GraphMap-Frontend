import { useRef } from 'react';
import { useWebGL } from './hooks/useWebGL';
import { useGraphData } from './hooks/useGraphData';
import { ErrorOverlay, LoadingSpinner, Sidebar } from './components';

const GraphViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const webglSupported = useWebGL();
  const { loading, error, nodeCount, cities } = useGraphData({ containerRef, webglSupported });

  const handleCityClick = (city: { id: number; city: string; lat: number; lng: number }) => {
    console.log('City clicked:', city);
    // TODO: Implementar zoom/focus en el nodo seleccionado
  };

  return (
    <div className="w-full h-screen relative bg-gray-900 overflow-hidden">
      {!loading && !error && (
        <Sidebar cities={cities} nodeCount={nodeCount} onCityClick={handleCityClick} />
      )}
      
      <div className="absolute inset-0">
        {error && <ErrorOverlay error={error} webglSupported={webglSupported} />}
        
        <div 
          ref={containerRef} 
          className="w-full h-full"
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      {loading && !error && <LoadingSpinner />}
    </div>
  );
};

export default GraphViewer;
