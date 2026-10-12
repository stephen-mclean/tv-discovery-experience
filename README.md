# tv-discovery-experience

A [Turborepo](https://turborepo.dev) monorepo using [pnpm workspaces](https://pnpm.io/workspaces).

## What's inside

| Path                         | Description                                          |
| ---------------------------- | ---------------------------------------------------- |
| `apps/web`                   | React 19 + Vite UI (http://localhost:5173)           |
| `apps/api`                   | Express 5 API in TypeScript (http://localhost:3001)  |
| `packages/eslint-config`     | Shared ESLint flat configs (`base`, `node`, `react`) |
| `packages/typescript-config` | Shared `tsconfig` bases                              |

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
