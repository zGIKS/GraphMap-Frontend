import { Navigation, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface City {
  id: number;
  city: string;
  lat: number;
  lng: number;
}

interface CityListSectionProps {
  cities: City[];
  startNode: City | null;
  endNode: City | null;
  debouncedSearchTerm: string;
  onSelectNode: (city: City) => void;
}

export const CityListSection = ({
  cities,
  startNode,
  endNode,
  debouncedSearchTerm,
  onSelectNode
}: CityListSectionProps) => {
  return (
    <div className="flex-1 px-6 pb-6 min-h-0">
      <ScrollArea className="h-full w-full">
        {cities.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 text-xs">
            {debouncedSearchTerm ? 'No nodes found' : 'Loading nodes...'}
          </p>
        ) : (
          <div className="space-y-2 pr-4">
            {cities.map((city) => (
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
                  onClick={() => onSelectNode(city)}
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
  );
};