import React from 'react';

const PokemonCard = React.memo(({ pokemon, onClick }) => {
  return (
    <div
      className="group bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer 
      hover:shadow-xl transition-all duration-300 hover:scale-105 relative 
      border border-gray-700 hover:border-gray-600"
      onClick={() => onClick(pokemon)}
    >
      {/* Pokemon ID Badge */}
      <div className="absolute top-3 left-3 bg-gray-700/50 backdrop-blur-sm 
        px-2 py-1 rounded-lg text-xs font-mono text-gray-300">
        #{pokemon.id.toString().padStart(3, '0')}
      </div>

      {/* Pokemon Image Container */}
      <div className="relative w-32 h-32 mx-auto mb-4 group-hover:scale-110 
        transition-transform duration-300">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-full h-full object-contain drop-shadow-lg"
          loading="lazy"
        />
      </div>

      {/* Pokemon Name */}
      <h3 className="text-lg font-bold capitalize text-center text-white mb-3 
        tracking-wide">
        {pokemon.name}
      </h3>

      {/* Pokemon Types */}
      <div className="flex justify-center gap-2">
        {pokemon.types.map((type) => (
          <span
            key={type.type.name}
            className="px-3 py-1 bg-gray-700/50 backdrop-blur-sm rounded-full 
            text-sm capitalize text-gray-200 font-medium border border-gray-600/50
            shadow-sm"
          >
            {type.type.name}
          </span>
        ))}
      </div>
    </div>
  );
});

PokemonCard.displayName = 'PokemonCard';

export default PokemonCard;