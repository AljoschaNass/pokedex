/**
 * Lädt JSON von einer URL und wirft bei HTTP-Fehlern.
 * @param {string} url
 * @returns {Promise<any>}
 */
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status} for ${url}`);
  return res.json();
}

/**
 * Holt die nächste Seite der Pokémon-Liste und ergänzt `state.nextUrl`
 * für nachfolgende Aufrufe. Liefert die Detail-Objekte des Batches.
 * @returns {Promise<object[]>}
 */
async function fetchNextBatch() {
  const listData = await fetchJson(state.nextUrl);
  state.nextUrl = listData.next;
  const details = await Promise.all(
    listData.results.map((r) => fetchJson(r.url))
  );
  return details;
}

/**
 * Liefert die Spezies-Daten eines Pokémon. Cached in `state.species`
 * (RAM) und LocalStorage (7-Tage-TTL).
 * @param {number} pokemonId
 * @returns {Promise<object>}
 */
async function fetchSpecies(pokemonId) {
  if (state.species[pokemonId]) return state.species[pokemonId];

  const cacheKey = STORAGE_KEYS.SPECIES_PREFIX + pokemonId;
  const cached = storageGetCached(cacheKey);
  if (cached) {
    state.species[pokemonId] = cached;
    return cached;
  }

  const species = await fetchJson(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
  );
  state.species[pokemonId] = species;
  storageSetCached(cacheKey, species);
  return species;
}

/**
 * Liefert die abgeflachte Evolutionskette eines Pokémon als Array
 * `[{ name, id }, …]`. Cached wie `fetchSpecies`.
 * @param {number} pokemonId
 * @returns {Promise<Array<{name: string, id: number}>>}
 */
async function fetchEvolutionChain(pokemonId) {
  if (state.evolutionChains[pokemonId]) return state.evolutionChains[pokemonId];

  const cacheKey = STORAGE_KEYS.EVOLUTION_PREFIX + pokemonId;
  const cached = storageGetCached(cacheKey);
  if (cached) {
    state.evolutionChains[pokemonId] = cached;
    return cached;
  }

  const species = await fetchSpecies(pokemonId);
  const chainData = await fetchJson(species.evolution_chain.url);
  const chain = flattenEvolutionChain(chainData.chain);
  state.evolutionChains[pokemonId] = chain;
  storageSetCached(cacheKey, chain);
  return chain;
}

function flattenEvolutionChain(rootNode) {
  const chain = [];
  let node = rootNode;
  while (node) {
    const id = extractIdFromUrl(node.species.url);
    chain.push({ name: node.species.name, id });
    node = node.evolves_to[0];
  }
  return chain;
}

function extractIdFromUrl(url) {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}
