import { useState, useEffect } from 'react';
import axios from 'axios';

export function usePokemon() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const pokemonResponse = await axios.get(
          'https://pokeapi.co/api/v2/pokemon?limit=151'
        );
        const pokemonDetails = await Promise.all(
          pokemonResponse.data.results.map(async (poke) => {
            const res = await axios.get(poke.url);
            return res.data;
          })
        );
        setAllPokemon(pokemonDetails);

        if (types.length === 0) {
          const typeResponse = await axios.get('https://pokeapi.co/api/v2/type');
          const standardTypes = typeResponse.data.results
            .filter((t) => !['unknown', 'shadow'].includes(t.name))
            .map((t) => t.name);
          setTypes(standardTypes);
        }
      } catch (err) {
        setError('Failed to fetch Pokémon data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  return { allPokemon, types, loading, error };
}