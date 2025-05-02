import { Link } from 'react-router-dom';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';

function Header() {
  const [isSoundOn, setIsSoundOn] = useState(false);

  const toggleSound = () => {
    setIsSoundOn((prev) => !prev);
    // Placeholder for sound logic
    // if (isSoundOn) {
    //   // Pause sound (e.g., Pokémon theme)
    // } else {
    //   // Play sound (e.g., Pokémon theme)
    // }
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 shadow-md animate-gradient">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/512px-Pok%C3%A9_Ball_icon.svg.png"
            alt="PokeExplorer Logo"
            className="h-10 w-10 mr-2"
          />
          <span className="text-2xl font-bold text-white hidden md:block">PokeExplorer</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex gap-4">
            <Link
              to="/"
              className="text-white px-3 py-2 rounded-md text-lg font-medium relative group"
            >
              Pokémon
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/favorites"
              className="text-white px-3 py-2 rounded-md text-lg font-medium relative group"
            >
              Favorites
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/compare"
              className="text-white px-3 py-2 rounded-md text-lg font-medium relative group"
            >
              Compare
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;