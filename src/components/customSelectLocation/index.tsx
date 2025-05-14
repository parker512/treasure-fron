import { ChevronDown, ChevronUp } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";

interface Location {
  id: number;
  name: string;
}

interface Props {
  isState?: boolean;
  locations: Location[];
  placeholder?: string;
  disabled?: boolean;
  selectedLocation?: string;
  onSelect?: any;
}

export const CustomSelectLocation: FC<Props> = ({
  isState = true,
  locations,
  placeholder = "Select an option",
  disabled = false,
  selectedLocation,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (location: Location) => {
    if (onSelect) {
      if (isState) {
        onSelect({ stateId: location.id, stateName: location.name });
      } else {
        onSelect({ cityId: location.id, cityName: location.name });
      }
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="relative min-w-48" ref={dropdownRef}>
      <div
        className={`flex items-center justify-between p-2 border rounded-md bg-white cursor-pointer ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "hover:bg-gray-50"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        role="combobox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
      >
        <span className={selectedLocation ? "text-gray-700" : "text-gray-400"}>
          {selectedLocation || placeholder}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-10">
          <div className="px-3 py-2 border-b">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={disabled}
              aria-label="Search locations"
            />
          </div>
          <div className="overflow-y-auto">
            {filteredLocations.length === 0 ? (
              <div className="px-4 py-2 text-gray-500 text-sm">No results</div>
            ) : (
              filteredLocations.map((location) => (
                <div
                  key={location.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                  onClick={() => handleSelect(location)}
                  role="option"
                  aria-selected={selectedLocation === location.name}
                >
                  {location.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
