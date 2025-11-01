import { useState, useMemo, useCallback, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { StatsSection } from './StatsSection';
import { PathSelectionSection } from './PathSelectionSection';
import { SearchSection } from './SearchSection';
import { CityListSection } from './CityListSection';
import debounce from 'lodash.debounce';

interface City {
  id: number;
  city: string;
  lat: number;
  lng: number;
}

interface SidebarProps {
  cities: City[];
  nodeCount: number;
  edgeCount: number;
  onPathSearch?: (startId: number, endId: number) => void;
}

export const Sidebar = ({ cities, nodeCount, edgeCount, onPathSearch }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [startNode, setStartNode] = useState<City | null>(null);
  const [endNode, setEndNode] = useState<City | null>(null);

  // Debounce search term updates
  useEffect(() => {
    const debouncedUpdate = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    debouncedUpdate();

    return () => {
      debouncedUpdate.cancel();
    };
  }, [searchTerm]);

  // Buscar por coordenadas en lugar de nombre
  const filteredCities = useMemo(() => {
    if (!debouncedSearchTerm) return cities.slice(0, 100);

    const searchLower = debouncedSearchTerm.toLowerCase().trim();

    const filtered = cities.filter((city) => {
      // Buscar por coordenadas (lat, lng)
      const coords = `${city.lat.toFixed(4)}, ${city.lng.toFixed(4)}`;
      if (coords.includes(searchLower)) return true;

      // También permitir búsqueda por nombre de ciudad
      if (city.city.toLowerCase().includes(searchLower)) return true;

      return false;
    });

    return filtered.slice(0, 500);
  }, [cities, debouncedSearchTerm]);

  const handleSelectNode = useCallback((city: City) => {
    if (!startNode) {
      // Primer click: seleccionar nodo de inicio
      setStartNode(city);
    } else if (!endNode) {
      // Segundo click: seleccionar nodo final
      setEndNode(city);
    }
  }, [startNode, endNode]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleFindPath = useCallback(() => {
    if (startNode && endNode && onPathSearch) {
      onPathSearch(startNode.id, endNode.id);
    }
  }, [startNode, endNode, onPathSearch]);

  const handleClearPath = useCallback(() => {
    setStartNode(null);
    setEndNode(null);
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 backdrop-blur-sm"
          aria-label="Toggle menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 md:w-96 p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle className="text-2xl font-bold">Shortest Path</SheetTitle>
          </SheetHeader>

          <StatsSection nodeCount={nodeCount} edgeCount={edgeCount} />

          <PathSelectionSection
            startNode={startNode}
            endNode={endNode}
            onStartNodeChange={setStartNode}
            onEndNodeChange={setEndNode}
            onFindPath={handleFindPath}
            onClearPath={handleClearPath}
          />

          <SearchSection
            searchTerm={searchTerm}
            debouncedSearchTerm={debouncedSearchTerm}
            onSearchChange={handleSearchChange}
          />

          <CityListSection
            cities={filteredCities}
            startNode={startNode}
            endNode={endNode}
            debouncedSearchTerm={debouncedSearchTerm}
            onSelectNode={handleSelectNode}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
