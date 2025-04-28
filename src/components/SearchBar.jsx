import { useCallback } from 'react';
import { Input } from './ui/input';
import { debounce } from 'lodash';

function SearchBar({ setSearchTerm }) {
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 200),
    []
  );

  return (
    <Input
      type="text"
      placeholder="Search Pokémon..."
      onChange={(e) => debouncedSearch(e.target.value)}
      className="flex-1 bg-gray-800 text-white border-gray-700 focus:border-gray-600"
    />
  );
}

export default SearchBar;