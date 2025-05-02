import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-gray-300">
          PokeExplorer
        </Link>
        <div className="flex gap-4">
          <Link
            to="/"
            className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-lg font-medium"
          >
            Pokémon
          </Link>
          <Link
            to="/favorites"
            className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-lg font-medium"
          >
            Favorites
          </Link>
          <Link
            to="/compare"
            className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-lg font-medium"
          >
            Compare
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;