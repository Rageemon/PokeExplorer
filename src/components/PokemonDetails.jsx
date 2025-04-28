import { Button } from './ui/button';
import { useEffect } from 'react';

function PokemonDetails({ pokemon, onClose }) {
  useEffect(() => {
    if (pokemon) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [pokemon]);

  if (!pokemon) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-gray-800 rounded-lg p-6 max-w-md w-full text-white shadow-xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            className="hover:bg-gray-700 rounded-full p-2 h-auto"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </Button>
        </div>

        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-48 h-48 mx-auto"
        />
        <h2 className="text-2xl font-bold capitalize text-center mb-4">
          {pokemon.name} #{pokemon.id.toString().padStart(3, '0')}
        </h2>
        
        <div className="space-y-2">
          <p className="flex justify-between">
            <strong>Height:</strong> <span>{pokemon.height / 10} m</span>
          </p>
          <p className="flex justify-between">
            <strong>Weight:</strong> <span>{pokemon.weight / 10} kg</span>
          </p>
          <p className="flex justify-between">
            <strong>Types:</strong> 
            <span className="capitalize">{pokemon.types.map(t => t.type.name).join(', ')}</span>
          </p>
          <p className="flex justify-between">
            <strong>Abilities:</strong> 
            <span className="capitalize">{pokemon.abilities.map(a => a.ability.name).join(', ')}</span>
          </p>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Base Stats:</h3>
          <div className="space-y-2">
            {pokemon.stats.map((stat) => (
              <div key={stat.stat.name} className="flex justify-between items-center">
                <strong className="capitalize">{stat.stat.name}:</strong>
                <div className="flex items-center gap-2">
                  <span>{stat.base_stat}</span>
                  <div className="w-32 h-2 bg-gray-700 rounded-full">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetails;