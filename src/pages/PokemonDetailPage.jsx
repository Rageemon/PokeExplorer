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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md inline-block"
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
      <main className="container mx-auto p-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold capitalize">{pokemon.name}</h2>
          <span className="text-xl text-gray-300">#{pokemon.id.toString().padStart(3, '0')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Image Card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <div className="flex justify-center bg-gray-700 rounded-lg p-4 mb-4">
              <img
                src={pokemon.sprites?.front_default || '/placeholder.png'}
                alt={pokemon.name}
                className="w-48 h-48 object-contain"
              />
            </div>
            <div className="flex justify-center gap-2 mb-4">
              {pokemon.types.map((type, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm capitalize"
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Base Stats</h3>
            <div className="space-y-3">
              {pokemon.stats.map((stat, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="capitalize">
                      {stat.stat.name.replace('special-', 'Sp. ')}
                    </span>
                    <span className="font-medium">{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Abilities Card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Abilities</h3>
            <ul className="space-y-2">
              {pokemon.abilities.map((ability, index) => (
                <li 
                  key={index} 
                  className="bg-gray-700 px-3 py-2 rounded capitalize"
                >
                  {ability.ability.name.replace('-', ' ')}
                </li>
              ))}
            </ul>
          </div>

          {/* Moves Card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Moves</h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.moves.slice(0, 12).map((move, index) => (
                <span 
                  key={index}
                  className="bg-gray-700 px-3 py-1 rounded text-sm capitalize"
                >
                  {move.move.name.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Evolution Chain */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Evolution Chain</h3>
          {evolutionLoading ? (
            <p className="text-center text-gray-400 py-4">Loading evolution chain...</p>
          ) : evolutionError ? (
            <p className="text-red-400 text-center py-4">{evolutionError}</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {evolutionPokemon.map((evo, index) => (
                <Link 
                  to={`/pokemon/${evo?.id}`} 
                  key={index}
                  className="group text-center hover:scale-105 transition-transform"
                >
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <img
                      src={evo?.sprites?.front_default || '/placeholder.png'}
                      alt={evo?.name}
                      className="w-24 h-24 mx-auto mb-2 group-hover:opacity-80 transition-opacity"
                    />
                    <p className="capitalize font-medium">{evo?.name}</p>
                    <p className="text-sm text-gray-400">#{evo?.id.toString().padStart(3, '0')}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PokemonDetailPage;