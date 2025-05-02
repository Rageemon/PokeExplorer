import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header.jsx';
import SearchBar from '../components/SearchBar.jsx';
import TypeFilter from '../components/TypeFilter.jsx';
import PokemonCard from '../components/PokemonCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { usePokemonContext } from '../contexts/PokemonContext.jsx';
import { HeartIcon } from '@heroicons/react/20/solid';
import SortSelect from '../components/SortSelect';
import { SORT_OPTIONS, sortPokemon } from '../features/sorting';

function Home() {
  const [currentBatch, setCurrentBatch] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.ID_ASC);
  const { 
    selectedTypes, 
    setSelectedTypes, 
    filterMode, 
    setFilterMode, 
    allPokemon, 
    types, 
    loading, 
    error, 
    favorites, 
    toggleFavorite 
  } = usePokemonContext();

  const BATCH_SIZE = 20;

  const filteredPokemon = useMemo(() => {
    const filtered = allPokemon.filter((pokemon) => {
      const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedTypes.length
        ? filterMode === 'and'
          ? selectedTypes.every((type) => pokemon.types.some((t) => t.type.name === type))
          : selectedTypes.some((type) => pokemon.types.some((t) => t.type.name === type))
        : true;
      return matchesSearch && matchesType;
    });

    return sortPokemon(filtered, sortOption);
  }, [allPokemon, searchTerm, selectedTypes, filterMode, sortOption]);

  const totalBatches = useMemo(() => {
    return Math.ceil(filteredPokemon.length / BATCH_SIZE);
  }, [filteredPokemon]);

  const currentBatchPokemon = useMemo(() => {
    const batchIndex = currentBatch - 1;
    const start = batchIndex * BATCH_SIZE;
    const end = start + BATCH_SIZE;
    return filteredPokemon.slice(start, end);
  }, [filteredPokemon, currentBatch]);

  useEffect(() => {
    if (filteredPokemon.length === 0 && currentBatch > 1) {
      setCurrentBatch(1);
    }
  }, [filteredPokemon, currentBatch]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar setSearchTerm={setSearchTerm} />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <TypeFilter
              types={types}
              setSelectedTypes={setSelectedTypes}
              selectedTypes={selectedTypes}
              filterMode={filterMode}
              setFilterMode={setFilterMode}
            />
            <SortSelect sortOption={sortOption} onSortChange={setSortOption} />
          </div>
        </div>
        {error && <div className="text-red-400 text-center">{error}</div>}
        {loading && !currentBatchPokemon.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg shadow-md p-4 animate-pulse"
              >
                <div className="w-32 h-32 mx-auto bg-gray-700 rounded-full"></div>
                <div className="mt-2 h-4 bg-gray-700 rounded w-12 mx-auto"></div>
                <div className="mt-2 h-6 bg-gray-700 rounded w-3/4 mx-auto"></div>
                <div className="mt-2 flex justify-center gap-2">
                  <div className="h-4 bg-gray-700 rounded w-12"></div>
                  <div className="h-4 bg-gray-700 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentBatchPokemon.map((pokemon) => (
              <div key={pokemon.id} className="relative">
                <PokemonCard pokemon={pokemon} linkTo={`/pokemon/${pokemon.id}`} />
                <button
                  onClick={() => toggleFavorite(pokemon.id)}
                  className="absolute top-2 right-2 p-1"
                >
                  <HeartIcon
                    className={`w-6 h-6 ${
                      favorites.includes(pokemon.id)
                        ? 'text-red-500 fill-red-500'
                        : 'text-gray-400 fill-none stroke-current stroke-2'
                    } hover:text-red-400 hover:fill-red-400 transition-colors`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
        {currentBatchPokemon.length === 0 && !loading && (
          <div className="text-center text-gray-400 mt-8">
            No Pokémon found matching your criteria
          </div>
        )}
        {filteredPokemon.length > 0 && (
          <Pagination
            currentBatch={currentBatch}
            totalBatches={totalBatches}
            onBatchChange={setCurrentBatch}
            totalPokemon={filteredPokemon.length}
          />
        )}
      </main>
    </div>
  );
}

export default Home;