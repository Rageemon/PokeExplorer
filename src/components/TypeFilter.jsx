import { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

function TypeFilter({ types, setSelectedTypes, selectedTypes, filterMode, setFilterMode }) {
  const handleClearFilters = () => {
    setSelectedTypes([]);
    setFilterMode('or');
  };

  return (
    <div className="w-[180px] space-y-2">
      <Listbox
        value={selectedTypes}
        onChange={setSelectedTypes}
        multiple
      >
        <div className="relative">
          <Listbox.Button className="w-full bg-gray-800 text-white border-gray-700 focus:border-gray-600 rounded-md px-3 py-2 flex justify-between items-center">
            <span className="truncate">
              {selectedTypes.length === 0
                ? 'All Types'
                : selectedTypes.map((type) => type.charAt(0).toUpperCase() + type.slice(1)).join(', ')}
            </span>
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-full bg-gray-800 border-gray-700 rounded-md shadow-lg overflow-hidden z-10">
            <div className="max-h-60 overflow-auto">
              {/* Match All Types Switch */}
              <div className="sticky top-0 flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <Label 
                  htmlFor="filter-mode" 
                  className="text-sm font-medium text-white"
                >
                  Match All Types
                </Label>
                <Switch
                  id="filter-mode"
                  checked={filterMode === 'and'}
                  onCheckedChange={(checked) => setFilterMode(checked ? 'and' : 'or')}
                />
              </div>
              
              {/* Type options */}
              {types.map((type) => (
                <Listbox.Option
                  key={type}
                  value={type}
                  className={({ active }) =>
                    `cursor-pointer select-none py-2 px-4 capitalize text-white ${
                      active ? 'bg-gray-700' : ''
                    }`
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center">
                      {selected && <CheckIcon className="w-5 h-5 mr-2 text-gray-400" />}
                      <span>{type}</span>
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </div>

            {/* Sticky Clear Filters Button */}
            {selectedTypes.length > 0 && (
              <div className="sticky bottom-0 border-t border-gray-700 bg-gray-800">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClearFilters();
                  }}
                  className="flex items-center justify-center w-full py-2 px-4 text-sm text-red-400 hover:bg-gray-700/50 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4 mr-2" />
                  Clear Filters
                </button>
              </div>
            )}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}

export default TypeFilter;