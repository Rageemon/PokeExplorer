import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { usePokemonContext } from '../contexts/PokemonContext.jsx';
import { useEvolution } from '../hooks/useEvolution.js';

function PokemonDetailPage() {
  const { id } = useParams();
  const pokemonId = parseInt(id, 10);
  const { allPokemon, loading, error } = usePokemonContext();
  const { evolutionChain, loading: evolutionLoading, error: evolutionError } = useEvolution(pokemonId);

  const pokemon = useMemo(() => {
    return allPokemon.find((p) => p.id === pokemonId);
  }, [allPokemon, pokemonId]);

  // Map evolution names to Pokémon objects for images
  const evolutionPokemon = useMemo(() => {
    return evolutionChain.map((name) =>
      allPokemon.find((p) => p.name === name.toLowerCase())
    ).filter(Boolean);
  }, [evolutionChain, allPokemon]);


  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Pokémon Not Found</h1>
          <p className="mb-4">The Pokémon with ID {id} could not be found.</p>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6 capitalize">{pokemon.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image and Basic Info */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <img
              src={pokemon.sprites?.front_default || '/placeholder.png'}
              alt={pokemon.name}
              className="w-48 h-48 mx-auto mb-4"
            />
            <p className="text-center">
              <strong>ID:</strong> #{pokemon.id.toString().padStart(3, '0')}
            </p>
            <p className="text-center">
              <strong>Types:</strong>{' '}
              {pokemon.types.map((t) => t.type.name).join(', ')}
            </p>
          </div>

          {/* Stats */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Base Stats</h3>
            <ul className="space-y-2">
              <li>
                <strong>HP:</strong> {pokemon.stats[0].base_stat}
              </li>
              <li>
                <strong>Attack:</strong> {pokemon.stats[1].base_stat}
              </li>
              <li>
                <strong>Defense:</strong> {pokemon.stats[2].base_stat}
              </li>
              <li>
                <strong>Special Attack:</strong> {pokemon.stats[3].base_stat}
              </li>
              <li>
                <strong>Special Defense:</strong> {pokemon.stats[4].base_stat}
              </li>
              <li>
                <strong>Speed:</strong> {pokemon.stats[5].base_stat}
              </li>
            </ul>
          </div>

          {/* Abilities */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Abilities</h3>
            <ul className="list-disc pl-5 space-y-1">
              {pokemon.abilities.map((ability, index) => (
                <li key={index}>{ability.ability.name}</li>
              ))}
            </ul>
          </div>

          {/* Moves */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Moves</h3>
            <ul className="list-disc pl-5 space-y-1">
              {pokemon.moves.slice(0, 10).map((move, index) => (
                <li key={index}>{move.move.name}</li>
              ))}
            </ul>
          </div>

          {/* Evolution Chain */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md md:col-span-2">
            <h3 className="text-xl font-semibold mb-2">Evolution Chain</h3>
            {evolutionLoading ? (
              <p className="text-center text-gray-400">Loading evolution chain...</p>
            ) : evolutionError ? (
              <p className="text-red-400 text-center">{evolutionError}</p>
            ) : (
              <div className="flex flex-wrap gap-4 justify-center">
                {evolutionPokemon.map((evo, index) => (
                  <div key={index} className="text-center">
                    <img
                      src={evo?.sprites?.front_default || '/placeholder.png'}
                      alt={evo?.name}
                      className="w-24 h-24 mx-auto mb-2"
                    />
                    <p className="capitalize">{evo?.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PokemonDetailPage;