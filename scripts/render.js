function renderGrid() {
  const contentRef = document.getElementById("content");
  const visible = state.filteredIds
    .map((id) => state.pokemons.find((p) => p.id === id))
    .filter(Boolean);

  if (visible.length === 0) {
    const reason =
      state.pokemons.length === 0
        ? "Noch keine Pokémon geladen."
        : "Keine Pokémon entsprechen deinen Filtern.";
    contentRef.innerHTML = `<p class="empty-message">${reason}</p>`;
    return;
  }
  contentRef.innerHTML = visible.map(templateCard).join("");
}

function renderOverlay(pokemonId) {
  const pokemon = state.pokemons.find((p) => p.id === pokemonId);
  if (!pokemon) return;

  state.currentOverlayId = pokemonId;
  const positionLabel = buildPositionLabel(pokemonId);

  const overlayContentRef = document.getElementById("singleOverlay");
  overlayContentRef.innerHTML = templateOverlay(pokemon, positionLabel);
  setOverlayBgColor(pokemon.types[0].type.name);

  document.getElementById("overlay").classList.replace("d_none", "d_flex");
  togglePositionFixed(true);
  showTab(state.currentTab);

  loadOverlayDetails(pokemonId);
}

function buildPositionLabel(pokemonId) {
  const idx = state.filteredIds.indexOf(pokemonId);
  if (idx === -1) return "";
  return `${idx + 1} / ${state.filteredIds.length}`;
}

function setOverlayBgColor(typeName) {
  const ref = document.getElementById("singleOverlay");
  TYPES.forEach((t) => ref.classList.remove("bg_" + t));
  ref.classList.add("bg_" + typeName);
}

async function loadOverlayDetails(pokemonId) {
  const pokemon = state.pokemons.find((p) => p.id === pokemonId);
  if (!pokemon) return;

  try {
    const [species, chain] = await Promise.all([
      fetchSpecies(pokemonId),
      fetchEvolutionChain(pokemonId),
    ]);
    if (state.currentOverlayId !== pokemonId) return;

    const aboutRef = document.getElementById("about_section");
    const evoRef = document.getElementById("evolution_section");
    if (aboutRef) aboutRef.innerHTML = templateAbout(pokemon, species);
    if (evoRef) evoRef.innerHTML = templateEvolution(chain);
  } catch (err) {
    console.warn("Overlay-Details konnten nicht geladen werden", err);
    if (state.currentOverlayId !== pokemonId) return;
    const aboutRef = document.getElementById("about_section");
    const evoRef = document.getElementById("evolution_section");
    if (aboutRef) aboutRef.innerHTML = templateAbout(pokemon, null);
    if (evoRef) {
      evoRef.innerHTML =
        `<p class="info-msg">Entwicklung konnte nicht geladen werden.</p>`;
    }
  }
}

function showTab(tabId) {
  state.currentTab = tabId;
  ["about", "base_stats", "evolution", "moves"].forEach((t) => {
    const section = document.getElementById(t + "_section");
    const link = document.getElementById(t + "_link");
    if (section) section.classList.toggle("d_none", t !== tabId);
    if (link) link.classList.toggle("selected", t === tabId);
  });
}

function closeOverlay() {
  state.currentOverlayId = null;
  state.currentTab = "about";
  document.getElementById("overlay").classList.replace("d_flex", "d_none");
  togglePositionFixed(false);
}

function togglePositionFixed(fix) {
  document
    .getElementById("content_max_width")
    .classList.toggle("position_fixed", fix);
}

function applyFilters() {
  state.filteredIds = state.pokemons
    .filter(matchesSearch)
    .map((p) => p.id);
  renderGrid();
}

function matchesSearch(pokemon) {
  if (!state.searchTerm) return true;
  return pokemon.name.toLowerCase().includes(state.searchTerm);
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  storageSetRaw(STORAGE_KEYS.THEME, theme);
  const btn = document.getElementById("theme_toggle");
  if (btn) {
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
    btn.setAttribute(
      "aria-label",
      theme === "dark" ? "Light Mode aktivieren" : "Dark Mode aktivieren"
    );
  }
}

function updateLoadMoreButton() {
  const btn = document.getElementById("btn_load_more");
  if (!btn) return;
  const done = !state.nextUrl;
  btn.disabled = state.isLoading || done;
  btn.classList.toggle("btn_disabled", btn.disabled);
  btn.textContent = done ? "Alle geladen" : state.isLoading ? "Lade…" : "Mehr Laden";
}

function showError(msg) {
  const banner = document.getElementById("error_banner");
  if (!banner) return;
  banner.textContent = msg;
  banner.classList.remove("d_none");
  clearTimeout(showError._timer);
  showError._timer = setTimeout(() => banner.classList.add("d_none"), 5000);
}

function setLoadingCursor(loading) {
  document
    .getElementById("content_wraper")
    .classList.toggle("curser_loading", loading);
}
