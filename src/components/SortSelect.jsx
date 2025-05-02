import { SORT_OPTIONS } from '../features/sorting';

function SortSelect({ sortOption, onSortChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium text-gray-300">
        Sort by:
      </label>
      <select
        id="sort"
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value)}
        className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value={SORT_OPTIONS.ID_ASC}>ID (Low to High)</option>
        <option value={SORT_OPTIONS.ID_DESC}>ID (High to Low)</option>
        <option value={SORT_OPTIONS.NAME_ASC}>Name (A-Z)</option>
        <option value={SORT_OPTIONS.NAME_DESC}>Name (Z-A)</option>
      </select>
    </div>
  );
}

export default SortSelect;