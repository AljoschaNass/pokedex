function init() {
  initTheme();
  wireEvents();
  startLoading();
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
  } catch (err) {
    console.error("Pokémon-Laden fehlgeschlagen", err);
    showError("Pokémon konnten nicht geladen werden. Bitte später erneut versuchen.");
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
}

window.addEventListener("DOMContentLoaded", init);
