const STAT_LABELS = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

function spriteUrl(pokemon) {
  return (
    pokemon.sprites?.other?.dream_world?.front_default ||
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default ||
    ""
  );
}

function evolutionSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function templateCard(pokemon) {
  const primaryType = pokemon.types[0].type.name;
  const typeIcons = pokemon.types.map((t) => templateTypeIcon(t.type.name)).join("");
  return `
    <div class="pokecard bg_${primaryType}" data-pokemon-id="${pokemon.id}" data-action="open-overlay" tabindex="0" role="button" aria-label="Details zu ${pokemon.name} öffnen">
      <div class="pokecard_header">
        <h3>#${String(pokemon.id).padStart(3, "0")}</h3>
        <h3 class="pokemon_name">${pokemon.name}</h3>
      </div>
      <div class="pokecard_img">
        <img src="${spriteUrl(pokemon)}" alt="${pokemon.name}" loading="lazy">
      </div>
      <div class="pokecard_footer">${typeIcons}</div>
    </div>`;
}

function templateTypeIcon(typeName) {
  return `<img src="./assets/icons/${typeName}.svg" alt="${typeName}" title="${typeName}">`;
}

function templateOverlay(pokemon, positionLabel) {
  const typeIcons = pokemon.types.map((t) => templateTypeIcon(t.type.name)).join("");
  return `
    <div class="overlay_header">
      <button data-action="close-overlay" class="overlay-back-btn" aria-label="Schließen">Zurück</button>
      <h2 class="pokemon_name">${pokemon.name}</h2>
      <span class="overlay-id">#${String(pokemon.id).padStart(3, "0")}</span>
    </div>
    <div class="overlay_img_section">
      <div id="overlay_types" class="overlay_types">${typeIcons}</div>
      <img class="overlay_img" src="${spriteUrl(pokemon)}" alt="${pokemon.name}">
    </div>
    <div class="overlay_stats">
      <div class="overlay_links">
        <a data-action="show-tab" data-tab="about" id="about_link" class="selected" tabindex="0">About</a>
        <a data-action="show-tab" data-tab="base_stats" id="base_stats_link" tabindex="0">Base Stats</a>
        <a data-action="show-tab" data-tab="evolution" id="evolution_link" tabindex="0">Evolution</a>
        <a data-action="show-tab" data-tab="moves" id="moves_link" tabindex="0">Moves</a>
      </div>
      <div id="about_section" class="about">
        <p class="tab-loading">Lade…</p>
      </div>
      <div id="base_stats_section" class="base_stats d_none">
        ${templateBaseStats(pokemon)}
      </div>
      <div id="evolution_section" class="evolution d_none">
        <p class="tab-loading">Lade Entwicklung…</p>
      </div>
      <div id="moves_section" class="moves d_none">
        ${templateMoves(pokemon.moves)}
      </div>
    </div>
    <div class="control_buttons_overlay">
      <button data-action="prev" id="previous_button" aria-label="Vorheriges Pokémon">&lt;</button>
      <span class="current_count">${positionLabel}</span>
      <button data-action="next" id="next_button" aria-label="Nächstes Pokémon">&gt;</button>
    </div>`;
}

function templateAbout(pokemon, species) {
  const abilities =
    pokemon.abilities.map((a) => a.ability.name).join(", ") || "—";
  const genus =
    species?.genera?.find((g) => g.language.name === "en")?.genus || "—";
  const gender = formatGender(species?.gender_rate);
  const eggGroups =
    species?.egg_groups?.map((g) => g.name).join(", ") || "—";
  const eggCycle =
    species?.hatch_counter != null ? `${species.hatch_counter} Zyklen` : "—";

  return `
    <table>
      <tr><td>Species</td><td>${genus}</td></tr>
      <tr><td>Height</td><td>${pokemon.height / 10} m</td></tr>
      <tr><td>Weight</td><td>${pokemon.weight / 10} kg</td></tr>
      <tr><td>Abilities</td><td class="capitalize">${abilities}</td></tr>
      <tr><td colspan="2"><strong>Breeding</strong></td></tr>
      <tr><td>Gender</td><td>${gender}</td></tr>
      <tr><td>Egg Groups</td><td class="capitalize">${eggGroups}</td></tr>
      <tr><td>Egg Cycle</td><td>${eggCycle}</td></tr>
    </table>`;
}

function formatGender(rate) {
  if (rate == null) return "—";
  if (rate === -1) return "Genderless";
  const female = (rate / 8) * 100;
  const male = 100 - female;
  return `♂ ${male.toFixed(1)}% / ♀ ${female.toFixed(1)}%`;
}

function templateBaseStats(pokemon) {
  const rows = pokemon.stats.map((s) =>
    templateStatBar(s.stat.name, s.base_stat)
  );
  const total = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
  rows.push(templateStatTotal(total));
  return rows.join("");
}

function templateStatBar(statKey, value) {
  const label = STAT_LABELS[statKey] || statKey;
  const pct = Math.min((value / MAX_STAT) * 100, 100);
  const tier = value < 50 ? "low" : value < 90 ? "mid" : "high";
  return `
    <div class="stat-row">
      <span class="stat-label">${label}</span>
      <span class="stat-value">${value}</span>
      <div class="stat-bar">
        <div class="stat-fill stat-fill--${tier}" style="width:${pct}%"></div>
      </div>
    </div>`;
}

function templateStatTotal(total) {
  const pct = Math.min((total / MAX_STAT_TOTAL) * 100, 100);
  return `
    <div class="stat-row stat-total">
      <span class="stat-label">Total</span>
      <span class="stat-value">${total}</span>
      <div class="stat-bar">
        <div class="stat-fill stat-fill--total" style="width:${pct}%"></div>
      </div>
    </div>`;
}

function templateEvolution(chain) {
  if (!chain || chain.length === 0) {
    return `<p class="info-msg">Keine Evolutionsdaten verfügbar.</p>`;
  }
  const parts = [];
  chain.forEach((entry, i) => {
    parts.push(`
      <div class="evo-item">
        <img src="${evolutionSpriteUrl(entry.id)}" alt="${entry.name}" loading="lazy">
        <span class="capitalize">${entry.name}</span>
      </div>`);
    if (i < chain.length - 1) {
      parts.push(`<span class="evo-arrow" aria-hidden="true">›</span>`);
    }
  });
  return parts.join("");
}

function templateMoves(moves) {
  const list = (moves || []).slice(0, 8);
  if (list.length === 0) return `<p class="info-msg">Keine Moves bekannt.</p>`;
  const rows = list
    .map(
      (m) =>
        `<tr><td class="capitalize">${m.move.name.replace(/-/g, " ")}</td></tr>`
    )
    .join("");
  return `<table>${rows}</table>`;
}

function templateTypeFilter(selectedTypes) {
  const allActive = selectedTypes.length === 0;
  const allBtn = `
    <button class="type-filter-btn type-filter-all ${allActive ? "active" : ""}"
            data-action="clear-types" aria-pressed="${allActive}">Alle</button>`;
  const typeBtns = TYPES.map((t) => {
    const active = selectedTypes.includes(t);
    return `
      <button class="type-filter-btn bg_${t} ${active ? "active" : ""}"
              data-action="toggle-type" data-type="${t}" aria-pressed="${active}">
        <img src="./assets/icons/${t}.svg" alt="">
        <span class="capitalize">${t}</span>
      </button>`;
  }).join("");
  return allBtn + typeBtns;
}

