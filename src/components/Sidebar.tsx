import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';

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

  const filteredCities = cities.filter((city) =>
    city.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCityClick = (city: City) => {
    onCityClick?.(city);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800/90 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-gray-700 transition-all"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800/95 backdrop-blur-md text-white z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-80 md:w-96 shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 pt-16 border-b border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Cities</h2>
            
            {/* Stats Card integrada */}
            <div className="bg-gray-700/50 backdrop-blur-sm px-4 py-3 rounded-lg border border-gray-600/50 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <div className="text-sm">
                  <span className="font-semibold text-gray-300">Nodes:</span>{' '}
                  <span className="font-mono text-green-400">{nodeCount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="text-sm">
                  <span className="font-semibold text-gray-300">Edges:</span>{' '}
                  <span className="font-mono text-blue-400">{edgeCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* City List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredCities.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No cities found</p>
            ) : (
              <ul className="space-y-2">
                {filteredCities.map((city) => (
                  <li
                    key={city.id}
                    onClick={() => handleCityClick(city)}
                    className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="font-semibold">{city.city}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
