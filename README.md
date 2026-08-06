# bernasos

> A Windows 98-inspired desktop personal site, built with React 19, TypeScript, and Vite.

Live site: https://bernas1104.github.io

## Overview

**bernasos** recreates a Windows 98 desktop environment in the browser as a personal
site / portfolio. Instead of a traditional scrolling page, content lives inside
draggable, resizable windows managed by a custom window manager.

The app opens with a **Windows 98-style boot / splash screen** — a full-viewport
sky-gradient splash with clouds, a wordmark, and a spinner — that auto-dismisses
after a short delay (or on click / Enter / Space) and hands off to the shell. It
plays once per browser session in production (always in development), respects
`prefers-reduced-motion`, and can be skipped via a `?skipBoot` URL param. The
shell currently renders an "under construction" placeholder; it is intended to be
replaced by the Desktop.

The window manager is a Redux-like state layer built on `useReducer` + Context
(no Redux dependency). It supports:

- **Open / close** windows, with singleton apps that reuse an existing instance; new windows **cascade** on open
- **Focus** management via a monotonic `zIndex` stack (clicking a window brings it to front); clicking the desktop background clears focus
- **Minimize / restore**, remembering the prior window state (open vs. maximized)
- **Maximize toggle** (open ⇄ maximized)
- **Desktop icons**: click to select (Win98 dashed highlight), double-click or Enter to open an app
- **Move / resize** windows (resize enforces a minimum size)
- **Taskbar** with a Start button, one entry per window (click focuses, restores, or minimizes depending on state), and a live clock
- **Start menu** that opens apps and closes on outside click or Escape
- Focus falls back to the next-highest visible window when the focused one is minimized

