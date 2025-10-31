import { useState, useMemo, useCallback, useEffect } from 'react';
import { Menu, Search } from 'lucide-react';
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
  onCityClick?: (city: City) => void;
}

export const Sidebar = ({ cities, nodeCount, edgeCount, onCityClick }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

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

  const filteredCities = useMemo(() => {
    if (!debouncedSearchTerm) return cities.slice(0, 100); // Limit initial display
    const filtered = cities.filter((city) =>
      city.city.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    return filtered.slice(0, 500); // Limit search results
  }, [cities, debouncedSearchTerm]);

  const handleCityClick = useCallback((city: City) => {
    onCityClick?.(city);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [onCityClick]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
            <SheetTitle className="text-2xl font-bold">Cities</SheetTitle>
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

          {/* Search */}
          <div className="px-6 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search cities..."
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
          <div className="flex-1 px-6 pb-6 overflow-hidden">
            <ScrollArea className="h-[calc(100vh-280px)] w-full">
              {filteredCities.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {debouncedSearchTerm ? 'No cities found' : 'Loading cities...'}
                </p>
              ) : (
                <div className="space-y-2 pr-4">
                  {debouncedSearchTerm && filteredCities.length >= 500 && (
                    <p className="text-destructive text-sm text-center py-2">
                      Showing first 500 results. Refine your search for better results.
                    </p>
                  )}
                  {filteredCities.map((city) => (
                    <div
                      key={city.id}
                      className="p-3 bg-muted border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => handleCityClick(city)}
                    >
                      <div className="font-semibold">{city.city}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                      </div>
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
