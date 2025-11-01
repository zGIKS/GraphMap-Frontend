import { useState, useMemo, useCallback, useEffect } from 'react';
import { Menu, Search, Navigation, Target, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
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

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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

          {/* Stats Card */}
          <div className="px-6 mb-4">
            <Card className="py-3">
              <CardContent className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  <div className="text-xs">
                    <span className="font-medium text-muted-foreground">Nodes:</span>{' '}
                    <span className="font-mono text-foreground font-semibold">{nodeCount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                  <div className="text-xs">
                    <span className="font-medium text-muted-foreground">Edges:</span>{' '}
                    <span className="font-mono text-foreground font-semibold">{edgeCount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Nodes */}
          <div className="px-6 mb-4 space-y-2">
            {/* Start Node - Siempre visible */}
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg border border-border min-h-[52px]">
              <Navigation className="h-3 w-3 text-primary" />
              <div className="flex-1 min-w-0">
                {startNode ? (
                  <>
                    <div className="text-xs font-medium truncate">{startNode.city}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {startNode.lat.toFixed(4)}, {startNode.lng.toFixed(4)}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-muted-foreground">Start node</div>
                )}
              </div>
              {startNode && (
                <Button variant="ghost" size="icon-sm" onClick={() => setStartNode(null)}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* End Node - Siempre visible */}
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg border border-border min-h-[52px]">
              <Target className="h-3 w-3 text-primary" />
              <div className="flex-1 min-w-0">
                {endNode ? (
                  <>
                    <div className="text-xs font-medium truncate">{endNode.city}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {endNode.lat.toFixed(4)}, {endNode.lng.toFixed(4)}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-muted-foreground">End node</div>
                )}
              </div>
              {endNode && (
                <Button variant="ghost" size="icon-sm" onClick={() => setEndNode(null)}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleFindPath}
                size="sm"
                disabled={!startNode || !endNode}
              >
                Find Path
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearPath}
                disabled={!startNode && !endNode}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="px-6 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by coordinates or city..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
              {searchTerm !== debouncedSearchTerm && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* City List */}
          <div className="flex-1 px-6 pb-6 min-h-0">
            <ScrollArea className="h-full w-full">
              {filteredCities.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 text-xs">
                  {debouncedSearchTerm ? 'No nodes found' : 'Loading nodes...'}
                </p>
              ) : (
                <div className="space-y-2 pr-4">
                  {filteredCities.map((city) => (
                    <div
                      key={city.id}
                      className="p-2 bg-muted border border-border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="font-semibold text-xs">{city.city}</div>
                      <div className="text-[10px] text-muted-foreground mb-2">
                        {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectNode(city)}
                        className="w-full h-6 text-[10px]"
                        disabled={startNode?.id === city.id || endNode?.id === city.id}
                      >
                        {!startNode ? (
                          <>
                            <Navigation className="h-3 w-3 mr-1" />
                            Select Start
                          </>
                        ) : !endNode ? (
                          <>
                            <Target className="h-3 w-3 mr-1" />
                            Select End
                          </>
                        ) : (
                          'Selected'
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
