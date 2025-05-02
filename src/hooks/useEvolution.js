import { useState, useEffect } from 'react';
import axios from 'axios';

export function useEvolution(pokemonId) {
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
        const chain = response.data.evolution_chain.url;
        const chainResponse = await axios.get(chain);
        const evolutions = [chainResponse.data.chain.species.name];
        let current = chainResponse.data.chain.evolves_to;
        while (current.length > 0) {
          evolutions.push(current[0].species.name);
          current = current[0].evolves_to;
        }
        setEvolutionChain(evolutions);
      } catch (err) {
        setError('Failed to fetch evolution chain');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (pokemonId) {
      fetchEvolutionChain();
    }
  }, [pokemonId]);

  return { evolutionChain, loading, error };
}