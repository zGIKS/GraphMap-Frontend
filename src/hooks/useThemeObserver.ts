import { useEffect } from 'react';
import Sigma from 'sigma';

export const useThemeObserver = (sigmaRef: React.RefObject<Sigma | null>) => {
  useEffect(() => {
    const themeObserver = new MutationObserver(() => {
      if (sigmaRef.current) {
        const isDark = document.documentElement.classList.contains('dark');
        const nodeColor = isDark ? '#e4e4e7' : '#0a0a0a';
        const edgeColor = isDark ? '#52525b' : '#d4d4d8';
        const pathEdgeColor = '#f97316'; // naranja

        const graph = sigmaRef.current.getGraph();

        // Actualizar colores de nodos
        graph.forEachNode((node) => {
          graph.setNodeAttribute(node, 'color', nodeColor);
        });

        // Actualizar colores de aristas solo si NO son naranjas (camino más corto)
        graph.forEachEdge((edge) => {
          const currentColor = graph.getEdgeAttribute(edge, 'color');
          // Solo actualizar si no es el color naranja del camino
          if (currentColor !== pathEdgeColor) {
            graph.setEdgeAttribute(edge, 'color', edgeColor);
          }
        });

        sigmaRef.current.refresh();
      }
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      themeObserver.disconnect();
    };
  }, [sigmaRef]);
};