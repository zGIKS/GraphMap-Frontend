import { useRef } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useWebGL } from './hooks/useWebGL';
import { useGraphData } from './hooks/useGraphData';
import { useTheme } from './hooks';
import { ErrorOverlay, LoadingSpinner, Sidebar } from './components';
import { Button } from './components/ui/button';

const GraphViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const webglSupported = useWebGL();
  const { loading, error, nodeCount, edgeCount, cities, findShortestPath } = useGraphData({ containerRef, webglSupported });
  const { theme, toggleTheme } = useTheme();

  const handlePathSearch = async (startId: number, endId: number) => {
    await findShortestPath(startId, endId);
  };

  return (
    <div className="w-full h-screen relative bg-background overflow-hidden">
      {!loading && !error && (
        <>
          <Sidebar cities={cities} nodeCount={nodeCount} edgeCount={edgeCount} onPathSearch={handlePathSearch} />

          {/* Theme Toggle Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="fixed top-4 right-4 z-50 backdrop-blur-sm"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </>
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
