import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

const TOTAL_POKEMON = 151; // First 151 Pokémon (Kanto)
const BATCH_SIZE = 20; // Fetch 20 Pokémon details at a time
const TOTAL_BATCHES = Math.ceil(TOTAL_POKEMON / BATCH_SIZE); // 8 batches

export function usePokemon(currentBatch = 1, searchTerm = '') {
  const [pokemonBatches, setPokemonBatches] = useState(() => {
    const saved = localStorage.getItem('pokemonBatches');
    // Only load the first batch from localStorage
    const parsed = saved ? JSON.parse(saved) : {};
    return parsed[0] ? { 0: parsed[0] } : {};
  });
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBatch = useCallback(async (batchIndex) => {
    const start = batchIndex * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, TOTAL_POKEMON);
    if (start >= TOTAL_POKEMON) return [];

    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${end - start}&offset=${start}`
      );
      const batchDetails = await Promise.allSettled(
        response.data.results.map(async (poke) => {
          try {
            const res = await axios.get(poke.url);
            return res.data;
          } catch {
            return null;
          }
        })
      );
      return batchDetails
        .filter((p) => p.status === 'fulfilled' && p.value)
        .map((p) => p.value);
    } catch (err) {
      throw new Error(`Failed to fetch Pokémon batch ${batchIndex}`);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        performance.mark('fetch-start');
        setLoading(true);
        setError(null);

        let updatedBatches = { ...pokemonBatches };

        // Fetch first batch immediately
        if (!updatedBatches[0] || updatedBatches[0].timestamp < Date.now() - 5000) {
          const firstBatch = await fetchBatch(0);
          updatedBatches[0] = { data: firstBatch, timestamp: Date.now() };
          setPokemonBatches(updatedBatches);
          // Only store the first batch in localStorage
          localStorage.setItem('pokemonBatches', JSON.stringify({ 0: updatedBatches[0] }));
        }

        // Fetch types (once)
        if (types.length === 0) {
          const typeResponse = await axios.get('https://pokeapi.co/api/v2/type');
          const standardTypes = typeResponse.data.results
            .filter((t) => !['unknown', 'shadow'].includes(t.name))
            .map((t) => t.name);
          setTypes(standardTypes);
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch initial Pokémon data');
        console.error(err);
        setLoading(false);
      } finally {
        performance.mark('fetch-end');
        performance.measure('fetch-duration', 'fetch-start', 'fetch-end');
      }
    };

    fetchData();
  }, [fetchBatch, pokemonBatches]);

  // Fetch remaining batches in the background with a delay
  useEffect(() => {
    const fetchBackgroundBatches = async () => {
      let updatedBatches = { ...pokemonBatches };

      for (let i = 1; i < TOTAL_BATCHES; i++) {
        if (!updatedBatches[i]) {
          try {
            // Add a delay to avoid rate limiting (500ms between requests)
            await new Promise((resolve) => setTimeout(resolve, 500));
            const batch = await fetchBatch(i);
            updatedBatches[i] = { data: batch, timestamp: Date.now() };
            setPokemonBatches({ ...updatedBatches });
            // Do not store these batches in localStorage
          } catch (err) {
            console.error(`Background fetch failed for batch ${i}:`, err);
          }
        }
      }
    };

    if (Object.keys(pokemonBatches).length > 0) {
      fetchBackgroundBatches();
    }
  }, [fetchBatch, pokemonBatches]);

  // Combine all batches into a single list for search
  const allPokemon = useMemo(() => {
    return Object.values(pokemonBatches)
      .flatMap((batch) => batch.data)
      .filter(Boolean);
  }, [pokemonBatches]);

  // Filter based on search term
  const filteredPokemon = useMemo(() => {
    return allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allPokemon, searchTerm]);

  // Select the current batch (adjusted for filtered Pokémon)
  const currentBatchPokemon = useMemo(() => {
    const batchIndex = currentBatch - 1;
    const start = batchIndex * BATCH_SIZE;
    const end = start + BATCH_SIZE;
    return filteredPokemon.slice(start, end);
  }, [filteredPokemon, currentBatch]);

  // Calculate total batches after filtering
  const totalFilteredBatches = useMemo(() => {
    return Math.ceil(filteredPokemon.length / BATCH_SIZE);
  }, [filteredPokemon]);

  // Memoize types to prevent re-renders
  const memoizedTypes = useMemo(() => types, [types]);

  return {
    pokemonList: currentBatchPokemon,
    totalPokemon: filteredPokemon.length,
    totalBatches: totalFilteredBatches,
    allPokemon, // For search across all
    types: memoizedTypes,
    loading,
    error,
  };
}