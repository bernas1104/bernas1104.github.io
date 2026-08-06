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
- **Path alias `@/` → `./src/`** (set in both `vite.config.ts` and `tsconfig.app.json`); tests import like `@/App.ts`.
- **TypeScript strictness that commonly bites:**
  - `verbatimModuleSyntax` — use `import type` for type-only imports.
  - `erasableSyntaxOnly` — no TS-only runtime syntax (enums, parameter properties).
  - `allowImportingTsExtensions` — imports include extensions, e.g. `import App from './App.tsx'`.
- Prettier: single quotes, semicolons, 2-space indent, trailing commas (see `.prettierrc`).

## Styling

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — no `tailwind.config.ts` or `postcss.config.js` needed. Theme tokens are mapped to Tailwind utilities via a `@theme` block in `src/index.css`.
- **98.css** for Windows 98 widget chrome (`.window`, `.title-bar`, `.window-body`, buttons, etc.). Never edit `node_modules/98.css` directly; overrides happen via tokens or scoped custom CSS only.
- **CSS entry point:** `src/index.css` → imports `98.css`, `./styles/tokens.css`, `./styles/global.css`, then `tailwindcss`. Import order matters (base → tokens → Tailwind).
- **Design tokens** live in `src/styles/tokens.css` as CSS custom properties (`--win98-*`): palette, typography (font stack begins with `'Pixelated MS Sans Serif'`), spacing scale, a z-index scale (`--win98-z-index-start-menu: 10000`), and a boot/splash palette (`--win98-boot-sky-top`, `--win98-boot-sky-bottom`, `--win98-boot-cloud`). Components must reference tokens, never raw hex colors.
- **Global styles** in `src/styles/global.css`: body overflow lock, `.desktop` background layer, `.window-resize-handle`, `.title-bar-text`, desktop-icon selection styling (`.icon-selected`, `.icon-text-selected`, `.desktop-icon-container`), taskbar/start-menu/clock chrome (`.taskbar`, `.start-menu`, `.clock`, etc.), and a global `font-family: var(--win98-font)` on `*`.
- **Feature-scoped CSS:** some features colocate a stylesheet next to the component and import it directly (e.g. `src/features/boot/boot.css`, `src/features/shell/idleScreen.css`). These consume `--win98-*` tokens via `var()` and are intentionally not mapped into Tailwind's `@theme` — keep them feature-local.
- **Build caveat:** `vite.config.ts` sets `build.cssMinify: false` because lightningcss (Vite 8's default minifier) rejects 98.css's `@media (not(hover))` syntax. Tailwind purge already handles output size.

### Token-to-Tailwind mapping (in `src/index.css` `@theme` block)

| Token                  | Tailwind utility example |
| ---------------------- | ------------------------ |
| `--win98-desktop`      | `bg-desktop`             |
| `--win98-button-face`  | `bg-button-face`         |
| `--win98-window-text`  | `text-window-text`       |
| `--win98-font`         | `font-win98`             |
| `--win98-selection-bg` | `bg-selection-bg`        |

Not every token maps to a utility — `--win98-desktop-text` (desktop icon labels), `--win98-z-index-start-menu` (start menu stacking), and the `--win98-boot-*` palette (consumed by `src/features/boot/boot.css`) are consumed directly via `var()` in components/`global.css`/feature stylesheets.

## Testing

- Vitest config lives in `vite.config.ts` (no separate `vitest.config.*`); environment is `jsdom`.
- Tests colocated with source (`*.test.tsx`/`*.test.ts` next to the module), using `@testing-library/react` + `@testing-library/jest-dom`.
- **Type-level tests** use `expect-type` for compile-time assertions (no runtime logic). These run alongside regular tests via Vitest.
- **Action creator tests** (`windowManager/actions.test.ts`, `boot/actions.test.ts`) assert each creator's output and, via `expect-type`, that every creator returns a member of its action union (`WindowAction` / `BootAction`) and that the union is discriminated by the expected type literals.
- **Reducer unit tests** exercise pure reducers directly (no React render). The `windowsReducer` tests use shared factory helpers from `src/features/desktop/testUtils.ts` (`makeApp`, `makeWindow`, `makeAppId`, `makeWindowId`) and mock `crypto.randomUUID` for deterministic IDs; component tests define a local `makeState` per file. The `bootReducer` tests drive `initialBootState` / `createInitialBootState` directly. Assert no-op cases with referential equality (`expect(next).toBe(state)`), and assert immutability (the prior `windows` map / `status` field is untouched).
- **Pure utility tests** (`utils/resolveTaskbarAction.test.ts`) assert the helper's runtime output per (window state, focused id) combination and, via `expect-type`, that its return type is exactly `WindowAction`.
- **Component tests** (`Window`, `TitleBar`, `Desktop`, `DesktopIcon`, `Taskbar`, `StartMenu`) render through a `WindowManagerContext.Provider` with a `vi.fn` dispatch and assert dispatched actions / rendered chrome — the provider is required only for components that consume that context. `Desktop`, `Taskbar`, and `StartMenu` tests additionally wrap in a `StartMenuContext.Provider`. `Clock` tests are separate: they render `Clock` directly (it consumes no context), using fake timers (`vi.useFakeTimers` + `vi.setSystemTime`) to drive the minute-boundary update and the 60-second refresh, and asserting timer cleanup on unmount. `BootScreen` and `IdleScreen` also render directly (no context): `BootScreen` tests assert the accessible status region, click/Enter/Space skip handlers, window-listener attach/remove on mount/unmount, and immediate dismiss when `prefersReducedMotion` is set; `IdleScreen` tests assert the status region and placeholder chrome.
- **Pointer-interaction hook tests** (`useDrag`, `useResize`, `useOutsideClick`) use `renderHook` with a manually created DOM element ref, dispatch synthetic `PointerEvent`s, and cover pointer capture, cumulative deltas, drag-state callbacks, unmount cleanup, and maximized no-ops. `useOutsideClick` additionally covers the `enabled` flag (subscribe/unsubscribe on toggle), listener cleanup on unmount, and invoking the latest callback via a ref.
- **Context hook tests** (`useStartMenu`) use `renderHook` through a `StartMenuContext.Provider` to assert the returned handlers (including updated context values on re-render) and the outside-provider error assertion (throws without a provider).
- **Boot hook tests** (`useBootSequence.test.ts`, `usePrefersReducedMotion.test.ts`) use `renderHook`. `useBootSequence` tests cover the pure `shouldPlayBootSequence(environment, sessionHasPlayed, skipRequested)` helper (dev/test always play; production plays once per session unless the `?skipBoot` URL param is present) and the hook itself with fake timers, `sessionStorage`, and `window.history` — asserting the `booting`→`dismissed` timeout, timeout cleanup on unmount, and that the played flag is persisted to `sessionStorage` only in production. `usePrefersReducedMotion` tests stub `window.matchMedia`, asserting the initial matches value, change-event updates, and listener subscribe/unsubscribe.
- **App tests** (`App.test.tsx`) use fake timers and mock `usePrefersReducedMotion` to assert the boot→idle transition: the boot screen renders first, auto-dismisses after `BOOT_MIN_DURATION_MS`, dismisses on click, and dismisses immediately when reduced motion is preferred. `sessionStorage` and `window.history` are reset between tests.

## Architecture

- **Shared domain primitives** live in `src/common/types.ts` (e.g. `Brand`, `Position`, `Size`, `IconName`) and are imported by feature modules. Colocated type tests use `expect-type`.
- **Feature modules** follow `src/features/<feature>/` convention: `types.ts` (domain model), `types.test.ts` (type-level tests), then components/hooks/utils as features grow. Features can nest sub-modules — e.g. `src/features/desktop/` owns the desktop domain (`types.ts`) and contains `windowManager/` (state) and `utils/` (pure helpers) as sub-modules. `src/features/boot/` (splash sequence) and `src/features/shell/` (idle placeholder) are top-level features.
- **Barrel `index.ts`** files expose each module's public API. Import from the barrel, not internal files — e.g. `import { useWindowManager } from '@/features/desktop/windowManager/index.ts'`. Re-export types with `export type` (required by `verbatimModuleSyntax`).
- **Stateful sub-features use a reducer + Context pattern** (Redux-like, without Redux). `windowManager/` is the reference implementation:
  - `actions.ts` — action creators plus a `WindowAction` discriminated union (including the payload-less `CLEAR_FOCUS`).
  - `reducer.ts` — pure `windowsReducer` + `initialWindowsState`; exhaustiveness is enforced with `action satisfies never` in the `default` branch. Exports `MIN_WINDOW_WIDTH` / `MIN_WINDOW_HEIGHT` (`RESIZE_WINDOW` clamps to them); `OPEN_APP` cascades new windows (`(windowsOpenedCount % 8) * 24`px offset) and increments `windowsOpenedCount`; `CLOSE_WINDOW` decrements it (keeps the cascade offset correct as windows open/close); `CLEAR_FOCUS` nulls `focusedWindowId` (no-op → same state reference when already null).
  - `WindowManagerContext.ts` / `WindowManagerProvider.tsx` — `useReducer`-backed context providing `{ state, dispatch }`; mounted in `src/main.tsx` wrapping `<App />` (with a `StartMenuProvider` nested inside).
  - `useWindowManager.ts` — consumer hook that throws if used outside the provider.
- **Start menu state** is a separate, simpler `useState`-based Context (not part of the window manager reducer): `StartMenuContext.tsx` / `StartMenuProvider.tsx` expose `{ isStartMenuOpen, closeStartMenu, onStartMenuToggle }`; `useStartMenu.ts` consumes it and throws outside the provider. Mounted in `src/main.tsx` inside the `WindowManagerProvider`.
- **Boot sequence** (`src/features/boot/`) drives the splash → idle transition at the top of the app. Unlike the window manager it uses a hook-local `useReducer` (no Context provider — state stays inside the hook):
  - `types.ts` — `BootStatus` (`'booting' | 'dismissed'`), `BootState`, `BootEnvironment`, `BootSequenceConfig`.
  - `actions.ts` — `BootAction` union (`SKIP` | `TIMEOUT`, both payload-less) + `skipBoot` / `timeoutBoot` creators.
  - `reducer.ts` — pure `bootReducer` + `initialBootState` + `createInitialBootState(shouldPlay)`; both actions transition `booting`→`dismissed` and no-op (same state reference) when already dismissed; exhaustiveness via `action satisfies never`.
  - `config.ts` — `BOOT_MIN_DURATION_MS` (2500ms) + `BOOT_PLAYED_SESSION_KEY` (`'bernasos:bootPlayed'`).
  - `useBootSequence.ts` — `useReducer`-backed hook returning `{ status, skip }`; pure helper `shouldPlayBootSequence(environment, sessionHasPlayed, skipRequested)` (dev/test always play; production plays once per session unless the `?skipBoot` URL param is present); schedules a `TIMEOUT` dismissal after `minDurationMs` and clears the timer on unmount; persists the played flag to `sessionStorage` only in production.
  - `usePrefersReducedMotion.ts` — subscribes to `(prefers-reduced-motion: reduce)` via `matchMedia`, returns a boolean, cleans up the listener on unmount.
  - `BootScreen.tsx` + `boot.css` — full-viewport splash (sky-gradient + clouds + wordmark + spinner) with `role="status"` (`aria-label="BernasOS loading"`); skips on click/Enter/Space and dismisses immediately when `prefersReducedMotion` is set; `boot.css` consumes the `--win98-boot-*` tokens and disables the spinner animation under reduced motion.
- **Shell placeholder** (`src/features/shell/`): `IdleScreen.tsx` + `idleScreen.css` render a full-viewport "under construction" status (`role="status"`, `aria-label="BernasOS idle screen"`) — a placeholder shown after the boot sequence dismisses, intended to be replaced by the Desktop.
- **App composition:** `src/App.tsx` renders `<BootScreen>` while `useBootSequence` reports `booting`, then `<IdleScreen>` once `dismissed` — driving the splash → idle transition. (`src/main.tsx` still mounts `WindowManagerProvider` + `StartMenuProvider` around `<App />`; the idle placeholder doesn't consume them yet.)
- **Pure helpers** live in `src/features/desktop/utils/` with a barrel `index.ts`. `resolveTaskbarAction(window, focusedWindowId)` maps a taskbar-button click to a `WindowAction` (`RESTORE_WINDOW` if minimized, else `FOCUS_WINDOW` if not focused, else `MINIMIZE_WINDOW`).
- **Presentation layer** lives in `src/features/desktop/components/` + `src/features/desktop/hooks/`, consuming the window manager via `useWindowManager` and the start menu via `useStartMenu`:
  - `Window.tsx` — `.window` chrome (position/size/zIndex from `WindowInstance`, maximized fills viewport), dispatches `FOCUS_WINDOW` on pointer down, stops click propagation so desktop clicks don't clear focus, renders a `.window-resize-handle` for resizable non-maximized apps, disables geometry CSS transitions during drag/resize.
  - `TitleBar.tsx` — title + Minimize/Maximize/Restore/Close controls (dispatching matching actions); drives dragging via `useDrag`; adds `inactive` when unfocused and stops propagation on controls.
  - `Desktop.tsx` — desktop background hosting windows, icons, the `Taskbar`, and the `StartMenu`; renders non-minimized windows sorted by z-index and dispatches `CLEAR_FOCUS` on any background click (child components stop propagation themselves).
  - `DesktopIcon.tsx` — keyboard-focusable app icon (`role="button"`, 48×48 artwork); single-click selects (Win98 dashed selection), double-click or Enter dispatches `OPEN_APP`. Icon artwork lives in `src/assets/icons/`.
  - `Taskbar.tsx` — fixed bottom bar with a Start button (toggles the start menu), one button per window sorted by ascending z-index (focused window gets the `focused` class), and a `Clock`. Taskbar-button clicks dispatch the action returned by `resolveTaskbarAction`.
  - `StartMenu.tsx` — popup menu (sidebar + items) shown when `isStartMenuOpen`; closes on outside pointerdown (`useOutsideClick`) and Escape; menu items dispatch `OPEN_APP` then close. Uses the `--win98-z-index-start-menu` token when no window is focused, otherwise stacks naturally.
  - `Clock.tsx` — live 24-hour HH:MM clock aligned to the next minute boundary, then refreshed on a 60-second interval (`aria-label="Current time"`).
  - `useDrag` (`hooks/useDrag.ts`) — pointer-capture drag reporting cumulative deltas from drag start; optional `onDragStateChange` callback; no-op when maximized; cleans up listeners (and signals drag end) on unmount via a `finishRef` + `useEffect`. Barrel at `hooks/index.ts`.
  - `useResize` (`hooks/useResize.ts`) — wraps `useDrag`, converting deltas to a new `Size` (`window.size + delta`); callback signature `onResize(windowId, size: Size)`.
  - `useOutsideClick` (`hooks/useOutsideClick.ts`) — calls a callback on document `pointerdown` outside the ref element; gated by an `enabled` flag; keeps the latest callback via a ref. Imported directly (not via the hooks barrel).
- **State immutability:** the reducer never mutates. `windows` is a `ReadonlyMap` and each case builds `new Map(state.windows)` before `.set`/`.delete`. No-op cases (e.g. focusing a missing or minimized window) return the **same state reference** — rely on referential equality for bailouts.
- **Branded IDs** (`WindowId`, `AppId` via `Brand<string, …>`) keep IDs type-distinct; cast at the boundary only (`crypto.randomUUID() as WindowId`).

## Deploy gotchas

- Deployment is handled exclusively by `.github/workflows/deploy.yml` (builds `dist/` and publishes via `actions/deploy-pages` after CI succeeds on `main`, or via manual `workflow_dispatch`).
- CI uses `.nvmrc` (Node 22); `package.json` also declares `engines.node >= 22.0.0`.

## Branches

- `main` is production and triggers the CI deploy. `develop` and `feature/*` branches exist; changes land via PRs into `main`.

## CI/CD

- `.github/workflows/ci.yml` — runs `lint`, `typecheck`, and `test:run` on every PR and push to `main`.
- `.github/workflows/deploy.yml` — builds `dist/` and deploys to GitHub Pages via `actions/deploy-pages` after CI succeeds on `main` (`workflow_run`) or via manual `workflow_dispatch`.
- `.nvmrc` pins the Node version for both workflows.
