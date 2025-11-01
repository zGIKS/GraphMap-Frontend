import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchSectionProps {
  searchTerm: string;
  debouncedSearchTerm: string;
  onSearchChange: (value: string) => void;
}

export const SearchSection = ({
  searchTerm,
  debouncedSearchTerm,
  onSearchChange
}: SearchSectionProps) => {
  return (
    <div className="px-6 mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by coordinates or city..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
        {searchTerm !== debouncedSearchTerm && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};