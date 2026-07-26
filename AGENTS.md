# AGENTS.md

Personal GitHub Pages site (`bernas1104.github.io`, package name `bernasos`): React 19 + TypeScript + Vite, tested with Vitest, auto-deployed from `main`.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build` (typechecks via project references first; output in `dist/`)
- `npm run typecheck` — `tsc -b --noEmit` (uses `-b`, don't run bare `tsc`)
- `npm run lint` / `npm run lint:fix`
- `npm run test` — Vitest watch; `npm run test:run` — single pass (use this for verification)
- Run one file: `npm run test:run -- src/App.test.tsx`
- `npm run format` / `format:check` — Prettier on **`src/` only**, not the whole repo

## Enforced conventions

- **Conventional commits required.** `commitlint` runs on the `commit-msg` hook; use `type(scope?): subject` (e.g. `feat: ...`, `fix: ...`, `chore: ...`).
- **Pre-commit runs `npm run lint && npm run typecheck && npm run test:run`.** Commits are rejected on lint, type, or test errors — fix all reported errors rather than skipping hooks.
- **Path alias `@/` → `./src/`** (set in both `vite.config.ts` and `tsconfig.app.json`); tests import like `@/App`.
- **TypeScript strictness that commonly bites:**
  - `verbatimModuleSyntax` — use `import type` for type-only imports.
  - `erasableSyntaxOnly` — no TS-only runtime syntax (enums, parameter properties).
  - `allowImportingTsExtensions` — imports include extensions, e.g. `import App from './App.tsx'`.
- Prettier: single quotes, semicolons, 2-space indent, trailing commas (see `.prettierrc`).

## Styling

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — no `tailwind.config.ts` or `postcss.config.js` needed. Theme tokens are mapped to Tailwind utilities via a `@theme` block in `src/index.css`.
- **98.css** for Windows 98 widget chrome (`.window`, `.title-bar`, `.window-body`, buttons, etc.). Never edit `node_modules/98.css` directly; overrides happen via tokens or scoped custom CSS only.
- **CSS entry point:** `src/index.css` → imports `98.css`, `./styles/tokens.css`, `./styles/global.css`, then `tailwindcss`. Import order matters (base → tokens → Tailwind).
- **Design tokens** live in `src/styles/tokens.css` as CSS custom properties (`--win98-*`). Components must reference tokens, never raw hex colors.
- **Global resets / scrollbar overrides** in `src/styles/global.css`.
- **Build caveat:** `vite.config.ts` sets `build.cssMinify: false` because lightningcss (Vite 8's default minifier) rejects 98.css's `@media (not(hover))` syntax. Tailwind purge already handles output size.

### Token-to-Tailwind mapping (in `src/index.css` `@theme` block)

| Token | Tailwind utility example |
|---|---|
| `--win98-desktop` | `bg-desktop` |
| `--win98-button-face` | `bg-button-face` |
| `--win98-window-text` | `text-window-text` |
| `--win98-font` | `font-win98` |
| `--win98-selection-bg` | `bg-selection-bg` |

## Testing

- Vitest config lives in `vite.config.ts` (no separate `vitest.config.*`); environment is `jsdom`.
- Tests colocated with source (`*.test.tsx`/`*.test.ts` next to the module), using `@testing-library/react` + `@testing-library/jest-dom`.
- **Type-level tests** use `expect-type` for compile-time assertions (no runtime logic). These run alongside regular tests via Vitest.

## Architecture

- **Shared domain primitives** live in `src/common/types.ts` (e.g. `Brand`, `Position`, `Size`, `IconName`) and are imported by feature modules. Colocated type tests use `expect-type`.
- **Feature modules** follow `src/features/<feature>/` convention: `types.ts` (domain model), `types.test.ts` (type-level tests), then components/hooks as features grow.

## Deploy gotchas

- Deployment is handled exclusively by `.github/workflows/deploy.yml` (builds `dist/` and publishes via `actions/deploy-pages` on push to `main` or manual dispatch).
- CI uses `.nvmrc` (Node 22); `package.json` also declares `engines.node >= 22.0.0`.

## Branches

- `main` is production and triggers the CI deploy. `develop` and `feature/*` branches exist; changes land via PRs into `main`.

## CI/CD

- `.github/workflows/ci.yml` — runs `lint`, `typecheck`, and `test:run` on every PR and push to `main`.
- `.github/workflows/deploy.yml` — builds `dist/` and deploys to GitHub Pages via `actions/deploy-pages` on push to `main` (or manual dispatch).
- `.nvmrc` pins the Node version for both workflows.
