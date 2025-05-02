import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';

const TOTAL_POKEMON = 151; // First 151 Pokémon (Kanto)
const BATCH_SIZE = 20; // Fetch 20 Pokémon details at a time
const TOTAL_BATCHES = Math.ceil(TOTAL_POKEMON / BATCH_SIZE); // 8 batches

const PokemonContext = createContext();

export function PokemonProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [comparison, setComparison] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [filterMode, setFilterMode] = useState('or');

  // Integrated usePokemon logic
  const [pokemonBatches, setPokemonBatches] = useState(() => {
    const saved = localStorage.getItem('pokemonBatches');
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

  useEffect(() => {
    const fetchBackgroundBatches = async () => {
      let updatedBatches = { ...pokemonBatches };

      for (let i = 1; i < TOTAL_BATCHES; i++) {
        if (!updatedBatches[i]) {
          try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const batch = await fetchBatch(i);
            updatedBatches[i] = { data: batch, timestamp: Date.now() };
            setPokemonBatches({ ...updatedBatches });
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

  const allPokemon = useMemo(() => {
    return Object.values(pokemonBatches)
      .flatMap((batch) => batch.data)
      .filter(Boolean);
  }, [pokemonBatches]);

  const memoizedTypes = useMemo(() => types, [types]);

  const toggleFavorite = useCallback((pokemonId) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(pokemonId)
        ? prev.filter((id) => id !== pokemonId)
        : [...prev, pokemonId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const addToComparison = useCallback((pokemon) => {
    setComparison((prev) => {
      if (prev.length >= 2) return [prev[1], pokemon]; // Keep only 2 Pokémon
      if (prev.some((p) => p.id === pokemon.id)) return prev;
      return [...prev, pokemon];
    });
  }, []);

  const removeFromComparison = useCallback((pokemonId) => {
    setComparison((prev) => prev.filter((p) => p.id !== pokemonId));
  }, []);

  const clearComparison = useCallback(() => {
    setComparison([]);
  }, []);

  return (
    <PokemonContext.Provider
      value={{
        favorites,
        toggleFavorite,
        comparison,
        addToComparison,
        removeFromComparison,
        clearComparison,
        selectedTypes,
        setSelectedTypes,
        filterMode,
        setFilterMode,
        allPokemon,
        types: memoizedTypes,
        loading,
        error,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemonContext() {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error('usePokemonContext must be used within a PokemonProvider');
  }
  return context;
}