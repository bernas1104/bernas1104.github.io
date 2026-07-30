# bernasos

> A Windows 98-inspired desktop personal site, built with React 19, TypeScript, and Vite.

Live site: https://bernas1104.github.io

## Overview

**bernasos** recreates a Windows 98 desktop environment in the browser as a personal
site / portfolio. Instead of a traditional scrolling page, content lives inside
 draggable, resizable windows managed by a custom window manager.

The window manager is a Redux-like state layer built on `useReducer` + Context
(no Redux dependency). It supports:

- **Open / close** windows, with singleton apps that reuse an existing instance
- **Focus** management via a monotonic `zIndex` stack (clicking a window brings it to front)
- **Minimize / restore**, remembering the prior window state (open vs. maximized)
- **Maximize toggle** (open ⇄ maximized)
- **Move / resize** windows
- Focus falls back to the next-highest visible window when the focused one is minimized

The Win98 look comes from [98.css](https://jdan.github.io/98.css/) for widget chrome,
layered with Tailwind CSS v4 utilities driven by Win98 design tokens.

## Tech stack

| Area        | Choice                                                       |
| ----------- | ------------------------------------------------------------ |
| UI          | React 19                                                     |
| Language    | TypeScript ~6 (strict)                                       |
| Build       | Vite 8                                                       |
| Styling     | Tailwind CSS v4 (`@tailwindcss/vite`) + 98.css               |
| Testing     | Vitest 4 + @testing-library/react + jsdom + expect-type      |
| Lint/format | ESLint 9 + Prettier 3                                        |
| Git hooks   | Husky + commitlint (Conventional Commits)                    |
| Deploy      | GitHub Pages via GitHub Actions                              |

## Project structure

```
src/
├── App.tsx                  # Root component
├── App.test.tsx
├── main.tsx                 # React entry point
├── index.css                # CSS entry: 98.css → tokens → global → tailwind
├── common/
│   ├── types.ts             # Brand, Position, Size, IconName
│   └── types.test.ts        # Type-level tests (expect-type)
├── features/
│   └── desktop/
│       ├── types.ts         # AppId, WindowId, AppDescriptor, WindowInstance, DesktopState
│       ├── types.test.ts
│       └── windowManager/   # Reducer + Context state layer
│           ├── index.ts                 # Barrel: public API
│           ├── actions.ts               # WindowAction union + action creators
│           ├── reducer.ts               # windowsReducer + initialWindowsState
│           ├── reducer.test.ts          # Pure reducer unit tests
│           ├── WindowManagerContext.ts  # { state, dispatch } context
│           ├── WindowManagerProvider.tsx
│           └── useWindowManager.ts      # Consumer hook
├── styles/
│   ├── tokens.css           # Win98 design tokens (CSS custom properties)
│   └── global.css           # Resets / scrollbar overrides
└── test/
    └── setup.ts             # Vitest setup (jest-dom matchers)
```

## Getting started

### Prerequisites

- Node.js 22 (see `.nvmrc` — `engines.node` is pinned to `>=22.0.0 <23`)
- npm

### Install & run

```bash
git clone https://github.com/bernas1104/bernas1104.github.io.git
cd bernas1104.github.io
npm install
npm run dev
```

Then open the printed local URL (default http://localhost:5173).

## Available scripts

| Script                    | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `npm run dev`             | Start the Vite dev server with HMR                     |
| `npm run build`           | Type-check (`tsc -b`) then build to `dist/`            |
| `npm run preview`         | Preview the production build locally                   |
| `npm run typecheck`       | Type-check without emitting (`tsc -b --noEmit`)        |
| `npm run lint`            | Lint with ESLint                                       |
| `npm run lint:fix`        | Lint and auto-fix                                      |
| `npm run test`            | Run Vitest in watch mode                               |
| `npm run test:run`        | Run tests once (used by CI and pre-commit)             |
| `npm run test:coverage`   | Run tests with v8 coverage                             |
| `npm run format`          | Format `src/` with Prettier                            |
| `npm run format:check`    | Check `src/` formatting without writing                |

## Architecture

### Feature modules

Code is organized into feature modules under `src/features/<feature>/`. Each feature
owns its domain model in `types.ts` (with colocated type-level tests in `types.test.ts`)
and grows components/hooks as needed. Features can nest sub-modules —
`src/features/desktop/` owns the desktop domain and contains the `windowManager/`
sub-module. Every module exposes its public API through a barrel `index.ts`; import
from the barrel rather than internal files:

```ts
import { useWindowManager, openApp } from '@/features/desktop/windowManager';
```

### Window manager (reducer + Context)

The window manager follows a Redux-like pattern without Redux:

- **`actions.ts`** defines a `WindowAction` discriminated union and action creators
  (`openApp`, `closeWindow`, `focusWindow`, `minimizeWindow`, `toggleMaximizeWindow`,
  `moveWindow`, `resizeWindow`, `restoreWindow`).
- **`reducer.ts`** holds a pure `windowsReducer` and `initialWindowsState`. The reducer
  transitions `DesktopState` and never mutates: `windows` is a `ReadonlyMap` and each
  case builds a `new Map(state.windows)` before `.set`/`.delete`. No-op cases (focusing
  a missing or minimized window) return the same state reference. Exhaustiveness is
  enforced at compile time via `action satisfies never` in the `default` branch.
- **`WindowManagerProvider.tsx`** wires `useReducer(windowsReducer, initialWindowsState)`
  into a Context, exposing `{ state, dispatch }`.
- **`useWindowManager.ts`** consumes the context and throws if used outside the provider.

### Domain model

Domain types live in `src/common/types.ts` (`Brand`, `Position`, `Size`, `IconName`)
and `src/features/desktop/types.ts` (`AppId`, `WindowId`, `AppDescriptor`,
`WindowInstance`, `DesktopState`). IDs are branded (`Brand<string, 'WindowId'>`) so
`WindowId` and `AppId` are not interchangeable — they're cast to the branded type only
at the boundary (`crypto.randomUUID() as WindowId`).

### Styling

- **98.css** provides the Windows 98 widget chrome (`.window`, `.title-bar`,
  `.window-body`, buttons, etc.).
- **`src/styles/tokens.css`** centralizes the Win98 palette, typography, and spacing as
  `--win98-*` CSS custom properties. Components reference tokens, never raw hex colors.
- **`src/index.css`** maps those tokens into Tailwind v4 via a `@theme` block, so
  utilities like `bg-desktop`, `text-window-text`, and `font-win98` work. Import order
  matters: `98.css` → `tokens.css` → `global.css` → `tailwindcss`.

## Testing

- Vitest config lives in `vite.config.ts` (jsdom environment); tests are colocated with
  source as `*.test.ts` / `*.test.tsx`.
- **Component tests** use `@testing-library/react` + `@testing-library/jest-dom`.
- **Type-level tests** use `expect-type` for compile-time assertions (no runtime logic).
- **Reducer unit tests** exercise the pure reducer directly (no React render), using
  small factory helpers (`makeApp`/`makeWindow`/`makeState`) and mocking
  `crypto.randomUUID` for deterministic IDs. No-op cases are asserted with referential
  equality (`expect(next).toBe(state)`).

Run a single file:

```bash
npm run test:run -- src/features/desktop/windowManager/reducer.test.ts
```

## Conventions

- **Conventional Commits** are enforced by commitlint on the `commit-msg` hook
  (`type(scope?): subject` — e.g. `feat: …`, `fix: …`, `chore: …`).
- **Pre-commit** runs `npm run lint && npm run typecheck && npm run test:run`; commits
  are rejected on lint, type, or test errors.
- **Path alias** `@/` → `./src/` (configured in `vite.config.ts` and `tsconfig.app.json`).
- **TypeScript strictness** to be aware of:
  - `verbatimModuleSyntax` — use `import type` for type-only imports.
  - `erasableSyntaxOnly` — no TS-only runtime syntax (enums, parameter properties).
  - `allowImportingTsExtensions` — imports include extensions (e.g. `./App.tsx`).
- **Prettier**: single quotes, semicolons, 2-space indent, trailing commas (see
  `.prettierrc`). Formatting is scoped to `src/` only.

## CI/CD

- **`.github/workflows/ci.yml`** — runs `lint`, `typecheck`, and `test:run` on every
  pull request and push to `main`.
- **`.github/workflows/deploy.yml`** — builds `dist/` and deploys to GitHub Pages via
  `actions/deploy-pages`. It runs after CI succeeds on `main` (`workflow_run`) or via
  manual `workflow_dispatch`.
- Node 22 is pinned through `.nvmrc` for both workflows.

## Branching

- `main` is production and triggers the deploy pipeline.
- `develop` and `feature/*` branches are used for ongoing work; changes land via PRs
  into `main`.
