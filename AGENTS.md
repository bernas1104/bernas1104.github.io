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
- Tests in `src/__tests__/`, using `@testing-library/react` + `@testing-library/jest-dom`.

## Deploy gotchas

- **Two deploy paths that disagree — reconcile before touching either:**
  - Manual `npm run deploy` publishes `dist/` → `gh-pages` branch.
  - CI (`.github/workflows/node.js.yml`, on push to `main`) deploys via JamesIves action to the **`public`** branch from folder **`out`** — but Vite emits to **`dist/`**, so `touch ./out/.nojekyll` leaves `out` essentially empty. Fix the `out` vs `dist` mismatch and target branch if you edit CI.
- CI pins Node 18.x; current deps (Vite 8, TypeScript 6, ESLint 9) likely need a newer Node.

## Branches

- `main` is production and triggers the CI deploy. `develop` and `feature/*` branches exist; changes land via PRs into `main`.
