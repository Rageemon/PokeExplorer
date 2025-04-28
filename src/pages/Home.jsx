import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import TypeFilter from '../components/TypeFilter.jsx';
import PokemonCard from '../components/PokemonCard.jsx';
import Pagination from '../components/Pagination.jsx';
import PokemonDetails from '../components/PokemonDetails.jsx';
import { usePokemon } from '../hooks/usePokemon';

function Home({ setSelectedPokemon, selectedPokemon }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterMode, setFilterMode] = useState('or');
  const itemsPerPage = 20;

  const { allPokemon, types, loading, error } = usePokemon();

  // Filter pokemon based on search and type
  const filteredPokemon = allPokemon.filter((pokemon) => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length
      ? filterMode === 'and'
        ? selectedTypes.every((type) => pokemon.types.some((t) => t.type.name === type))
        : selectedTypes.some((type) => pokemon.types.some((t) => t.type.name === type))
      : true;
    return matchesSearch && matchesType;
  });

  // Calculate total pages based on filtered results
  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);

  // Get current page items
  const currentPokemon = filteredPokemon.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTypes, filterMode]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-white">PokeExplorer</h1>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar setSearchTerm={setSearchTerm} />
          <TypeFilter
            types={types}
            setSelectedTypes={setSelectedTypes}
            selectedTypes={selectedTypes}
            filterMode={filterMode}
            setFilterMode={setFilterMode}
          />
        </div>
        {error && <div className="text-red-400 text-center">{error}</div>}
        {loading ? (
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
            {currentPokemon.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={() => setSelectedPokemon(pokemon)}
              />
            ))}
          </div>
        )}
        {filteredPokemon.length === 0 && !loading && (
          <div className="text-center text-gray-400 mt-8">
            No Pokémon found matching your criteria
          </div>
        )}
        {filteredPokemon.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
        <PokemonDetails pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />
      </main>
    </div>
  );
}

export default Home;