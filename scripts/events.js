/**
 * Hängt alle DOM-Listener auf. Wird einmalig in `init()` aufgerufen.
 * Nutzt Event-Delegation auf den Container-Elementen, damit dynamisch
 * gerenderte Cards/Tabs ohne Re-Wiring funktionieren.
 */
function wireEvents() {
  document.getElementById("btn_search").addEventListener("click", onSearch);
  document.getElementById("searching").addEventListener("keypress", onSearchKeypress);
  document.getElementById("btn_load_more").addEventListener("click", onLoadMore);
  document.getElementById("content").addEventListener("click", onContentClick);
  document.getElementById("content").addEventListener("keydown", onContentKeydown);
  document.getElementById("overlay").addEventListener("click", onOverlayClick);
  document.getElementById("singleOverlay").addEventListener("click", onSingleOverlayClick);
  document.getElementById("theme_toggle").addEventListener("click", onToggleTheme);
  document.getElementById("type_filter").addEventListener("click", onTypeFilterClick);
  document.getElementById("error_banner").addEventListener("click", onErrorBannerClick);
  document.addEventListener("keydown", onDocumentKeydown);
}

function onErrorBannerClick(event) {
  const btn = event.target.closest("[data-action]");
  if (!btn) return;
  if (btn.dataset.action === "retry-load") {
    hideError();
    loadMore();
  }
}

function onSearch() {
  const inputRef = document.getElementById("searching");
  const term = inputRef.value.trim().toLowerCase();

  if (term.length > 0 && term.length < MIN_SEARCH_LENGTH) {
    inputRef.placeholder = `Mindestens ${MIN_SEARCH_LENGTH} Zeichen…`;
    inputRef.classList.add("error_search");
    return;
  }
  inputRef.placeholder = "Suche...";
  inputRef.classList.remove("error_search");
  state.searchTerm = term;
  applyFilters();
}

function onSearchKeypress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    onSearch();
  }
}

function onLoadMore() {
  loadMore();
}

function onContentClick(event) {
  const card = event.target.closest("[data-pokemon-id]");
  if (!card) return;
  renderOverlay(parseInt(card.dataset.pokemonId, 10));
}

function onContentKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest("[data-pokemon-id]");
  if (!card) return;
  event.preventDefault();
  renderOverlay(parseInt(card.dataset.pokemonId, 10));
}

function onOverlayClick(event) {
  if (event.target.id === "overlay") closeOverlay();
}

function onSingleOverlayClick(event) {
  const el = event.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;
  if (action === "close-overlay") {
    closeOverlay();
  } else if (action === "show-tab") {
    showTab(el.dataset.tab);
  } else if (action === "prev") {
    navigateOverlay(-1);
    event.stopPropagation();
  } else if (action === "next") {
    navigateOverlay(1);
    event.stopPropagation();
  }
}

function onToggleTheme() {
  setTheme(state.theme === "dark" ? "light" : "dark");
}

function onTypeFilterClick(event) {
  const btn = event.target.closest("[data-action]");
  if (!btn) return;
  if (btn.dataset.action === "clear-types") {
    state.selectedTypes = [];
  } else if (btn.dataset.action === "toggle-type") {
    const type = btn.dataset.type;
    const idx = state.selectedTypes.indexOf(type);
    if (idx >= 0) state.selectedTypes.splice(idx, 1);
    else state.selectedTypes.push(type);
  }
  renderTypeFilter();
  applyFilters();
}

function onDocumentKeydown(event) {
  if (event.key === "Escape" && state.currentOverlayId != null) {
    closeOverlay();
  } else if (state.currentOverlayId != null) {
    if (event.key === "ArrowRight") navigateOverlay(1);
    else if (event.key === "ArrowLeft") navigateOverlay(-1);
  }
}

/**
 * Navigiert im Overlay zum vorherigen (-1) oder nächsten (+1) Pokémon
 * innerhalb der aktuell gefilterten Liste. Wrap-around an beiden Enden.
 * @param {-1|1} direction
 */
function navigateOverlay(direction) {
  if (state.currentOverlayId == null) return;
  if (state.filteredIds.length === 0) return;
  const currentIdx = state.filteredIds.indexOf(state.currentOverlayId);
  if (currentIdx === -1) return;
  const nextIdx =
    (currentIdx + direction + state.filteredIds.length) %
    state.filteredIds.length;
  renderOverlay(state.filteredIds[nextIdx]);
}
