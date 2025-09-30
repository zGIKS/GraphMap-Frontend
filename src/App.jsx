import { ErrorBoundary } from './presentation/components/ErrorBoundary';
import { MapPage } from './presentation/pages/MapPage';

function App() {
  return (
    <ErrorBoundary>
      <MapPage />
    </ErrorBoundary>
  );
}

export default App;
