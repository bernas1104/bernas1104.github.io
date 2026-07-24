# AGENTS.md

Personal GitHub Pages site (`bernas1104.github.io`, package name `bernasos`): React 19 + TypeScript + Vite, tested with Vitest, auto-deployed from `main`.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build` (typechecks via project references first; output in `dist/`)
- `npm run typecheck` — `tsc -b --noEmit` (uses `-b`, don't run bare `tsc`)
- `npm run lint` / `npm run lint:fix`
- `npm run test` — Vitest watch; `npm run test:run` — single pass (use this for verification)
- Run one file: `npm run test:run -- src/__tests__/App.test.tsx`
- `npm run format` / `format:check` — Prettier on **`src/` only**, not the whole repo
- `npm run deploy` — manual: `gh-pages -d dist` (pushes `dist/` to the `gh-pages` branch)

## Enforced conventions

- **Conventional commits required.** `commitlint` runs on the `commit-msg` hook; use `type(scope?): subject` (e.g. `feat: ...`, `fix: ...`, `chore: ...`).
- **Pre-commit runs `npm run lint && npm run typecheck`.** Commits are rejected on lint or type errors — fix all reported errors rather than skipping hooks.
- **Path alias `@/` → `./src/`** (set in both `vite.config.ts` and `tsconfig.app.json`); tests import like `@/App`.
- **TypeScript strictness that commonly bites:**
  - `verbatimModuleSyntax` — use `import type` for type-only imports.
  - `erasableSyntaxOnly` — no TS-only runtime syntax (enums, parameter properties).
  - `allowImportingTsExtensions` — imports include extensions, e.g. `import App from './App.tsx'`.
- Prettier: single quotes, semicolons, 2-space indent, trailing commas (see `.prettierrc`).

## Testing

- Vitest config lives in `vite.config.ts` (no separate `vitest.config.*`); environment is `jsdom`.
- Tests in `src/__tests__/`, using `@testing-library/react` + `@testing-library/jest-dom`.

## Deploy gotchas

- **Two deploy paths that disagree — reconcile before touching either:**
  - Manual `npm run deploy` publishes `dist/` → `gh-pages` branch.
  - CI (`.github/workflows/node.js.yml`, on push to `main`) deploys via JamesIves action to the **`public`** branch from folder **`out`** — but Vite emits to **`dist/`**, so `touch ./out/.nojekyll` leaves `out` essentially empty. Fix the `out` vs `dist` mismatch and target branch if you edit CI.
- CI pins Node 18.x; current deps (Vite 8, TypeScript 6, ESLint 10) likely need a newer Node.

## Branches

- `main` is production and triggers the CI deploy. `develop` and `feature/*` branches exist; changes land via PRs into `main`.
