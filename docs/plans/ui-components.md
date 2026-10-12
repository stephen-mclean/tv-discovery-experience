# Tech plan: Base UI components (Issue #1)

> Source: [Issue #1 – Build out UI components](https://github.com/stephen-mclean/tv-discovery-experience/issues/1)
> Status: **Agreed, ready for implementation**

## Goal

Build the presentational components that power the TV discovery experience, and develop them in
Ladle so we can iterate on the UI before wiring up TMDB, the LLM and the real screens.

In scope:

1. **List display (`MediaRow`)**: a titled row of poster tiles. Each tile can be reached with the keyboard or D-pad.
2. **Media detail view (`MediaDetail`)**: an easy-to-read page for a movie or TV show.
3. **Person/cast tiles (`PersonTile`, `PersonRow`)**: used for cast on detail pages and for "movies with Brad Pitt" queries.
4. **Voice bar shell (`VoiceBar`)**: presentational voice states, with a Motion animation while the input is being processed.

Out of scope: data fetching, TMDB/LLM integration, routing, real speech input, full screens,
adopting `@repo/ui` in `apps/web` (next issue), detail extras such as watch providers, trailers and
season/episode lists (later), and automated tests.
The components must not depend on any of the excluded pieces.

**How we verify:** every component and state is visible and testable with the keyboard in Ladle
(`pnpm dev --filter=ladle`). Ladle is the definition of done for this issue.

## Decisions

| Question                     | Decision                                                                    |
| ---------------------------- | --------------------------------------------------------------------------- |
| Component location           | New `packages/ui` package                                                  |
| Navigation                   | Native focus plus small arrow-key hooks (no spatial-nav library)           |
| Styling                      | Tailwind v4                                                                 |
| Animation                    | Motion (formerly Framer Motion), used for voice processing                 |
| Tile shapes                  | Portrait posters only                                                      |
| Detail extras (watch providers, trailers, seasons) | Later                                                 |
| Voice hotkey                 | Yes, and the key is configurable                                           |
| Tests                        | None for now. Focus is functionality, verified in Ladle                    |
| `apps/web` adoption          | Next issue                                                                  |

## Product constraints that drive the design

| Constraint (README)                              | Design consequence                                                                                       |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| 10-foot UI, readable content                     | TV type scale (body ≥ 24px at 1080p), high contrast dark theme, overscan-safe page padding                |
| D-pad navigation for everything                  | Every interactive element is a native `<button>`/`<a>`, with arrow-key handling described below           |
| Clear navigation states                          | Focus state that's hard to miss: scale, a bright ring and a lifted shadow, using `:focus-visible`        |
| Netflix-style lists → detail                     | Horizontal rows that scroll to keep the focused tile in view; the detail view reuses rows for related content |
| Voice everywhere                                 | `VoiceBar` is a self-contained component that can be mounted in any screen's header                       |
| Example queries ("When was Fight Club released?") | The detail view shows release date, runtime, cast and similar titles where a viewer looks first          |

## Architecture decisions

| Decision      | Choice                                                     | Notes                                                                                                     |
| ------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Location      | New workspace package **`packages/ui`** (`@repo/ui`)       | Consumed by `apps/ladle` (stories) and later `apps/web`. It ships TS source with no build step, and Vite transpiles it. |
| Styling       | **Tailwind CSS v4** via `@tailwindcss/vite`                | Tokens live in a `@theme` block in `packages/ui/src/styles.css`, which consumers import once.              |
| Focus / nav   | **Native focus** + a small amount of arrow-key code         | No spatial-nav library. See [Navigation model](#navigation-model).                                        |
| Animation     | **Motion** (`motion` package, `motion/react`)              | The library formerly called Framer Motion. Used for the voice processing animation and tile focus transitions. Respects reduced motion via `<MotionConfig reducedMotion="user">`. |
| Data contract | UI **view-model types** defined in `@repo/ui`, not TMDB types | Keeps components independent of TMDB. The API/web layer maps TMDB responses to these types, and image URLs arrive fully built. |

### Package layout

```
packages/ui/
  package.json            # name @repo/ui, exports "./*" -> src, "./styles.css"
  tsconfig.json           # extends @repo/typescript-config/vite-react.json
  eslint.config.js        # @repo/eslint-config/react
  src/
    styles.css            # @import "tailwindcss"; @source "./"; @theme { tokens }
    types.ts              # MediaSummary, MediaDetail, PersonSummary, CastMember
    nav/
      useRovingRow.ts     # left/right inside a row, remembers the focused index
      useSectionNav.ts    # up/down between [data-nav-section] containers
    media/
      PosterTile.tsx
      MediaRow.tsx
      MediaDetail.tsx     # composed from the pieces below
      DetailHero.tsx
      MetaLine.tsx
    people/
      PersonTile.tsx
      PersonRow.tsx
    voice/
      VoiceBar.tsx
      ProcessingIndicator.tsx
      useVoiceHotkey.ts   # configurable global hotkey that activates voice
    index.ts
apps/ladle/
  .ladle/components.tsx   # global provider: imports @repo/ui/styles.css, dark TV canvas, MotionConfig
  vite.config.ts          # @tailwindcss/vite plugin
  src/fixtures/*.ts       # realistic fixture data (Fight Club, Breaking Bad, Brad Pitt, …)
  src/*.stories.tsx
```

The `@source "./"` line in `packages/ui/src/styles.css` makes Tailwind scan the UI package's
classes from any consumer. Without it, v4's automatic source detection only scans the consuming app.

The placeholder `apps/ladle/src/Button.*` gets removed.

## Data contracts (view models)

```ts
type MediaType = "movie" | "tv";

interface MediaSummary {
  id: string;               // e.g. "movie:550", unique across media types
  type: MediaType;
  title: string;
  posterUrl?: string;       // fully built (e.g. TMDB w342); missing shows a fallback tile
  year?: number;
  releaseDate?: string;     // ISO; used for "Coming soon" badges
  rating?: number;          // 0–10
}

interface PersonSummary {
  id: string;
  name: string;
  profileUrl?: string;
  role?: string;            // character name or "Director"
}

interface MediaDetail extends MediaSummary {
  backdropUrl?: string;
  tagline?: string;
  overview?: string;
  genres: string[];
  runtimeMinutes?: number;  // movie
  seasons?: number;         // tv
  episodes?: number;        // tv
  status?: string;          // "Released", "Returning Series", …
  certification?: string;   // "R", "TV-MA"
  credits: { label: string; people: PersonSummary[] }[]; // "Director", "Created by"
  cast: PersonSummary[];
  similar: MediaSummary[];
}
```

Optional fields are optional on purpose: TMDB data is often incomplete, and every component needs a
story where these fields are missing.

## Navigation model

Using native focus means the browser handles focus, Enter/Space activation and `:focus-visible`.
We add only what the browser can't do:

1. **Within a row (left/right): `useRovingRow`**
   - Only one tile per row has `tabIndex=0`; the rest have `-1` (roving tabindex).
   - ArrowLeft/Right moves focus to the adjacent tile and updates the active index. It stops at the
     ends (no wrap).
   - On focus, the tile calls `scrollIntoView({ inline: "nearest", block: "nearest" })`. Combined with
     `scroll-padding` on the row, the focused tile never sits flush against the edge.
2. **Between rows/sections (up/down): `useSectionNav`**
   - Containers are tagged `data-nav-section`. ArrowUp/Down focuses the `tabIndex=0` element in the
     previous or next section.
   - Because each row keeps its own `tabIndex=0` tile, coming back to a row returns to the tile you
     last focused there. This is Netflix behaviour without a library.
3. **Select**: native `<button>` `onClick` handles Enter and Space.
4. **Back**: out of scope for the components. The app will map Escape/Backspace to history back.
   The components only expose `onSelect` callbacks.

Known trade-off: this is row/column navigation, not true geometric spatial navigation. If layouts
later need grids or free-form layouts, we can swap in a spatial-nav library behind the same hooks.

## Design tokens (Tailwind `@theme`)

- **Canvas**: a 1920×1080 reference. Page padding of `5vw` horizontal and `5vh` vertical gives an overscan safe area.
- **Type**: `display` 64px, `title` 48px, `heading` 32px, `body` 24px, `caption` 20px (minimum).
- **Color**: near-black background (`#0b0b0f`), surface layers, high-contrast text, one accent colour.
- **Focus**: `--focus-ring` (a white 4px ring with a 4px offset), a 1.08 scale and a shadow lift. Applied with
  `focus-visible:` variants. Unfocused tiles stay at full opacity so text remains readable.
- **Motion**: shared durations and easing (~150ms focus, ~300ms enter), all zeroed under reduced motion.

## Components

### 1. `PosterTile`

- Props: `item: MediaSummary`, `onSelect(item)`, `focused?` (story-only override), `size?: "md" | "lg"`.
- A `<button>` with a 2:3 poster. Missing poster shows a fallback with the title on a gradient.
- Lazy images (`loading="lazy"`, `decoding="async"`), plus a skeleton until the image loads.
- Badges: rating, and "Coming soon" when `releaseDate` is in the future.
- The title shows below the tile **only when the tile is focused**, to reduce clutter (Netflix pattern).
  `aria-label` always contains the title and year.

### 2. `MediaRow` (the issue's "List display")

- Props: `title`, `items: MediaSummary[]`, `onSelect`, `loading?`, `emptyMessage?`.
- A heading plus a horizontally scrolling list (`role="list"`), using `useRovingRow` and `data-nav-section`.
- Loading state renders skeleton tiles. An empty state renders a message.

### 3. `PersonTile` / `PersonRow`

- A round headshot, name and role (character). Missing photo shows initials.
- `PersonRow` shares its row mechanics with `MediaRow`. Extract a generic `Row<T>` with `renderItem` so
  the focus/scroll logic exists once.

### 4. `MediaDetail` (the issue's "Media detail view")

Layout, top to bottom (each block is its own nav section):

1. **Hero**: full-bleed backdrop with left and bottom gradient scrims. Over it: title, tagline, and a
   **meta line** with year · certification · runtime (or "3 seasons · 30 episodes") · ★ rating ·
   status. Then genre chips, the overview (clamped to ~4 lines and expandable), credits
   ("Directed by David Fincher"), and the full release date.
2. **Cast**: a `PersonRow`.
3. **More like this**: a `MediaRow` of `similar`.

- Props: `media: MediaDetail`, `onSelectMedia`, `onSelectPerson`.
- When the page opens, focus goes to the first interactive element so the D-pad works immediately.
- Movie and TV variants share one component, branching only in `MetaLine`.

### 5. `VoiceBar` (shell)

- Props: `status: "idle" | "listening" | "processing" | "result" | "error"`, `transcript?`,
  `message?` (result summary or error text), `onActivate()`, and hotkey config (below).
- A focusable mic `<button>` plus a text area:
  - **idle**: mic icon with the hint "Press 🎤 or say 'Find me…'".
  - **listening**: a pulsing ring around the mic (Motion) and the live transcript.
  - **processing**: a **`ProcessingIndicator`** Motion animation, for example an animated gradient
    "thinking" bar or staggered bouncing dots. The transcript stays visible.
  - **result / error**: the echoed query plus `message`, with an error tint for errors.
- Transitions between states use `AnimatePresence`. Reduced motion swaps the animations for a static
  indicator.
- `aria-live="polite"` on the transcript/message area.

#### Configurable voice hotkey (`useVoiceHotkey`)

Voice has to work from anywhere, so `VoiceBar` can listen for a global key:

```ts
interface VoiceHotkeyConfig {
  enabled?: boolean;   // default true
  keys?: string[];     // KeyboardEvent.key values; default ["/"]
}
// <VoiceBar hotkey={{ keys: ["/", "m"] }} onActivate={…} />
// <VoiceBar hotkey={{ enabled: false }} … />
```

- A single `keydown` listener on `window`. It calls `onActivate()` and moves focus to the mic button.
- Ignored when the event target is an editable field (`input`, `textarea`, `contenteditable`), or when a
  modifier key is held, so normal typing doesn't trigger it.
- Uses `preventDefault()` only when it matches the event, so the configured key doesn't also type a character or scroll.
- The hint text is built from the configured keys (e.g. "Press / to speak").
- The hook is also exported on its own, so the app can bind the hotkey without rendering the bar.
- `VoiceBar` forwards a ref with an imperative `activate()` and `focus()`, so the app can wire up
  remote-control mic buttons later.

## Ladle setup

- `apps/ladle/vite.config.ts` adds `@tailwindcss/vite`. Check how Ladle 5 picks up the Vite config
  (`viteConfig` in `.ladle/config.mjs` if not automatic).
- `.ladle/components.tsx` `Provider` imports `@repo/ui/styles.css`, sets the dark TV canvas with
  safe-area padding, and wraps stories in `MotionConfig reducedMotion="user"`.
- Stories use `args`/`argTypes` for knobs (e.g. `VoiceBar` status as a radio control).
- Each story file includes a **"Keyboard playground"** story. For example: three `MediaRow`s stacked under
  `useSectionNav` to test D-pad navigation end-to-end.

### Story matrix

| Component      | Stories                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------- |
| PosterTile     | Default, Focused, No poster, Long title, Coming soon, Loading                                  |
| MediaRow       | Popular movies, TV shows, Loading, Empty, Single item, Keyboard playground (multi-row)          |
| PersonTile/Row | Cast row, No photo (initials), Long names                                                      |
| MediaDetail    | Movie (Fight Club), TV (Breaking Bad), Upcoming movie, Sparse data (no backdrop/overview/cast)  |
| VoiceBar       | One story per status, Interactive (cycles idle → listening → processing → result), Hotkey (key list + enabled as controls) |

## Implementation steps (suggested PR order)

Each step ends with something you can see in Ladle.

1. **Foundation**
   - Create `packages/ui` (package.json with `exports`, tsconfig, eslint config) and add it as a dependency of `apps/ladle`.
   - Add `tailwindcss` and `@tailwindcss/vite`. Write `styles.css` with `@theme` tokens and `@source`.
   - Add the Ladle `vite.config.ts` and the `.ladle/components.tsx` provider. Remove the placeholder `Button`.
   - Read the installed Turborepo docs before changing any turbo config (see `AGENTS.md`).
     Most likely none is needed, because `@repo/ui` has no build step.
   - *Verify in Ladle:* a "Tokens" story renders the type scale, colours and a focus-ring sample at 1080p.
2. **Types + fixtures**
   - Add the view-model types to `@repo/ui`. Add fixtures in `apps/ladle/src/fixtures` that cover the README queries:
     popular movies, upcoming movies, Fight Club detail, Breaking Bad detail with similar shows, and Brad Pitt's
     filmography. Use real TMDB image URLs, plus some entries with missing images or fields.
3. **Navigation + rows**
   - `useRovingRow`, `useSectionNav`, a generic `Row<T>`, `PosterTile` and `MediaRow`.
   - *Verify in Ladle:* the keyboard playground. Arrow keys move through the tiles, the focused tile scrolls into view,
     up/down returns to the remembered tile, and Enter fires `onSelect` (shown with Ladle's `action`).
4. **People**
   - `PersonTile` and `PersonRow`, reusing `Row<T>`.
   - *Verify in Ladle:* cast row stories, including initials fallback and long names.
5. **Detail**
   - `MetaLine`, `DetailHero` and `MediaDetail`.
   - *Verify in Ladle:* the movie, TV, upcoming and sparse stories. You can move through the hero, cast and similar rows
     with only the arrow keys, and focus lands inside the page when it opens.
6. **Voice**
   - Add `motion`. Build `ProcessingIndicator`, `useVoiceHotkey` and `VoiceBar`.
   - *Verify in Ladle:* one story per state, the interactive cycle, and the hotkey story (change the keys in the
     controls and confirm the hint text and activation follow them). The reduced-motion setting removes the animation.

## Acceptance criteria (checked in Ladle)

- [ ] Every interactive element can be reached and used with only the arrow keys and Enter.
- [ ] The focus state is easy to see on a 1080p screen viewed from a distance.
- [ ] Focus is remembered per row when moving up and down. The focused tile is always fully visible.
- [ ] Tiles are portrait (2:3) only. Missing posters and photos show readable fallbacks.
- [ ] The detail view shows the title, meta line (year, certification, runtime or seasons, rating, status), genres,
      overview, credits, release date, cast row and "More like this" row, for both movies and TV.
- [ ] `VoiceBar` shows all five states. Processing uses a Motion animation, and reduced motion is respected.
- [ ] The voice hotkey is configurable (keys + enabled), ignores typing in inputs, and the hint text reflects the configured keys.
- [ ] Every component has stories for loading, empty/missing-data and long-content cases.
- [ ] No component imports TMDB, fetch or routing code.
- [ ] `pnpm lint`, `pnpm check-types` and `pnpm build` pass.
