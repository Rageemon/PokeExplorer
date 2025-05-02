import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard.jsx';
import Pagination from '../components/Pagination.jsx';
import PokemonDetails from '../components/PokemonDetails.jsx';
import { usePokemon } from '../hooks/usePokemon.js';
import { usePokemonContext } from '../contexts/PokemonContext.jsx';

function FavoritesPage() {
  const [currentBatch, setCurrentBatch] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const { favorites } = usePokemonContext();
  const { allPokemon, loading, error } = usePokemon(currentBatch);

  const favoritePokemon = useMemo(() => {
    return allPokemon.filter((pokemon) => favorites.includes(pokemon.id));
  }, [allPokemon, favorites]);

  // Adjust current batch to account for filtered favorites
  const totalFavoritesBatches = Math.ceil(favoritePokemon.length / 20);
  const currentFavorites = useMemo(() => {
    const batchIndex = currentBatch - 1;
    const start = batchIndex * 20;
    const end = start + 20;
    return favoritePokemon.slice(start, end);
  }, [favoritePokemon, currentBatch]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white hover:text-gray-300">
            PokeExplorer
          </Link>
          <div className="flex gap-4">
            <Link
              to="/"
              className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-lg font-medium"
            >
              Pokémon
            </Link>
            <Link
              to="/favorites"
              className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-lg font-medium"
            >
              Favorites
            </Link>
            <Link
              to="/compare"
              className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-lg font-medium"
            >
              Compare
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Favorite Pokémon</h2>
        {error && <div className="text-red-400 text-center">{error}</div>}
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
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={() => setSelectedPokemon(pokemon)}
              />
            ))}
          </div>
        )}
        {favoritePokemon.length === 0 && !loading && (
          <div className="text-center text-gray-400 mt-8">
            No favorite Pokémon yet. Add some from the Pokémon list!
          </div>
        )}
        {favoritePokemon.length > 0 && (
          <Pagination
            currentBatch={currentBatch}
            totalBatches={totalFavoritesBatches}
            onBatchChange={setCurrentBatch}
            totalPokemon={favoritePokemon.length}
          />
        )}
        <PokemonDetails pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />
      </main>
    </div>
  );
}

export default FavoritesPage;