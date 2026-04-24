const TYPES = [
  "grass", "fire", "water", "bug", "normal", "poison", "flying", "electric",
  "ground", "fairy", "fighting", "psychic", "rock", "steel", "ice", "ghost",
  "dragon", "dark",
];

const PAGE_SIZE = 21;
const MIN_SEARCH_LENGTH = 3;
const MAX_STAT = 255;
const MAX_STAT_TOTAL = 780;

const state = {
  pokemons: [],
  filteredIds: [],
  nextUrl: `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=0`,
  searchTerm: "",
  selectedTypes: [],
  theme: "light",
  isLoading: false,
  species: {},
  evolutionChains: {},
  currentOverlayId: null,
  currentTab: "about",
};