The Win98 look comes from [98.css](https://jdan.github.io/98.css/) for widget chrome,
layered with Tailwind CSS v4 utilities driven by Win98 design tokens.

## Tech stack

| Area        | Choice                                                  |
| ----------- | ------------------------------------------------------- |
| UI          | React 19                                                |
| Language    | TypeScript ~6 (strict)                                  |
| Build       | Vite 8                                                  |
| Styling     | Tailwind CSS v4 (`@tailwindcss/vite`) + 98.css          |
| Testing     | Vitest 4 + @testing-library/react + jsdom + expect-type |
| Lint/format | ESLint 9 + Prettier 3                                   |
| Git hooks   | Husky + commitlint (Conventional Commits)               |
| Deploy      | GitHub Pages via GitHub Actions                         |

## Project structure

```text
src/
├── App.tsx                  # Root component (boot → idle transition)
├── App.test.tsx
├── main.tsx                 # React entry point (mounts App inside WindowManagerProvider + StartMenuProvider)
├── index.css                # CSS entry: 98.css → tokens → global → tailwind
├── assets/
│   └── icons/               # Desktop icon artwork (computer_explorer-*.png, windows-4.png)
├── common/
│   ├── types.ts             # Brand, Position, Size, IconName
│   └── types.test.ts        # Type-level tests (expect-type)
├── data/                    # Personal-site content data model + placeholder data
│   ├── types.ts             # About, Cv, Project, Contact, Skill/SkillGroup, Timeline*, Link, SocialLink, Url, MonthYear
│   ├── types.test.ts        # Type-level tests (expect-type)
│   ├── about.ts             # Placeholder About content
│   ├── contact.ts           # Placeholder Contact content
│   ├── cv.ts                # Placeholder Cv content (about + contact + experience + education + skills)
│   ├── projects.ts          # Placeholder Project[] content
│   └── index.ts             # Barrel: export type for types, then data re-exports
├── features/
│   ├── boot/                # Boot / splash screen sequence
│   │   ├── types.ts                # BootStatus, BootState, BootEnvironment, BootSequenceConfig
│   │   ├── types.test.ts           # Type-level tests
│   │   ├── actions.ts              # BootAction union (SKIP | TIMEOUT) + creators
│   │   ├── actions.test.ts         # Action creator + type-level union tests
│   │   ├── reducer.ts              # bootReducer + initialBootState + createInitialBootState
│   │   ├── reducer.test.ts         # Pure reducer unit tests
│   │   ├── config.ts               # BOOT_MIN_DURATION_MS (2500ms), BOOT_PLAYED_SESSION_KEY
│   │   ├── config.test.ts
│   │   ├── useBootSequence.ts      # useReducer hook: { status, skip } + shouldPlayBootSequence
│   │   ├── useBootSequence.test.ts
│   │   ├── usePrefersReducedMotion.ts  # matchMedia hook for prefers-reduced-motion
│   │   ├── usePrefersReducedMotion.test.ts
│   │   ├── BootScreen.tsx          # Full-viewport splash (clouds + wordmark + spinner)
│   │   ├── BootScreen.test.tsx
│   │   ├── boot.css                # Splash styles (consumes --win98-boot-* tokens)
│   │   └── index.ts                # Barrel: public API
│   ├── desktop/
│   │   ├── types.ts               # AppId, WindowId, AppDescriptor, WindowInstance, DesktopState
│   │   ├── types.test.ts
│   │   ├── StartMenuContext.tsx   # Start menu { isStartMenuOpen, close, toggle } context
│   │   ├── StartMenuProvider.tsx  # useState-backed provider for the start menu
│   │   ├── testUtils.ts            # Shared test factories (makeApp, makeWindow, makeAppId, makeWindowId)
│   │   ├── components/             # Desktop chrome UI
│   │   │   ├── Desktop.tsx              # Desktop background; hosts icons + windows + taskbar + start menu
│   │   │   ├── Desktop.test.tsx
│   │   │   ├── DesktopIcon.tsx          # Selectable app icon (click / double-click / Enter)
│   │   │   ├── DesktopIcon.test.tsx
│   │   │   ├── Window.tsx              # Chrome: position/size/zIndex, focus, resize handle
│   │   │   ├── Window.test.tsx
│   │   │   ├── TitleBar.tsx            # Title + Minimize/Maximize/Restore/Close; drives drag
│   │   │   ├── TitleBar.test.tsx
│   │   │   ├── Taskbar.tsx             # Bottom bar: Start button, window buttons, clock
│   │   │   ├── Taskbar.test.tsx
│   │   │   ├── StartMenu.tsx           # Start popup; closes on outside click / Escape
│   │   │   ├── StartMenu.test.tsx
│   │   │   ├── Clock.tsx               # Live 24h HH:MM clock (60s interval)
│   │   │   └── Clock.test.tsx
│   │   ├── hooks/           # Pointer / interaction hooks
│   │   │   ├── index.ts                 # Barrel: useDrag, useResize
│   │   │   ├── useDrag.ts               # Pointer-capture drag (cumulative deltas)
│   │   │   ├── useDrag.test.ts
│   │   │   ├── useResize.ts             # Resize via useDrag (delta → new Size)
│   │   │   ├── useResize.test.ts
│   │   │   ├── useOutsideClick.ts       # Calls back on pointerdown outside a ref
│   │   │   ├── useOutsideClick.test.ts
│   │   │   ├── useStartMenu.ts          # Start menu context consumer hook
│   │   │   └── useStartMenu.test.tsx
│   │   ├── utils/          # Pure helpers
│   │   │   ├── index.ts                 # Barrel: resolveTaskbarAction
│   │   │   ├── resolveTaskbarAction.ts  # (window, focusedId) → WindowAction
│   │   │   └── resolveTaskbarAction.test.ts
│   │   └── windowManager/   # Reducer + Context state layer
│   │       ├── index.ts                 # Barrel: public API
│   │       ├── actions.ts               # WindowAction union + action creators
│   │       ├── actions.test.ts          # Action creator + type-level union tests
│   │       ├── reducer.ts               # windowsReducer + initialWindowsState + min-size constants
│   │       ├── reducer.test.ts          # Pure reducer unit tests
│   │       ├── WindowManagerContext.ts  # { state, dispatch } context
│   │       ├── WindowManagerProvider.tsx
│   │       └── useWindowManager.ts      # Consumer hook
│   └── shell/               # Idle placeholder (replaced by Desktop later)
│       ├── IdleScreen.tsx        # Full-viewport "under construction" status
│       ├── IdleScreen.test.tsx
│       ├── idleScreen.css        # Idle screen styles
│       └── index.ts             # Barrel: IdleScreen
├── styles/
│   ├── tokens.css           # Win98 design tokens (palette, type, spacing, z-index, boot)
│   └── global.css           # Desktop chrome: overflow lock, resize handle, icon selection, taskbar, start menu, clock
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

| Script                  | Description                                     |
| ----------------------- | ----------------------------------------------- |
| `npm run dev`           | Start the Vite dev server with HMR              |
| `npm run build`         | Type-check (`tsc -b`) then build to `dist/`     |
| `npm run preview`       | Preview the production build locally            |
| `npm run typecheck`     | Type-check without emitting (`tsc -b --noEmit`) |
| `npm run lint`          | Lint with ESLint                                |
| `npm run lint:fix`      | Lint and auto-fix                               |
| `npm run test`          | Run Vitest in watch mode                        |
| `npm run test:run`      | Run tests once (used by CI and pre-commit)      |
| `npm run test:coverage` | Run tests with v8 coverage                      |
| `npm run format`        | Format `src/` with Prettier                     |
| `npm run format:check`  | Check `src/` formatting without writing         |

## Architecture

### Feature modules

Code is organized into feature modules under `src/features/<feature>/`. Each feature
owns its domain model in `types.ts` (with colocated type-level tests in `types.test.ts`)
and grows components/hooks/utils as needed. Features can nest sub-modules —
`src/features/desktop/` owns the desktop domain and contains the `windowManager/`
(state) and `utils/` (pure helpers) sub-modules. `src/features/boot/` (splash sequence)
and `src/features/shell/` (idle placeholder) are top-level features. Every module
exposes its public API through a barrel `index.ts`; import from the barrel rather than
internal files:

```ts
import { useWindowManager, openApp } from '@/features/desktop/windowManager/index.ts';
```

### Content data model

The personal-site content lives in `src/data/` — a top-level module alongside
`src/common/` (not a feature module). It's framework-agnostic content intended to be
consumed by future UI features, decoupled from the window/desktop domain:

- **`types.ts`** defines the content domain. Two branded string types — `Url` and
  `MonthYear` (built on `Brand` from `@/common/types.ts`) — keep URL- and date-shaped
  strings type-distinct. The core types are `About`, `Level`
  (`'beginner' | 'intermediate' | 'advanced' | 'expert'`), `Skill` / `SkillGroup`,
  `Period`, `TimelineEntry`, `ExperienceEntry` (extends `TimelineEntry` with
  `description` / `bullets` / `location`), `EducationEntry` (an alias of
  `TimelineEntry`), `Link`, `Project`, `SocialLink` (carrying an `IconName` from
  `@/common/types.ts`), `Contact`, and `Cv` (which bundles `About` + `Contact` +
  experience + education + skills).
- **`types.test.ts`** is a colocated type-level test using `expect-type` /
  `expectTypeOf` to assert each type's shape and the branded / extension
  relationships above. No runtime logic.
- **`about.ts`** / **`contact.ts`** / **`cv.ts`** / **`projects.ts`** export
  placeholder content (each marked with a `// PLACEHOLDER` comment) to be replaced
  with real data.
- **`index.ts`** is the barrel: `export type` for the types (required by
  `verbatimModuleSyntax`), then the data re-exports.

### Window manager (reducer + Context)

The window manager follows a Redux-like pattern without Redux:

- **`actions.ts`** defines a `WindowAction` discriminated union and action creators
  (`openApp`, `closeWindow`, `focusWindow`, `minimizeWindow`, `toggleMaximizeWindow`,
  `moveWindow`, `resizeWindow`, `restoreWindow`, `clearFocus`). `CLEAR_FOCUS` is a
  payload-less action that clears the focused window.
- **`reducer.ts`** holds a pure `windowsReducer` and `initialWindowsState`. The reducer
  transitions `DesktopState` and never mutates: `windows` is a `ReadonlyMap` and each
  case builds a `new Map(state.windows)` before `.set`/`.delete`. No-op cases (focusing
  a missing or minimized window) return the same state reference. Exhaustiveness is
  enforced at compile time via `action satisfies never` in the `default` branch. It
  also exports `MIN_WINDOW_WIDTH` / `MIN_WINDOW_HEIGHT` — `RESIZE_WINDOW` clamps to
  them — and `OPEN_APP` cascades new windows (`(windowsOpenedCount % 8) * 24`px offset
  from 100,100) while incrementing `windowsOpenedCount`; `CLOSE_WINDOW` decrements it
  so the cascade offset stays correct as windows open and close. `CLEAR_FOCUS` sets
  `focusedWindowId` back to `null` and returns the same state reference when nothing
  is focused.
- **`WindowManagerProvider.tsx`** wires `useReducer(windowsReducer, initialWindowsState)`
  into a Context, exposing `{ state, dispatch }`. It is mounted in `src/main.tsx`,
  wrapping `<App />` together with a nested `StartMenuProvider`.
- **`useWindowManager.ts`** consumes the context and throws if used outside the provider.

### Start menu state

The start menu is a separate, simpler state layer (not part of the window manager
reducer):

- **`StartMenuContext.tsx`** / **`StartMenuProvider.tsx`** hold a single `useState`
  boolean (`isStartMenuOpen`) and expose `{ isStartMenuOpen, closeStartMenu,
  onStartMenuToggle }`. The provider is mounted in `src/main.tsx` inside the
  `WindowManagerProvider`.
- **`useStartMenu.ts`** consumes the context and throws if used outside the provider.

### Boot sequence

The boot sequence (`src/features/boot/`) drives the splash → idle transition at the
top of the app. Unlike the window manager it uses a **hook-local `useReducer`** —
there is no Context provider, the state stays inside the hook:

- **`types.ts`** defines `BootStatus` (`'booting' | 'dismissed'`), `BootState`,
  `BootEnvironment` (`{ isDevelopment, isTest }`), and `BootSequenceConfig`.
- **`actions.ts`** defines a `BootAction` union (`SKIP` | `TIMEOUT`, both payload-less)
  and the `skipBoot` / `timeoutBoot` creators.
- **`reducer.ts`** holds a pure `bootReducer`, `initialBootState`, and
  `createInitialBootState(shouldPlay)`. Both actions transition `booting`→`dismissed`
  and no-op (return the same state reference) when already dismissed. Exhaustiveness
  is enforced via `action satisfies never` in the `default` branch.
- **`config.ts`** exports `BOOT_MIN_DURATION_MS` (2500ms) and
  `BOOT_PLAYED_SESSION_KEY` (`'bernasos:bootPlayed'`).
- **`useBootSequence.ts`** is the `useReducer`-backed hook returning
  `{ status, skip }`. The pure helper
  `shouldPlayBootSequence(environment, sessionHasPlayed, skipRequested)` decides
  whether to play: dev/test always play; production plays once per session unless the
  `?skipBoot` URL param is present. The hook schedules a `TIMEOUT` dismissal after
  `minDurationMs`, clears the timer on unmount, and persists the played flag to
  `sessionStorage` only in production.
- **`usePrefersReducedMotion.ts`** subscribes to `(prefers-reduced-motion: reduce)`
  via `matchMedia`, returns a boolean, and cleans up the listener on unmount.
- **`BootScreen.tsx`** + **`boot.css`** render the full-viewport splash (sky-gradient
  + clouds + wordmark + spinner) with `role="status"` (`aria-label="BernasOS
  loading"`). It skips on click / Enter / Space and dismisses immediately when
  `prefersReducedMotion` is set. `boot.css` consumes the `--win98-boot-*` tokens and
  disables the spinner animation under reduced motion.

### Shell (idle placeholder)

The shell (`src/features/shell/`) is a placeholder for the post-boot UI:

- **`IdleScreen.tsx`** + **`idleScreen.css`** render a full-viewport "under
  construction" status (`role="status"`, `aria-label="BernasOS idle screen"`). It is
  shown after the boot sequence dismisses and is intended to be replaced by the
  Desktop.

`src/App.tsx` ties the two together: it renders `<BootScreen>` while `useBootSequence`
reports `booting`, then `<IdleScreen>` once `dismissed`. (`src/main.tsx` still mounts
the `WindowManagerProvider` + `StartMenuProvider` around `<App />`; the idle
placeholder doesn't consume them yet.)

### Pure helpers

`src/features/desktop/utils/` holds framework-agnostic helpers exposed through a
barrel `index.ts`:

- **`resolveTaskbarAction(window, focusedWindowId)`** maps a taskbar-button click to
  the right `WindowAction`: `RESTORE_WINDOW` if the window is minimized, else
  `FOCUS_WINDOW` if it isn't focused, else `MINIMIZE_WINDOW`.

### Components & interaction hooks

The presentation layer lives in `src/features/desktop/components/` and
`src/features/desktop/hooks/`, consuming the window manager via `useWindowManager`
and the start menu via `useStartMenu`:

- **`Window.tsx`** renders the `.window` chrome, applying `position`, `size`, and
  `zIndex` from `WindowInstance` (maximized fills the viewport). It dispatches
  `FOCUS_WINDOW` on pointer down, stops click propagation so desktop clicks don't
  clear focus, renders a `.window-resize-handle` for resizable non-maximized apps,
  and disables geometry CSS transitions while a drag/resize is in progress.
- **`TitleBar.tsx`** renders the title and Minimize / Maximize / Restore / Close
  controls (dispatching the matching actions) and drives window dragging via `useDrag`.
  It adds the `inactive` class when unfocused and stops propagation on controls so
  clicking a button doesn't start a drag.
- **`Desktop.tsx`** renders the desktop background and hosts the `DesktopIcon`,
  non-minimized windows (sorted by z-index), the `Taskbar`, and the `StartMenu`. Any
  click on the background dispatches `CLEAR_FOCUS`; child components stop propagation
  themselves so their clicks don't bubble up.
- **`DesktopIcon.tsx`** is a keyboard-focusable app icon (`role="button"`,
  `tabIndex={0}`, 48×48 artwork): single click selects it (Win98 dashed outline),
  double-click or Enter dispatches `OPEN_APP`. Icon artwork lives in `src/assets/icons/`.
- **`Taskbar.tsx`** is the fixed bottom bar: a Start button that toggles the start
  menu, one button per window (sorted by ascending z-index, focused window gets the
  `focused` class), and a `Clock`. Clicking a window button dispatches the action
  returned by `resolveTaskbarAction`.
- **`StartMenu.tsx`** is the start menu popup (sidebar + items), shown when
  `isStartMenuOpen`. It closes on outside pointerdown (via `useOutsideClick`) and on
  Escape; menu items dispatch `OPEN_APP` and then close. It stacks with the
  `--win98-z-index-start-menu` token when no window is focused, otherwise it stacks
  naturally with the windows.
- **`Clock.tsx`** is a live 24-hour `HH:MM` clock that aligns its first update to
  the next minute boundary, then refreshes on a 60-second interval
  (`aria-label="Current time"`).
- **`useDrag`** is a pointer-based drag hook: it captures the pointer, reports the
  cumulative delta from drag start on each `pointermove`, signals drag state changes
  via an optional callback, is a no-op when the window is maximized, and cleans up
  listeners (signaling drag end) if the component unmounts mid-drag.
- **`useResize`** wraps `useDrag`, converting the cumulative delta into a new `Size`
  (`window.size + delta`). Its callback is `onResize(windowId, size: Size)`.
- **`useOutsideClick`** invokes a callback when a `pointerdown` lands outside the
  referenced element. It's gated by an `enabled` flag and keeps the latest callback
  via a ref so re-renders don't re-subscribe.

### Domain model

Domain types live in `src/common/types.ts` (`Brand`, `Position`, `Size`, `IconName`),
`src/features/desktop/types.ts` (`AppId`, `WindowId`, `AppDescriptor`,
`WindowInstance`, `DesktopState`), and `src/data/types.ts` (the personal-site content
domain — see [Content data model](#content-data-model) above). IDs are branded
(`Brand<string, 'WindowId'>`) so `WindowId` and `AppId` are not interchangeable — they're
cast to the branded type only at the boundary (`crypto.randomUUID() as WindowId`).

### Styling

- **98.css** provides the Windows 98 widget chrome (`.window`, `.title-bar`,
  `.window-body`, buttons, etc.).
- **`src/styles/tokens.css`** centralizes the Win98 palette, typography (font stack
  begins with `'Pixelated MS Sans Serif'`), spacing scale, a z-index scale
  (`--win98-z-index-start-menu`), and a boot/splash palette
  (`--win98-boot-sky-top`, `--win98-boot-sky-bottom`, `--win98-boot-cloud`) as
  `--win98-*` CSS custom properties. Components reference tokens, never raw hex
  colors.
- **`src/styles/global.css`** adds desktop chrome: body overflow lock, `.desktop`
  background layer, `.window-resize-handle`, the desktop-icon selection styles
  (`.desktop-icon-container`, `.icon-selected`, `.icon-text-selected`), the taskbar /
  start-menu / clock chrome (`.taskbar`, `.start-menu`, `.clock`, …), and a global
  `font-family: var(--win98-font)`. Desktop icon labels use the `--win98-desktop-text`
  token.
- **Feature-scoped CSS:** some features colocate a stylesheet next to the component
  and import it directly (e.g. `src/features/boot/boot.css`,
  `src/features/shell/idleScreen.css`). These consume `--win98-*` tokens via `var()`
  and are intentionally not mapped into Tailwind's `@theme` — keep them feature-local.
- **`src/index.css`** maps those tokens into Tailwind v4 via a `@theme` block, so
  utilities like `bg-desktop`, `text-window-text`, and `font-win98` work. Import order
  matters: `98.css` → `tokens.css` → `global.css` → `tailwindcss`. Not every token
  maps to a utility — `--win98-desktop-text`, `--win98-z-index-start-menu`, and the
  `--win98-boot-*` palette are consumed directly via `var()`.

## Testing

- Vitest config lives in `vite.config.ts` (jsdom environment); tests are colocated with
  source as `*.test.ts` / `*.test.tsx`. Shared test factories live in
  `src/features/desktop/testUtils.ts` (`makeApp`, `makeWindow`, `makeAppId`,
  `makeWindowId`); each component test file defines its own local `makeState`.
- **Component tests** (`Window`, `TitleBar`, `Desktop`, `DesktopIcon`, `Taskbar`,
  `StartMenu`) use `@testing-library/react` + `@testing-library/jest-dom`,
  rendering through a `WindowManagerContext.Provider` with a `vi.fn` dispatch to
  assert dispatched actions and rendered chrome — the provider is required only
  for components that consume that context. `Desktop`, `Taskbar`, and `StartMenu`
  tests additionally wrap in a `StartMenuContext.Provider`. `Clock` tests are
  separate: they render `Clock` directly (it consumes no context), using fake
  timers to drive the minute-boundary update and the 60-second refresh and to
  assert timer cleanup on unmount. `BootScreen` and `IdleScreen` also render
  directly (no context): `BootScreen` tests assert the accessible status region,
  click/Enter/Space skip handlers, window-listener attach/remove on
  mount/unmount, and immediate dismiss when `prefersReducedMotion` is set;
  `IdleScreen` tests assert the status region and placeholder chrome.
- **Pointer-interaction hook tests** (`useDrag`, `useResize`, `useOutsideClick`) use
  `renderHook` with a manually created DOM element ref and synthetic `PointerEvent`s
  to cover cumulative deltas, pointer capture, drag-state callbacks, unmount cleanup,
  and maximized no-ops. `useOutsideClick` also covers the `enabled` flag and listener
  (re)subscription.
- **Context hook tests** (`useStartMenu`) use `renderHook` through a
  `StartMenuContext.Provider`, asserting the returned handlers (including updated
  context values on re-render) and that the hook throws outside a `StartMenuProvider`.
- **Boot hook tests** (`useBootSequence.test.ts`, `usePrefersReducedMotion.test.ts`)
  use `renderHook`. `useBootSequence` tests cover the pure
  `shouldPlayBootSequence(environment, sessionHasPlayed, skipRequested)` helper
  (dev/test always play; production plays once per session unless the `?skipBoot`
  URL param is present) and the hook itself with fake timers, `sessionStorage`, and
  `window.history` — asserting the `booting`→`dismissed` timeout, timeout cleanup on
  unmount, and that the played flag is persisted to `sessionStorage` only in
  production. `usePrefersReducedMotion` tests stub `window.matchMedia`, asserting
  the initial matches value, change-event updates, and listener
  subscribe/unsubscribe.
- **App tests** (`App.test.tsx`) use fake timers and mock `usePrefersReducedMotion`
  to assert the boot→idle transition: the boot screen renders first, auto-dismisses
  after `BOOT_MIN_DURATION_MS`, dismisses on click, and dismisses immediately when
  reduced motion is preferred. `sessionStorage` and `window.history` are reset
  between tests.
- **Type-level tests** use `expect-type` for compile-time assertions (no runtime logic).
- **Action creator tests** (`windowManager/actions.test.ts`, `boot/actions.test.ts`)
  assert each creator's output and, via `expect-type`, that every creator returns a
  member of its action union (`WindowAction` / `BootAction`) and that the union is
  discriminated by the expected type literals.
- **Pure helper tests** (`utils/resolveTaskbarAction.test.ts`) assert the helper's
  output per (window state, focused id) combination and, via `expect-type`, that its
  return type is exactly `WindowAction`.
- **Data model type tests** (`data/types.test.ts`) are pure type-level tests using
  `expectTypeOf` to assert each content type's shape (and that `Url` / `MonthYear` are
  branded, `ExperienceEntry` extends `TimelineEntry`, `EducationEntry` equals
  `TimelineEntry`). No runtime logic.
- **Reducer unit tests** exercise the pure reducer directly (no React render). The
  `windowsReducer` tests use the shared factory helpers and mock `crypto.randomUUID`
  for deterministic IDs; the `bootReducer` tests drive `initialBootState` /
  `createInitialBootState` directly. No-op cases are asserted with referential
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
