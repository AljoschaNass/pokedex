/**
 * Rendert das Karten-Grid für die aktuell sichtbaren Pokémon
 * (`state.filteredIds`). Zeigt eine Empty-State-Meldung, wenn nichts
 * passt.
 */
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

function renderTypeFilter() {
  const ref = document.getElementById("type_filter");
  if (!ref) return;
  ref.innerHTML = templateTypeFilter(state.selectedTypes);
}

/**
 * Öffnet das Detail-Overlay für ein Pokémon, setzt Position-Label,
 * Hintergrundfarbe und triggert das Nachladen der Detail-Daten.
 * @param {number} pokemonId
 */
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

/**
 * Lädt Spezies- und Evolutions-Daten asynchron nach und füllt die
 * About-/Evolution-Tabs nach. Bricht ab, wenn der User in der
 * Zwischenzeit zu einem anderen Pokémon gewechselt hat.
 * @param {number} pokemonId
 */
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

/**
 * Aktualisiert `state.filteredIds` anhand von Suche + Typ-Filter und
 * rendert das Grid neu.
 */
function applyFilters() {
  state.filteredIds = state.pokemons
    .filter(matchesFilters)
    .map((p) => p.id);
  renderGrid();
}

function matchesFilters(pokemon) {
  return matchesSearch(pokemon) && matchesTypes(pokemon);
}

function matchesSearch(pokemon) {
  if (!state.searchTerm) return true;
  return pokemon.name.toLowerCase().includes(state.searchTerm);
}

function matchesTypes(pokemon) {
  if (state.selectedTypes.length === 0) return true;
  return pokemon.types.some((t) =>
    state.selectedTypes.includes(t.type.name)
  );
}

/**
 * Setzt das aktive Theme, persistiert es in LocalStorage und
 * aktualisiert das Toggle-Icon.
 * @param {"light"|"dark"} theme
 */
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

/**
 * Zeigt ein Fehler-Banner für 5 Sekunden. Wenn `retryAction` gesetzt
 * ist, wird zusätzlich ein Wiederholen-Button gerendert.
 * @param {string} msg
 * @param {string} [retryAction] data-action des Retry-Buttons
 */
function showError(msg, retryAction) {
  const banner = document.getElementById("error_banner");
  if (!banner) return;
  const retryBtn = retryAction
    ? `<button type="button" class="error-retry-btn" data-action="${retryAction}">Erneut versuchen</button>`
    : "";
  banner.innerHTML = `<span class="error-msg">${msg}</span>${retryBtn}`;
  banner.classList.remove("d_none");
  clearTimeout(showError._timer);
  showError._timer = setTimeout(() => banner.classList.add("d_none"), 5000);
}

/**
 * Versteckt das Fehler-Banner sofort (z.B. nach erfolgreichem Retry).
 */
function hideError() {
  const banner = document.getElementById("error_banner");
  if (!banner) return;
  clearTimeout(showError._timer);
  banner.classList.add("d_none");
}

function setLoadingCursor(loading) {
  document
    .getElementById("content_wraper")
    .classList.toggle("curser_loading", loading);
}
