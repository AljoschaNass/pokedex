const STORAGE_KEYS = {
  THEME: "pokedex_theme",
  POKEMONS: "pokedex_pokemons_v1",
  NEXT_URL: "pokedex_next_url_v1",
  SPECIES_PREFIX: "pokedex_species_v1_",
  EVOLUTION_PREFIX: "pokedex_evolution_v1_",
};

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Liest einen Cache-Eintrag mit TTL. Liefert `null`, wenn der Eintrag
 * fehlt, abgelaufen ist oder das Parsen fehlschlägt.
 * @param {string} key
 * @returns {any|null}
 */
function storageGetCached(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.expires || parsed.expires < Date.now()) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

/**
 * Schreibt einen Cache-Eintrag mit Ablaufzeit (`CACHE_TTL_MS`).
 * Bei Quota-Überschreitung wird stillschweigend ignoriert.
 * @param {string} key
 * @param {any} data
 */
function storageSetCached(key, data) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ data, expires: Date.now() + CACHE_TTL_MS })
    );
  } catch {
    // Quota exceeded — ignore, cache is optional
  }
}

function storageGetRaw(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSetRaw(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

/**
 * Versucht, die Pokémon-Liste + nextUrl aus dem Cache zu laden.
 * @returns {{pokemons: object[], nextUrl: string|null}|null}
 */
function loadPokemonsFromCache() {
  const cached = storageGetCached(STORAGE_KEYS.POKEMONS);
  if (!cached) return null;
  const nextUrl = storageGetRaw(STORAGE_KEYS.NEXT_URL);
  return { pokemons: cached, nextUrl };
}

/**
 * Persistiert den aktuellen `state.pokemons` und `state.nextUrl` in
 * LocalStorage.
 */
function savePokemonsToCache() {
  storageSetCached(STORAGE_KEYS.POKEMONS, state.pokemons);
  if (state.nextUrl) {
    storageSetRaw(STORAGE_KEYS.NEXT_URL, state.nextUrl);
  } else {
    try { localStorage.removeItem(STORAGE_KEYS.NEXT_URL); } catch {}
  }
}
