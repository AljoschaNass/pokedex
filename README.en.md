> 🇩🇪 Deutsche Version: [README.md](README.md)

# Pokedex

A vanilla-JS web app that taps into the [PokéAPI](https://pokeapi.co) and presents the first generations of Pokémon in a searchable, filterable, browsable way. No build tool, no npm dependencies — just open and go.

![Pokedex – preview](assets/screenshots/preview.png)

## Features

- **Live list** with pagination ("Load more") — 21 Pokémon per batch
- **Search** from 3 characters with inline error feedback
- **Type filter** with multi-select (all 18 types) and an "All" reset
- **Detail overlay** with four tabs:
  - *About* — species, height, weight, abilities, breeding info
  - *Base Stats* — animated bars per stat + total
  - *Evolution* — full evolution chain with sprites
  - *Moves* — the first 8 moves
- **Dark mode** toggle, stored in `localStorage`, honoring `prefers-color-scheme`
- **Keyboard navigation:**
  - `Tab` / `Enter` — open card
  - `Esc` — close overlay
  - `←` / `→` — previous / next Pokémon inside the overlay
- **LocalStorage caching** with a 7-day TTL for the list, species data and evolution chains
- **Offline support** via service worker (static assets + cached API responses)
- **GDPR-compliant imprint + privacy policy** (German legal pages)

## Tech stack

- **HTML5**, **CSS3** (custom properties, grid, flexbox, mobile-first responsive)
- **Vanilla JavaScript** — no frameworks, no bundlers, no dependencies
- **[PokéAPI v2](https://pokeapi.co/docs/v2)** as the data source
- **Service worker** for offline capability

## Run it locally

The service worker and the PokéAPI `fetch` calls don't work over `file://`, so you'll need a local HTTP server.

**Option 1 — VS Code Live Server:**
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html` → "Open with Live Server"

**Option 2 — Python:**
```bash
python3 -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000).

**Option 3 — Node:**
```bash
npx serve .
```

## Project structure

```
pokedex/
├── index.html              Entry point
├── style.css               Layout, header, cards, grid
├── styles/
│   ├── theme.css           Light/dark CSS variables
│   ├── standard.css        Reset + global utilities
│   ├── overlay.css         Detail modal
│   └── color.css           Pokémon type colors (18 types)
├── scripts/
│   ├── state.js            Global state + constants
│   ├── storage.js          LocalStorage wrapper with TTL
│   ├── api.js              PokéAPI calls
│   ├── templates.js        HTML templates (cards, overlay, stats…)
│   ├── render.js           DOM rendering, filter logic, theme
│   ├── events.js           Event delegation, keyboard navigation
│   └── main.js             Initialization, service worker registration
├── html/
│   ├── impressum.html
│   └── datenschutz.html
├── assets/
│   ├── img/                Logo, favicon
│   ├── icons/              SVG icons for all 18 types
│   └── screenshots/        Preview images for the README
├── sw.js                   Service worker
└── LICENSE
```

## Architecture

Intentionally classic: global functions + a shared `state` object — **no** ES modules, no class hierarchies. The modules are wired together through `<script>` tag order in [index.html](index.html):

```
state → storage → api → templates → render → events → main
```

Rendering is declarative — `applyFilters()` builds the visible ID pool, `renderGrid()` maps it to HTML. Event delegation on container elements keeps listener counts constant no matter how many Pokémon are loaded.

## Accessibility

- Semantic buttons for every interactive element
- `aria-label`, `aria-modal`, `aria-pressed`, `role="dialog"` / `role="group"`
- Visible `:focus-visible` outline in both themes
- Full keyboard navigation (Tab, Enter, arrow keys, Escape)
- Reduced-motion-friendly transitions

## Data source

All Pokémon data comes from the [PokéAPI](https://pokeapi.co). Sprites are loaded directly from the [PokéAPI sprites repo](https://github.com/PokeAPI/sprites).

## License

[MIT](LICENSE) © Aljoscha Naß
