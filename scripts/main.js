/**
 * Bootstrap der App: Theme aus LocalStorage/System ableiten,
 * Filter-Leiste rendern, Listener registrieren, Daten laden,
 * Service Worker registrieren.
 */
function init() {
  initTheme();
  renderTypeFilter();
  wireEvents();
  startLoading();
  registerServiceWorker();
}

function initTheme() {
  const stored = storageGetRaw(STORAGE_KEYS.THEME);
  if (stored === "dark" || stored === "light") {
    setTheme(stored);
    return;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
}

/**
 * Initialer Lade-Vorgang: zuerst Cache prüfen, sonst frisch von der
 * PokéAPI holen. Versteckt anschließend den Loading-Screen.
 */
async function startLoading() {
  const cache = loadPokemonsFromCache();
  if (cache && cache.pokemons && cache.pokemons.length > 0) {
    state.pokemons = cache.pokemons;
    if (cache.nextUrl) state.nextUrl = cache.nextUrl;
    else state.nextUrl = null;
    applyFilters();
    hideLoadingScreen();
    return;
  }
  await loadMore();
  hideLoadingScreen();
}

/**
 * Lädt den nächsten Pokémon-Batch von der API, dedupliziert anhand
 * der ID, persistiert in den Cache und re-rendert die gefilterte
 * Ansicht. Bei Fehler wird ein Banner mit Retry-Option gezeigt.
 */
async function loadMore() {
  if (state.isLoading || !state.nextUrl) return;
  state.isLoading = true;
  updateLoadMoreButton();
  setLoadingCursor(true);

  try {
    const batch = await fetchNextBatch();
    for (const p of batch) {
      if (!state.pokemons.some((existing) => existing.id === p.id)) {
        state.pokemons.push(p);
      }
    }
    savePokemonsToCache();
    applyFilters();
    hideError();
  } catch (err) {
    console.error("Pokémon-Laden fehlgeschlagen", err);
    showError(
      "Pokémon konnten nicht geladen werden.",
      "retry-load"
    );
  } finally {
    state.isLoading = false;
    setLoadingCursor(false);
    updateLoadMoreButton();
  }
}

function hideLoadingScreen() {
  document.getElementById("loading_screen").classList.add("d_none");
  document.getElementById("content").classList.remove("d_none");
  document.getElementById("btn_section").classList.remove("d_none");
  document.getElementById("type_filter").classList.remove("d_none");
}

/**
 * Registriert den Service Worker, falls die Browser-API verfügbar ist
 * und die Seite nicht über `file://` geladen wurde.
 */
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol === "file:") return;
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .catch((err) => console.warn("Service Worker konnte nicht registriert werden", err));
  });
}

window.addEventListener("DOMContentLoaded", init);
