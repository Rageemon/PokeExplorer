import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home.jsx';

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white dark">
      <Home setSelectedPokemon={setSelectedPokemon} selectedPokemon={selectedPokemon} />
    </div>
  );
}

export default App;