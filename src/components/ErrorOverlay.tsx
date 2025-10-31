import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorOverlayProps {
  error: string;
  webglSupported: boolean;
}

export const ErrorOverlay = ({ error, webglSupported }: ErrorOverlayProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-10 p-4">
      <div className="max-w-2xl w-full">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Graph</AlertTitle>
          <AlertDescription className="mt-2">{error}</AlertDescription>
        </Alert>

        {!webglSupported && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>How to enable WebGL</AlertTitle>
            <AlertDescription className="mt-2">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  <strong>Firefox:</strong> Go to <code>about:config</code>, search for{' '}
                  <code>webgl.disabled</code> and set it to <code>false</code>
                </li>
                <li>
                  <strong>Chrome:</strong> Go to <code>chrome://settings</code> → System →
                  Enable "Use hardware acceleration when available"
                </li>
                <li>
                  <strong>Edge:</strong> Similar to Chrome, enable hardware acceleration in
                  settings
                </li>
                <li>Try a different browser (Chrome, Firefox, Edge)</li>
                <li>Update your graphics drivers</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {webglSupported && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please contact mtteoo on Discord for further assistance.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};
