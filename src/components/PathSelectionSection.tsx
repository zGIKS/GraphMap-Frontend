import { Navigation, Target, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface City {
  id: number;
  city: string;
  lat: number;
  lng: number;
}

interface PathSelectionSectionProps {
  startNode: City | null;
  endNode: City | null;
  onStartNodeChange: (node: City | null) => void;
  onEndNodeChange: (node: City | null) => void;
  onFindPath: () => void;
  onClearPath: () => void;
}

export const PathSelectionSection = ({
  startNode,
  endNode,
  onStartNodeChange,
  onEndNodeChange,
  onFindPath,
  onClearPath
}: PathSelectionSectionProps) => {
  return (
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
          <Button variant="ghost" size="icon-sm" onClick={() => onStartNodeChange(null)}>
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
          <Button variant="ghost" size="icon-sm" onClick={() => onEndNodeChange(null)}>
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          className="flex-1"
          onClick={onFindPath}
          size="sm"
          disabled={!startNode || !endNode}
        >
          Find Path
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearPath}
          disabled={!startNode && !endNode}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};