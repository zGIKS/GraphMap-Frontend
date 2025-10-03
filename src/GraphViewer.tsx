import { useEffect, useRef, useState } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import { API_ENDPOINTS } from './config';
import type { CitiesResponse, City } from './types';

const GraphViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaRef = useRef<Sigma | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ nodes: 0, loading: true });
  const [webglSupported, setWebglSupported] = useState(true);

  // Check WebGL support
  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
      } catch (e) {
        return false;
      }
    };

    const supported = checkWebGL();
    setWebglSupported(supported);
    
    if (!supported) {
      setError('WebGL is not available in your browser. Please enable WebGL or use a different browser.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initGraph = async () => {
      // Don't initialize if WebGL is not supported
      if (!webglSupported) return;

      try {
        setLoading(true);
        setError(null);

        // Wait for container to be mounted with proper dimensions
        if (!containerRef.current) {
          throw new Error('Container not ready');
        }

        // Small delay to ensure DOM is fully ready
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!mounted) return;

        // Fetch cities from API
        const response = await fetch(API_ENDPOINTS.cities);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: CitiesResponse = await response.json();

        if (!mounted) return;

        if (!data.cities || data.cities.length === 0) {
          throw new Error('No cities data received');
        }

        // Create empty graph
        const graph = new Graph();

        // Add nodes with geographical positions
        data.cities.forEach((city: City) => {
          graph.addNode(city.id.toString(), {
            label: city.city,
            x: city.lng, // longitude as x
            y: city.lat, // latitude as y
            size: 2,
            color: '#1f77b4',
          });
        });

        // Initialize Sigma renderer
        if (containerRef.current && mounted) {
          // Clear previous instance if exists
          if (sigmaRef.current) {
            sigmaRef.current.kill();
          }

          sigmaRef.current = new Sigma(graph, containerRef.current, {
            renderLabels: false, // Disable labels for better performance
            enableEdgeEvents: false,
          });

          setStats({ nodes: graph.order, loading: false });
        }

        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        setLoading(false);
        console.error('Error initializing graph:', err);
      }
    };

    // Add delay to ensure container has dimensions
    const timer = setTimeout(() => {
      initGraph();
    }, 100);

    // Cleanup on unmount
    return () => {
      mounted = false;
      clearTimeout(timer);
      if (sigmaRef.current) {
        sigmaRef.current.kill();
        sigmaRef.current = null;
      }
    };
  }, [webglSupported]);

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 shadow-lg flex-shrink-0">
        <h1 className="text-2xl font-bold">GraphMap - City Network Visualization</h1>
        <div className="flex gap-4 mt-2 text-sm">
          {loading ? (
            <span className="text-yellow-400">Loading cities...</span>
          ) : error ? (
            <span className="text-red-400">Error: {error}</span>
          ) : (
            <>
              <span className="text-green-400">✓ Loaded {stats.nodes} cities</span>
              <span className="text-gray-400">| Rendering with WebGL (Sigma.js)</span>
            </>
          )}
        </div>
      </div>

      {/* Graph Container */}
      <div className="flex-1 relative min-h-0">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-10">
            <div className="bg-red-900 text-white p-6 rounded-lg shadow-xl max-w-2xl">
              <h2 className="text-xl font-bold mb-2">⚠️ Error Loading Graph</h2>
              <p className="mb-4">{error}</p>
              
              {!webglSupported && (
                <div className="bg-red-800 p-4 rounded mt-4 text-sm">
                  <p className="font-semibold mb-2">How to enable WebGL:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-200">
                    <li><strong>Firefox:</strong> Go to <code>about:config</code>, search for <code>webgl.disabled</code> and set it to <code>false</code></li>
                    <li><strong>Chrome:</strong> Go to <code>chrome://settings</code> → System → Enable "Use hardware acceleration when available"</li>
                    <li><strong>Edge:</strong> Similar to Chrome, enable hardware acceleration in settings</li>
                    <li>Try a different browser (Chrome, Firefox, Edge)</li>
                    <li>Update your graphics drivers</li>
                  </ul>
                </div>
              )}
              
              {webglSupported && (
                <p className="mt-4 text-sm text-gray-300">
                  Make sure the backend is running at http://127.0.0.1:8000
                </p>
              )}
            </div>
          </div>
        )}
        <div 
          ref={containerRef} 
          className="w-full h-full"
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      {/* Info Panel */}
      {!loading && !error && (
        <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 text-white p-3 rounded-lg shadow-lg text-sm">
          <div className="font-semibold mb-1">Graph Info:</div>
          <div>Nodes: {stats.nodes}</div>
          <div className="text-gray-400 mt-2 text-xs">
            Use mouse wheel to zoom<br />
            Click and drag to pan
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphViewer;
