# bernasos

> A Windows 98-inspired desktop personal site, built with React 19, TypeScript, and Vite.

Live site: https://bernas1104.github.io

## Overview

**bernasos** recreates a Windows 98 desktop environment in the browser as a personal
site / portfolio. Instead of a traditional scrolling page, content lives inside
draggable, resizable windows managed by a custom window manager.

The app opens with a **Windows 98-style boot / splash screen** — a full-viewport
sky-gradient splash with clouds, a wordmark, and a spinner — that auto-dismisses
after a short delay (or on click / Enter / Space) and hands off to the **Desktop**.
It plays once per browser session in production (always in development), respects
`prefers-reduced-motion`, and can be skipped via a `?skipBoot` URL param.

Apps (My Computer, About, CV, Projects, Contact, Terminal) are registered in an
**app registry** with code-split (`React.lazy`) components, and the URL hash mirrors
the focused app — so deep-linking to `/#/projects` opens the Projects window.

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
- **App registry & deep-linking**: apps are declared in `appRegistry` with code-split components; the URL hash mirrors the focused app and a bidirectional route sync keeps the URL and window state in lockstep
- Focus falls back to the next-highest visible window when the focused one is minimized

The Win98 look comes from [98.css](https://jdan.github.io/98.css/) for widget chrome,
layered with Tailwind CSS v4 utilities driven by Win98 design tokens.

## Tech stack

| Area        | Choice                                                  |
| ----------- | ------------------------------------------------------- |
| UI          | React 19                                                |
| Language    | TypeScript ~6 (strict)                                  |
| Build       | Vite 8                                                  |
| Routing     | React Router 8 (hash router)                            |
| Styling     | Tailwind CSS v4 (`@tailwindcss/vite`) + 98.css          |
| Testing     | Vitest 4 + @testing-library/react + jsdom + expect-type |
| Lint/format | ESLint 9 + Prettier 3                                   |
| Git hooks   | Husky + commitlint (Conventional Commits)               |
| Deploy      | GitHub Pages via GitHub Actions                         |

## Project structure

```text
src/
├── App.tsx                  # Root component (boot → desktop transition)
├── App.test.tsx
├── AppShell.tsx             # Route component: WindowManagerProvider + StartMenuProvider around App
├── main.tsx                 # React entry point (mounts RouterProvider with the hash router)
├── index.css                # CSS entry: 98.css → tokens → global → tailwind
├── assets/
│   ├── avatar.jpeg          # About/CV app avatar
│   └── icons/               # Desktop/app icon artwork (computer_explorer-*.png, ms_dos-*.png, github.png, linkedin.png, …)
├── common/
│   ├── types.ts             # Brand, Position, Size, IconName
│   ├── types.test.ts        # Type-level tests (expect-type)
│   └── icons.ts             # iconMap: IconName → imported icon asset
├── data/                    # Personal-site content data model + placeholder data
│   ├── types.ts             # About, Cv, Project, Contact, Skill/SkillGroup, Timeline*, Link, SocialLink, Url, MonthYear
│   ├── types.test.ts        # Type-level tests (expect-type)
│   ├── about.ts             # Real About content (name/role/summary/avatar)
│   ├── contact.ts           # Real Contact content (email, location, GitHub + LinkedIn socials)
│   ├── cv.ts                # Real Cv content (about + contact + experience + education + skills)
│   ├── projects.ts          # Placeholder Project[] content
│   └── index.ts             # Barrel: export type for types, then data re-exports
├── apps/                    # App registry, routing, and route ↔ state sync
│   ├── about/                    # About app (real content)
│   │   ├── AboutApp.tsx               # Tree-view bio + avatar, sourced from src/data/about.ts
│   │   ├── AboutApp.test.tsx
│   │   └── about.css                  # About app styles (consumes --win98-* tokens)
│   ├── cv/                        # CV app (real content)
│   │   ├── Cv.tsx                    # Fieldset-based CV layout, sourced from src/data/cv.ts
│   │   ├── Cv.test.tsx
│   │   └── cv.css                    # CV app styles (consumes --win98-* tokens)
│   ├── PlaceholderApp.tsx       # Lazy placeholder rendered until real app content lands
│   ├── registry.ts              # appRegistry: Record<AppId, AppDescriptor> (lazy components)
│   ├── registry.test.ts         # Registry shape + per-app assertions (type-level + runtime)
│   ├── routes.ts                # createHashRouter — single /:appId? route → AppShell
│   ├── useRouteSync.ts          # Bidirectional route ↔ window-state sync hook
│   ├── useRouteSync.test.tsx    # Route sync tests (MemoryRouter + vi.fn dispatch)
│   └── index.ts                 # Barrel: appRegistry, AppRegistry
├── features/
│   ├── boot/                # Boot / splash screen sequence
│   │   ├── types.ts                # BootStatus, BootState, BootEnvironment, BootSequenceConfig
│   │   ├── types.test.ts           # Type-level tests
│   │   ├── actions.ts              # BootAction union (SKIP | TIMEOUT) + creators
│   │   ├── actions.test.ts         # Action creator + type-level union tests
│   │   ├── reducer.ts              # bootReducer + initialBootState + createInitialBootState
│   │   ├── reducer.test.ts         # Pure reducer unit tests
│   │   ├── config.ts               # BOOT_MIN_DURATION_MS, BOOT_PLAYED_SESSION_KEY
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
│   │   │   ├── Desktop.tsx              # Desktop background; hosts registry-driven icons + windows + taskbar + start menu
│   │   │   ├── Desktop.test.tsx
│   │   │   ├── DesktopIcon.tsx          # Selectable app icon (click / double-click / Enter)
│   │   │   ├── DesktopIcon.test.tsx
│   │   │   ├── Window.tsx              # Chrome: position/size/zIndex, focus, resize; Suspense + lazy app body
│   │   │   ├── Window.test.tsx
│   │   │   ├── TitleBar.tsx            # Title + Minimize/Maximize/Restore/Close; drives drag
│   │   │   ├── TitleBar.test.tsx
│   │   │   ├── Taskbar.tsx             # Bottom bar: Start button, window buttons, clock
│   │   │   ├── Taskbar.test.tsx
│   │   │   ├── StartMenu.tsx           # Start popup; per-app items + Shutdown; closes on outside click / Escape
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
│   └── shell/               # Idle placeholder (unused — superseded by Desktop)
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
and `src/features/shell/` (idle placeholder, currently unused) are top-level features.
`src/apps/`, `src/common/`, and `src/data/` sit alongside `src/features/` as top-level
modules (app registry/routing, shared primitives, and content data respectively).
Every module exposes its public API through a barrel `index.ts`; import from the
barrel rather than internal files:

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
- **`about.ts`** / **`contact.ts`** / **`cv.ts`** carry real content: `about.ts` exports
  name/role/summary plus an `avatar: Url` imported from `src/assets/avatar.jpeg`;
  `contact.ts` exports the real email, location (Brasília), and GitHub + LinkedIn
  `socials`; `cv.ts` exports real experience, education, and skill groups.
  **`projects.ts`** still exports placeholder content (marked `// PLACEHOLDER`) to be
  replaced with real data.
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
  into a Context, exposing `{ state, dispatch }`, and runs `useRouteSync(state, dispatch)`
  to keep the URL hash in sync with window state. It is mounted in `src/AppShell.tsx`
  (the router's route component), wrapping `<App />` together with a nested
  `StartMenuProvider`.
- **`useWindowManager.ts`** consumes the context and throws if used outside the provider.

### App registry & routing

`src/apps/` is a top-level module (alongside `src/features/`) that wires apps into the
desktop and the URL:

- **`registry.ts`** / **`index.ts`** define `appRegistry: Record<AppId, AppDescriptor>`
  — the catalog of apps (`about`, `contact`, `cv`, `projects`, `terminal`).
  Each entry carries its `IconName`, `defaultSize`, `resizable` / `singleton` flags, and
  a `component: React.lazy(...)` for code-splitting (the lazy component is what `Window`
  renders inside its body). `About`, `CV`, `Projects`, and `Contact` are
  singletons (reusing an existing window); `Terminal` allows multiple instances.
  Real app content lives under `src/apps/<app>/` — `src/apps/about/AboutApp.tsx`,
  `src/apps/cv/Cv.tsx`, and `src/apps/contact/ContactApp.tsx`, rendered for the
  `about` / `cv` (both resizable) and `contact` entries — while `projects` and `terminal`
  still use `PlaceholderApp.tsx` until their content lands.
- **`routes.ts`** builds a `createHashRouter` with a single `/:appId?` route whose
  component is `AppShell` — so the URL hash mirrors the focused app (`/#/projects`,
  `/#/`, …).
- **`useRouteSync.ts`** is the bidirectional route ↔ window-state sync hook, called from
  `WindowManagerProvider`. Route → state: a missing `appId` dispatches `CLEAR_FOCUS`;
  a known `appId` with no open window dispatches `OPEN_APP`; an open-but-unfocused
  window dispatches `FOCUS_WINDOW`; a minimized matching window dispatches `OPEN_APP`
  to restore it; an unknown `appId` is ignored. State → route: it navigates to
  `/<focusedAppId>` (or `/` when nothing is focused / the last window closed), using
  `replace` for focus changes and `push` for newly opened apps.
- **`src/AppShell.tsx`** (at `src/`, not `src/apps/`) mounts `WindowManagerProvider` +
  `StartMenuProvider` around `App`; it is the route component so the router context is
  available when `useRouteSync` runs. `src/main.tsx` mounts a `RouterProvider` with
  this router.

### Start menu state

The start menu is a separate, simpler state layer (not part of the window manager
reducer):

- **`StartMenuContext.tsx`** / **`StartMenuProvider.tsx`** hold a single `useState`
  boolean (`isStartMenuOpen`) and expose `{ isStartMenuOpen, closeStartMenu,
  onStartMenuToggle }`. The provider is mounted in `src/AppShell.tsx` inside the
  `WindowManagerProvider`.
- **`useStartMenu.ts`** consumes the context and throws if used outside the provider.

### Boot sequence

The boot sequence (`src/features/boot/`) drives the splash → desktop handoff at the
top of the app (it manages the `booting` → `dismissed` status; `App` renders
`<Desktop>` once dismissed). Unlike the window manager it uses a **hook-local
`useReducer`** — there is no Context provider, the state stays inside the hook:

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

The shell (`src/features/shell/`) is a placeholder for the post-boot UI, currently
**unused**:

- **`IdleScreen.tsx`** + **`idleScreen.css`** render a full-viewport "under
  construction" status (`role="status"`, `aria-label="BernasOS idle screen"`). It was
  shown after the boot sequence dismissed and has been superseded by the Desktop; the
  import in `App.tsx` is commented out, but the feature is retained for reference.

`src/App.tsx` ties the boot sequence to the desktop: it renders `<BootScreen>` while
`useBootSequence` reports `booting`, then `<Desktop>` once `dismissed`. The providers
(`WindowManagerProvider` + `StartMenuProvider`) and the hash router live in
`src/AppShell.tsx` / `src/apps/routes.ts` (see [App registry & routing](#app-registry--routing)).

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
  and disables geometry CSS transitions while a drag/resize is in progress. The body
  wraps the descriptor's `React.lazy` component (`<props.app.component />`) in
  `<Suspense>`, showing a `.window-loading` wait-cursor overlay as the fallback while
  the lazy component loads.
- **`TitleBar.tsx`** renders the title and Minimize / Maximize / Restore / Close
  controls (dispatching the matching actions) and drives window dragging via `useDrag`.
  It adds the `inactive` class when unfocused and stops propagation on controls so
  clicking a button doesn't start a drag.
- **`Desktop.tsx`** renders the desktop background and hosts the `DesktopIcon`s,
  non-minimized windows (sorted by z-index, each looked up in `appRegistry` by
  `appId`), the `Taskbar`, and the `StartMenu`. It renders one `DesktopIcon` per
  registered app. Any click on the background dispatches `CLEAR_FOCUS`; child
  components stop propagation themselves so their clicks don't bubble up.
- **`DesktopIcon.tsx`** is a keyboard-focusable app icon (`role="button"`,
  `tabIndex={0}`, 32×32 artwork sourced from `iconMap[app.icon]`,
  alt `${app.title} Icon`): single click selects it (Win98 dashed outline),
  double-click or Enter dispatches `OPEN_APP`. Icon artwork lives in
  `src/assets/icons/` and is mapped through `src/common/icons.ts`.
- **`Taskbar.tsx`** is the fixed bottom bar: a Start button that toggles the start
  menu, one button per window (sorted by ascending z-index, focused window gets the
  `focused` class), and a `Clock`. Clicking a window button dispatches the action
  returned by `resolveTaskbarAction`.
- **`StartMenu.tsx`** is the start menu popup (sidebar + items), shown when
  `isStartMenuOpen`. It closes on outside pointerdown (via `useOutsideClick`) and on
  Escape. It renders one item per registered app (each dispatching `OPEN_APP` and
  closing the menu), a separator, then a **Shutdown** item (icon via
  `iconMap['shutdown']`) that closes the menu without dispatching a window action
  (real shutdown behaviour is a TODO). It stacks with the `--win98-z-index-start-menu`
  token when no window is focused, otherwise it stacks naturally with the windows.
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
`AppDescriptor` carries a `component: LazyExoticComponent<ComponentType<Record<string, never>>>`
field — the code-split app content `Window` renders inside its body — and an `IconName`
that `DesktopIcon` / `StartMenu` resolve through `iconMap` in `src/common/icons.ts`.

### Styling

- **98.css** provides the Windows 98 widget chrome (`.window`, `.title-bar`,
  `.window-body`, buttons, etc.).
- **`src/styles/tokens.css`** centralizes the Win98 palette, typography (font stack
  begins with `'Pixelated MS Sans Serif'`), spacing scale, a z-index scale
  (`--win98-z-index-taskbar`, `--win98-z-index-start-menu`,
  `--win98-z-index-window-loading`), and a boot/splash palette
  (`--win98-boot-sky-top`, `--win98-boot-sky-bottom`, `--win98-boot-cloud`) as
  `--win98-*` CSS custom properties. Components reference tokens, never raw hex
  colors.
- **`src/styles/global.css`** adds desktop chrome: body overflow lock, `.desktop`
  background layer, `.window` / `.window-body` flex layout, `.window-resize-handle`,
  the desktop-icon selection styles (`.desktop-icon-container`, `.icon-selected`,
  `.icon-text-selected`), the taskbar / start-menu / clock chrome (`.taskbar`,
  `.start-menu`, `.clock`, …), a full-viewport `.window-loading` wait-cursor overlay
  (stacked via `--win98-z-index-window-loading`, shown by `Window` as the `Suspense`
  fallback while a lazy app component loads), and a global
  `font-family: var(--win98-font)`. Desktop icon labels use the `--win98-desktop-text`
  token.
- **Feature-scoped CSS:** some features colocate a stylesheet next to the component
  and import it directly (e.g. `src/features/boot/boot.css`,
  `src/features/shell/idleScreen.css`). These consume `--win98-*` tokens via `var()`
  and are intentionally not mapped into Tailwind's `@theme` — keep them feature-local.
- **`src/index.css`** maps those tokens into Tailwind v4 via a `@theme` block, so
  utilities like `bg-desktop`, `text-window-text`, and `font-win98` work. Import order
  matters: `98.css` → `tokens.css` → `global.css` → `tailwindcss`. Not every token
  maps to a utility — `--win98-desktop-text`, `--win98-z-index-start-menu`,
  `--win98-z-index-window-loading`, and the `--win98-boot-*` palette are consumed
  directly via `var()`.

## Testing

- Vitest config lives in `vite.config.ts` (jsdom environment); tests are colocated with
  source as `*.test.ts` / `*.test.tsx`. Shared test factories live in
  `src/features/desktop/testUtils.ts` (`makeApp`, `makeWindow`, `makeAppId`,
  `makeWindowId`); each component test file defines its own local `makeState`.
- **Component tests** (`Window`, `TitleBar`, `Desktop`, `DesktopIcon`, `Taskbar`,
  `StartMenu`) use `@testing-library/react` + `@testing-library/jest-dom`,
  rendering through a `WindowManagerContext.Provider` with a `vi.fn` dispatch to
  assert dispatched actions and rendered chrome — the provider is required only
  for components that consume that context. The real app content components
  (`AboutApp`, `Cv`) are tested separately: they render directly (no context) and
  assert their sections/copy come from the `src/data/` sources rather than
  hardcoded placeholders. `Window` tests are async (the app content
  comes from the descriptor's `lazy` component, not `children`) and assert the
  `.window-loading` overlay shows only while the lazy component resolves — no fake
  timers or minimum-loading delay. `Desktop` tests mock
  `Window` to avoid that Suspense/timer machinery. `Desktop`, `Taskbar`, and
  `StartMenu` tests additionally wrap in a `StartMenuContext.Provider`. `DesktopIcon`
  tests assert the 32×32 `iconMap`-sourced artwork, selection, and keyboard open.
  `Clock` tests are separate: they render `Clock` directly (it consumes no context),
  using fake timers to drive the minute-boundary update and the 60-second refresh and
  to assert timer cleanup on unmount. `BootScreen` and `IdleScreen` also render
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
  (and `Desktop`, stubbed as a `role="status"` / `aria-label="BernasOS desktop"` div)
  to assert the boot→desktop transition: the boot screen renders first, auto-dismisses
  after `BOOT_MIN_DURATION_MS`, dismisses on click, and dismisses immediately when
  reduced motion is preferred. `sessionStorage` and `window.history` are reset
  between tests.
- **App registry tests** (`apps/registry.test.ts`) assert the registry contains
  exactly the expected app ids (`about`, `contact`, `cv`, `projects`,
  `terminal`), each entry's `id` matches its key, each `component` is a `React.lazy`
  exotic (code-split), each icon resolves in `iconMap`, the singleton flags
  (About/Contact/CV/Projects singleton, Terminal not), and — via `expect-type`
  — that `appRegistry` is exactly `Record<AppId, AppDescriptor>` and `component` is
  `LazyExoticComponent<ComponentType<Record<string, never>>>`.
- **Route sync tests** (`apps/useRouteSync.test.tsx`) render the hook inside a
  `MemoryRouter` (`/:appId?` route) with a `vi.fn` dispatch and assert both
  directions: route → state (no `appId` → `CLEAR_FOCUS`; known `appId` with no window
  → `OPEN_APP`; open-but-unfocused → `FOCUS_WINDOW`; minimized matching → `OPEN_APP`
  restore; unknown `appId` → no dispatch) and state → route (opening an app navigates
  to `/<appId>`, closing the last window returns to `/`, focus switching updates the
  path).
- **Boot config tests** (`boot/config.test.ts`) assert `BOOT_MIN_DURATION_MS` and
  `BOOT_PLAYED_SESSION_KEY`.
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
