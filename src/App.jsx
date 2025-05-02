import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PokemonProvider } from './contexts/PokemonContext';
import ErrorBoundary from './hooks/ErrorBoundary';
import Home from './pages/Home';
import PokemonDetailPage from './pages/PokemonDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ComparisonPage from './pages/ComparisonPage';

function App() {
  return (
    <PokemonProvider>
      <Router>
        <div className="dark min-h-screen bg-gray-900 text-white">
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary>
                  <Home setSelectedPokemon={() => {}} selectedPokemon={null} />
                </ErrorBoundary>
              }
            />
            <Route
              path="/pokemon/:id"
              element={
                <ErrorBoundary>
                  <PokemonDetailPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/favorites"
              element={
                <ErrorBoundary>
                  <FavoritesPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/compare"
              element={
                <ErrorBoundary>
                  <ComparisonPage />
                </ErrorBoundary>
              }
            />
          </Routes>
        </div>
      </Router>
    </PokemonProvider>
  );
}

export default App;