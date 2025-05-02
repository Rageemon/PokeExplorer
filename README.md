PokeExplorer
A small app for my Internship Assignment.
🌟 Features
Data Integration

✅ Fetches first 151 Pokémon from PokeAPI
✅ Displays Pokémon info:
Name, ID
Sprite image
Type(s)
Stats in detail view



Advanced Search & Filtering

✅ Real-time search with debouncing
✅ Type filtering:
Multi-type selection
AND/OR logic
Reset


✅ Pagination (20 per page)

Modern UI/UX

✅ Responsive design
✅ Dark theme
✅ Interactive components
✅ Loading skeletons
✅ Route-based navigation
✅ Animations

🚀 Technical Implementation
Core Technologies

React (Hooks)
Tailwind CSS
PokeAPI
Axios
Headless UI

Development Approach
Data Fetching
Fetched 151 Pokémon via PokeAPI using Axios in usePokemonContext. Stored in React Context for global access, avoiding redundant calls. Extracted types for filtering.
React Hooks

useState, useEffect: Data fetching, state management in usePokemonContext.
useMemo: Optimized filtering in Home, FavoritesPage, ComparisonPage.
useCallback: Memoized toggleFavorite, addToComparison.
Custom Hooks: useEvolution for evolution chains, useDebounce for search.

Optimization

Global state with PokemonContext
Debounced search via useDebounce
Local pagination
React Router for navigation
React.memo on PokemonCard
Lazy-loaded images

Component Structure
Reusable components: PokemonCard, SearchBar, TypeFilter, SortSelect, Pagination, Header. Styled with Tailwind CSS for responsiveness.
Error Handling & UX
Error boundaries, loading skeletons, empty state messages.
Key Features

Functional components
React Hooks
Debounced search
Responsive grid
Error boundaries
Loading states
Edge cases

🌐 Live Demo
View Live Demo
💻 Local Development

Clone the repository:

git clone https://github.com/your-username/PokeExplorer.git


Install dependencies:

cd PokeExplorer
npm install


Start the development server:

npm run dev


Open http://localhost:5173 in your browser.

✨ Requirements Fulfilled
Core requirements addressed with attention to detail:
1. Data Fetching ✅

 151 Pokémon
 Complete info
 Efficient loading

2. Search Functionality ✅

 Real-time search
 Type filtering
 Loading states
 Empty states

3. UI/UX ✅

 Responsive
 Modern UI
 Navigation
 Loading indicators

4. Technical Requirements ✅

 Functional components
 React Hooks
 Error handling
 Loading states
 Reusable components

📝 License
MIT License - feel free to use this project for learning or personal use.
