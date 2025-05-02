import { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header.jsx';
import { usePokemonContext } from '../contexts/PokemonContext';
import { Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import SearchBar from '../components/SearchBar.jsx';
import TypeFilter from '../components/TypeFilter.jsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

function ComparisonPage() {
  const { comparison, addToComparison, allPokemon, types, loading, error } = usePokemonContext();
  const [isPanelOpen, setIsPanelOpen] = useState({ left: false, right: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [filterMode, setFilterMode] = useState('or');
  const [visiblePokemonCount, setVisiblePokemonCount] = useState(20);
  const [activeTab, setActiveTab] = useState('stats');
  const [animateWinner, setAnimateWinner] = useState(false);

  const comparedPokemon = useMemo(() => {
    return comparison.map((poke) =>
      typeof poke === 'object' ? poke : allPokemon.find((p) => p.id === poke)
    ).filter(Boolean);
  }, [comparison, allPokemon]);

  const filteredPokemon = useMemo(() => {
    return allPokemon.filter((pokemon) => {
      const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedTypes.length
        ? filterMode === 'and'
          ? selectedTypes.every((type) => pokemon.types.some((t) => t.type.name === type))
          : selectedTypes.some((type) => pokemon.types.some((t) => t.type.name === type))
        : true;
      return matchesSearch && matchesType;
    });
  }, [allPokemon, searchTerm, selectedTypes, filterMode]);

  const visiblePokemon = useMemo(() => {
    return filteredPokemon.slice(0, visiblePokemonCount);
  }, [filteredPokemon, visiblePokemonCount]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 50 && visiblePokemonCount < filteredPokemon.length) {
      setVisiblePokemonCount((prev) => prev + 20);
    }
  };

  const selectPokemon = (pokemon, side) => {
    addToComparison(pokemon);
    setIsPanelOpen({ left: false, right: false });
  };

  const selectRandomPokemon = (side) => {
    const availablePokemon = allPokemon.filter(
      (p) => !comparedPokemon.some((cp) => cp.id === p.id)
    );
    if (availablePokemon.length > 0) {
      const randomIndex = Math.floor(Math.random() * availablePokemon.length);
      addToComparison(availablePokemon[randomIndex]);
    }
  };

  const calculateOverallScore = (pokemon) => {
    return pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
  };

  const getComparisonResult = () => {
    if (comparedPokemon.length !== 2) return { winner: null, loser: null, isDraw: false };
    const score1 = calculateOverallScore(comparedPokemon[0]);
    const score2 = calculateOverallScore(comparedPokemon[1]);
    if (score1 > score2) return { winner: comparedPokemon[0], loser: comparedPokemon[1], isDraw: false };
    if (score2 > score1) return { winner: comparedPokemon[1], loser: comparedPokemon[0], isDraw: false };
    return { winner: null, loser: null, isDraw: true };
  };

  const { winner, loser, isDraw } = getComparisonResult();

  useEffect(() => {
    if (winner) {
      setAnimateWinner(true);
      const timer = setTimeout(() => setAnimateWinner(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  const chartData = {
    labels: ['HP', 'Attack', 'Defense', 'Sp. Attack', 'Sp. Defense', 'Speed'],
    datasets: comparedPokemon.map((pokemon, index) => ({
      label: pokemon.name,
      data: pokemon.stats.map((stat) => stat.base_stat),
      backgroundColor: index === 0 ? 'rgba(54, 162, 235, 0.6)' : 'rgba(255, 99, 132, 0.6)',
      borderColor: index === 0 ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    })),
  };

  const radarData = {
    labels: ['HP', 'Attack', 'Defense', 'Sp. Attack', 'Sp. Defense', 'Speed'],
    datasets: comparedPokemon.map((pokemon, index) => ({
      label: pokemon.name,
      data: pokemon.stats.map((stat) => stat.base_stat),
      backgroundColor: index === 0 ? 'rgba(54, 162, 235, 0.2)' : 'rgba(255, 99, 132, 0.2)',
      borderColor: index === 0 ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
      pointBackgroundColor: index === 0 ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: index === 0 ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
    })),
  };

  const typeColors = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-blue-200',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-300',
    psychic: 'bg-pink-500',
    bug: 'bg-green-400',
    rock: 'bg-yellow-700',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-600',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Pokémon Comparison
        </h2>
        
        {/* Comparison Arena */}
        <div className="relative bg-gray-800 rounded-xl p-6 mb-8 shadow-lg border border-gray-700">
          {/* VS Background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-9xl font-bold opacity-10">VS</span>
          </div>
          
          <div className="relative flex flex-col md:flex-row gap-6 items-center justify-center">
            {/* Left Pokémon Slot */}
            <div className={`flex-1 transition-all duration-500 ${animateWinner && winner?.id === comparedPokemon[0]?.id ? 'scale-110' : ''}`}>
              <div
                className={`bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl shadow-lg border-2 ${
                  winner?.id === comparedPokemon[0]?.id
                    ? 'border-green-500 shadow-green-500/30'
                    : loser?.id === comparedPokemon[0]?.id
                    ? 'border-red-500 opacity-80'
                    : isDraw && comparedPokemon[0]
                    ? 'border-yellow-500'
                    : 'border-gray-600'
                } relative overflow-hidden`}
              >
                {comparedPokemon[0] ? (
                  <>
                    <div className="absolute top-2 right-2 flex gap-1">
                      {comparedPokemon[0]?.types.map((type, index) => (
                        <span 
                          key={`${type.type.name}-${index}`}
                          className={`${typeColors[type.type.name] || 'bg-gray-500'} text-xs px-2 py-1 rounded-full capitalize`}
                        >
                          {type.type.name}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <img
                        src={ comparedPokemon[0].sprites?.front_default || '/placeholder.png'}
                        alt={comparedPokemon[0].name}
                        className="w-48 h-48 object-contain hover:scale-105 transition-transform"
                      />
                      <h3 className="text-2xl font-bold capitalize text-center mb-1">
                        {comparedPokemon[0].name}
                      </h3>
                      <p className="text-gray-300 text-center mb-3">
                        #{comparedPokemon[0].id.toString().padStart(3, '0')}
                      </p>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                        <div 
                          className="bg-blue-500 h-2.5 rounded-full" 
                          style={{ width: `${(calculateOverallScore(comparedPokemon[0]) / 720) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-lg font-semibold text-blue-400">
                        Total: {calculateOverallScore(comparedPokemon[0])}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <div className="w-32 h-32 bg-gray-700 rounded-full mb-4 flex items-center justify-center">
                      <span className="text-4xl">?</span>
                    </div>
                    <p className="text-gray-400 text-lg">Select Pokémon</p>
                  </div>
                )}
                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={() => setIsPanelOpen({ left: true, right: false })}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all hover:shadow-blue-500/50"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => selectRandomPokemon('left')}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md transition-all hover:shadow-purple-500/50"
                  >
                    Random
                  </button>
                </div>
              </div>
            </div>

            {/* VS Badge */}
            <div className="relative z-10">
              <div className="bg-gradient-to-r from-red-500 to-yellow-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-xl font-bold text-white">VS</span>
              </div>
            </div>

            {/* Right Pokémon Slot */}
            <div className={`flex-1 transition-all duration-500 ${animateWinner && winner?.id === comparedPokemon[1]?.id ? 'scale-110' : ''}`}>
              <div
                className={`bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl shadow-lg border-2 ${
                  winner?.id === comparedPokemon[1]?.id
                    ? 'border-green-500 shadow-green-500/30'
                    : loser?.id === comparedPokemon[1]?.id
                    ? 'border-red-500 opacity-80'
                    : isDraw && comparedPokemon[1]
                    ? 'border-yellow-500'
                    : 'border-gray-600'
                } relative overflow-hidden`}
              >
                {comparedPokemon[1] ? (
                  <>
                    <div className="absolute top-2 right-2 flex gap-1">
                      {comparedPokemon[1].types.map((type) => (
                        <span 
                          key={type.type.name} 
                          className={`${typeColors[type.type.name] || 'bg-gray-500'} text-xs px-2 py-1 rounded-full capitalize`}
                        >
                          {type.type.name}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <img
                        src={comparedPokemon[1].sprites?.front_default || '/placeholder.png'}
                        alt={comparedPokemon[1].name}
                        className="w-48 h-48 object-contain hover:scale-105 transition-transform"
                      />
                      <h3 className="text-2xl font-bold capitalize text-center mb-1">
                        {comparedPokemon[1].name}
                      </h3>
                      <p className="text-gray-300 text-center mb-3">
                        #{comparedPokemon[1].id.toString().padStart(3, '0')}
                      </p>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                        <div 
                          className="bg-red-500 h-2.5 rounded-full" 
                          style={{ width: `${(calculateOverallScore(comparedPokemon[1]) / 720) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-lg font-semibold text-red-400">
                        Total: {calculateOverallScore(comparedPokemon[1])}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <div className="w-32 h-32 bg-gray-700 rounded-full mb-4 flex items-center justify-center">
                      <span className="text-4xl">?</span>
                    </div>
                    <p className="text-gray-400 text-lg">Select Pokémon</p>
                  </div>
                )}
                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={() => setIsPanelOpen({ left: false, right: true })}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all hover:shadow-blue-500/50"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => selectRandomPokemon('right')}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md transition-all hover:shadow-purple-500/50"
                  >
                    Random
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Result Banner */}
          {comparedPokemon.length === 2 && (
            <div className={`mt-6 p-4 rounded-lg text-center transition-all duration-700 ${animateWinner ? 'scale-105' : ''}`}>
              {isDraw ? (
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold text-white">It's a Draw!</h3>
                  <p className="text-yellow-100">Both Pokémon are equally strong!</p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold text-white">
                    <span className="capitalize">{winner?.name}</span> Wins!
                  </h3>
                  <p className="text-white/90">
                    Defeated <span className="capitalize">{loser?.name}</span> by {winner && loser ? Math.abs(calculateOverallScore(winner) - calculateOverallScore(loser)) : 0} points!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comparison Charts */}
        {comparedPokemon.length === 2 && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    activeTab === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Bar Chart
                </button>
                <button
                  onClick={() => setActiveTab('radar')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                    activeTab === 'radar' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Radar Chart
                </button>
              </div>
            </div>

            <div className="h-96">
              {activeTab === 'stats' ? (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          color: '#fff',
                          font: {
                            size: 14
                          }
                        }
                      },
                      title: {
                        display: true,
                        text: 'Base Stats Comparison',
                        color: '#fff',
                        font: {
                          size: 18
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff'
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          color: '#fff'
                        },
                        grid: {
                          color: 'rgba(255,255,255,0.1)'
                        }
                      },
                      x: {
                        ticks: {
                          color: '#fff'
                        },
                        grid: {
                          color: 'rgba(255,255,255,0.1)'
                        }
                      }
                    }
                  }}
                />
              ) : (
                <Radar
                  data={radarData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          color: '#fff',
                          font: {
                            size: 14
                          }
                        }
                      },
                      title: {
                        display: true,
                        text: 'Stats Radar Comparison',
                        color: '#fff',
                        font: {
                          size: 18
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff'
                      }
                    },
                    scales: {
                      r: {
                        angleLines: {
                          color: 'rgba(255,255,255,0.2)'
                        },
                        grid: {
                          color: 'rgba(255,255,255,0.2)'
                        },
                        pointLabels: {
                          color: '#fff'
                        },
                        ticks: {
                          backdropColor: 'transparent',
                          color: '#fff'
                        }
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Selection Panel */}
        {(isPanelOpen.left || isPanelOpen.right) && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Select a Pokémon
                </h3>
                <button
                  onClick={() => setIsPanelOpen({ left: false, right: false })}
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <SearchBar setSearchTerm={setSearchTerm} />
                </div>
                <div className="flex-1">
                  <TypeFilter
                    types={types}
                    setSelectedTypes={setSelectedTypes}
                    selectedTypes={selectedTypes}
                    filterMode={filterMode}
                    setFilterMode={setFilterMode}
                  />
                </div>
              </div>
              
              <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-2"
                onScroll={handleScroll}
              >
                {visiblePokemon.map((pokemon) => (
                  <div
                    key={pokemon.id}
                    onClick={() => selectPokemon(pokemon, isPanelOpen.left ? 'left' : 'right')}
                    className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 cursor-pointer transition-all hover:scale-105 hover:shadow-lg group"
                  >
                    <div className="relative">
                      <img
                        src={pokemon.sprites?.front_default || '/placeholder.png'}
                        alt={pokemon.name}
                        className="w-full h-24 object-contain mx-auto"
                      />
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {pokemon.types.map((type) => (
                          <span 
                            key={type.type.name} 
                            className={`${typeColors[type.type.name] || 'bg-gray-500'} text-xs px-2 py-0.5 rounded-full capitalize`}
                          >
                            {type.type.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-center capitalize font-medium mt-2">{pokemon.name}</p>
                    <p className="text-center text-sm text-gray-300">
                      #{pokemon.id.toString().padStart(3, '0')}
                    </p>
                  </div>
                ))}
              </div>
              
              {filteredPokemon.length > visiblePokemonCount && (
                <div className="text-center mt-4 text-gray-400">
                  Scroll down to load more Pokémon...
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ComparisonPage;