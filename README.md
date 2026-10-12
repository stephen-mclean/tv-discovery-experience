# tv-discovery-experience

A [Turborepo](https://turborepo.dev) monorepo using [pnpm workspaces](https://pnpm.io/workspaces).

## What's inside

| Path                         | Description                                                     |
| ---------------------------- | --------------------------------------------------------------- |
| `apps/web`                   | React 19 + Vite UI (http://localhost:5173)                      |
| `apps/api`                   | Express 5 API in TypeScript (http://localhost:3001)             |
| `apps/ladle`                 | Ladle stories for the UI components (`pnpm dev --filter=ladle`) |
| `packages/ui`                | `@repo/ui`: TV UI components, nav hooks and Tailwind tokens     |
| `packages/eslint-config`     | Shared ESLint flat configs (`base`, `node`, `react`)            |
| `packages/typescript-config` | Shared `tsconfig` bases                                         |

In development the Vite dev server proxies `/api/*` to the API, so the UI can call `fetch("/api/...")` with no CORS setup.

## Getting started

Requires Node.js 24+ and pnpm (the version is pinned in `package.json` via `packageManager`; `corepack enable` will pick it up).

```sh
pnpm install
pnpm dev          # run web + api in watch mode
```

## Scripts

All scripts run through Turborepo from the repo root:

| Command            | Description                   |
| ------------------ | ----------------------------- |
| `pnpm dev`         | Start all apps in dev mode    |
| `pnpm build`       | Build all apps (cached)       |
| `pnpm lint`        | Lint all workspaces           |
| `pnpm check-types` | Type-check all workspaces     |
| `pnpm format`      | Format the repo with Prettier |

Target a single app with `--filter`, e.g. `pnpm dev --filter=web` or `pnpm build --filter=api`.

The production API can be started with `pnpm --filter=api start` after a build.

## Note on TypeScript versions

Type-checking uses TypeScript 7 (the native compiler, installed as `@typescript/native`, which provides `tsc`). `typescript-eslint` does not yet support TypeScript 7, so the `typescript` package name is aliased to TypeScript 6 for tooling that loads the TypeScript API. This follows the setup used in the official Turborepo examples.

## Product Information

We are building an interactive, TV-first experience that helps users discover movies and TV shows, learn more about titles and their cast, and find similar content to watch. The experience should feel natural to use from a couch, with voice and D-pad navigation as the primary interaction methods.

### Example User Queries

Your experience should support natural-language discovery and exploration:

Find me the most popular movies of all time
What movies are coming out soon?
When was Fight Club released?
Find me a show similar to Breaking Bad.
What movies has Brad Pitt been in?

These are illustrative examples, not an exhaustive list of required queries.

### Functional Requirements

Voice interaction: Users should be able to make natural-language requests using voice.
D-pad navigation: The entire experience must be navigable using directional controls (keyboard arrow keys are acceptable), with a way to select items and navigate back.
Content discovery: Users should be able to explore movie and TV results and view relevant details about a selected title.
AI integration: Use an LLM to interpret user requests and help deliver relevant results.
Real content data: Use TMDB to retrieve actual movie and TV information

Home screen should show something useful for the user -> maybe a trending list of movies / tv shows / actors
Ease of navigation is priority
Netflix style list screens -> drill down detail page
Detail pages can have links to related content (if API supports it)
Should be able to go back with one click
Voice interaction should be available everywhere

### Experience Guidelines

Design for a TV or 10-foot viewing experience.
Make content easy to browse and navigate without a mouse.
Prioritize intuitive interactions, readable content, and clear navigation states.
Visual polish is appreciated

### Media API

We will use TMDB for retrieving media information: https://developer.themoviedb.org/docs/getting-started
