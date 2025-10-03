interface ErrorOverlayProps {
  error: string;
  webglSupported: boolean;
}

export const ErrorOverlay = ({ error, webglSupported }: ErrorOverlayProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 z-10">
      <div className="bg-red-900 text-white p-6 rounded-lg shadow-xl max-w-2xl">
        <h2 className="text-xl font-bold mb-2">⚠️ Error Loading Graph</h2>
        <p className="mb-4">{error}</p>

        {!webglSupported && (
          <div className="bg-red-800 p-4 rounded mt-4 text-sm">
            <p className="font-semibold mb-2">How to enable WebGL:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-200">
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
          </div>
        )}

        {webglSupported && (
          <p className="mt-4 text-sm text-gray-300">
            Make sure the backend is running at http://127.0.0.1:8000
          </p>
        )}
      </div>
    </div>
  );
};
