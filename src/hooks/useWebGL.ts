import { useEffect, useState } from 'react';

export const useWebGL = () => {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
      } catch {
        return false;
      }
    };

    setWebglSupported(checkWebGL());
  }, []);

  return webglSupported;
};
