export const SORT_OPTIONS = {
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
  ID_ASC: 'id-asc',
  ID_DESC: 'id-desc'
};

export const sortPokemon = (pokemon, sortOption) => {
  const pokemonList = [...pokemon];

  switch (sortOption) {
    case SORT_OPTIONS.NAME_ASC:
      return pokemonList.sort((a, b) => a.name.localeCompare(b.name));
    case SORT_OPTIONS.NAME_DESC:
      return pokemonList.sort((a, b) => b.name.localeCompare(a.name));
    case SORT_OPTIONS.ID_ASC:
      return pokemonList.sort((a, b) => a.id - b.id);
    case SORT_OPTIONS.ID_DESC:
      return pokemonList.sort((a, b) => b.id - a.id);
    default:
      return pokemonList;
  }
};