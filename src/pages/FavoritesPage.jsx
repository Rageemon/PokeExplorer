import { useState, useMemo, useEffect } from 'react';
import PokemonCard from '../components/PokemonCard.jsx';
import Pagination from '../components/Pagination.jsx';
import SearchBar from '../components/SearchBar.jsx';
import TypeFilter from '../components/TypeFilter.jsx';
import SortSelect from '../components/SortSelect.jsx';
import Header from '../components/Header.jsx';
import { usePokemonContext } from '../contexts/PokemonContext.jsx';
import { SORT_OPTIONS, sortPokemon } from '../features/sorting.js';
import { HeartIcon } from '@heroicons/react/20/solid';

function FavoritesPage() {
  const [currentBatch, setCurrentBatch] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [filterMode, setFilterMode] = useState('or');
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.ID_ASC);

  const { allPokemon, loading, error, types, favorites, toggleFavorite } = usePokemonContext();

  const BATCH_SIZE = 20;

  const filteredFavorites = useMemo(() => {
    const favoritePokemon = allPokemon.filter((pokemon) => 
      favorites.includes(pokemon.id)
    );

    const filtered = favoritePokemon.filter((pokemon) => {
      const matchesSearch = pokemon.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchesType = selectedTypes.length
        ? filterMode === 'and'
          ? selectedTypes.every((type) =>
              pokemon.types.some((t) => t.type.name === type)
            )
          : selectedTypes.some((type) =>
              pokemon.types.some((t) => t.type.name === type)
            )
        : true;
      
      return matchesSearch && matchesType;
    });

    return sortPokemon(filtered, sortOption);
  }, [allPokemon, favorites, searchTerm, selectedTypes, filterMode, sortOption]);

  const totalFavoritesBatches = useMemo(() => {
    return Math.ceil(filteredFavorites.length / BATCH_SIZE);
  }, [filteredFavorites]);

  const currentFavorites = useMemo(() => {
    const batchIndex = currentBatch - 1;
    const start = batchIndex * BATCH_SIZE;
    const end = start + BATCH_SIZE;
    return filteredFavorites.slice(start, end);
  }, [filteredFavorites, currentBatch]);

  // Reset currentBatch if filteredFavorites is empty
  useEffect(() => {
    if (filteredFavorites.length === 0 && currentBatch > 1) {
      setCurrentBatch(1);
    }
  }, [filteredFavorites, currentBatch]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Favorite Pokémon</h2>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar 
              setSearchTerm={setSearchTerm}
              placeholder="Search favorites..."
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <TypeFilter
              types={types}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              filterMode={filterMode}
              setFilterMode={setFilterMode}
            />
            <SortSelect 
              sortOption={sortOption} 
              onSortChange={setSortOption}
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-red-400 text-center mb-4">{error}</div>
        )}

        {/* Loading State */}
        {loading && !currentFavorites.length ? (
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
            {currentFavorites.map((pokemon) => (
              <div key={pokemon.id} className="relative">
                <PokemonCard
                  pokemon={pokemon}
                  linkTo={`/pokemon/${pokemon.id}`}
                />
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

        {/* Empty State */}
        {filteredFavorites.length === 0 && !loading && (
          <div className="text-center text-gray-400 mt-8">
            {favorites.length === 0 
              ? "No favorite Pokémon yet. Add some from the Pokémon list!"
              : "No Pokémon match your current filters."}
          </div>
        )}

        {/* Pagination */}
        {filteredFavorites.length > 0 && (
          <Pagination
            currentBatch={currentBatch}
            totalBatches={totalFavoritesBatches}
            onBatchChange={setCurrentBatch}
            totalPokemon={filteredFavorites.length}
          />
        )}
      </main>
    </div>
  );
}

export default FavoritesPage;