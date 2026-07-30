import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  initialWindowsState,
  windowsReducer,
} from '@/features/desktop/windowManager/reducer.ts';
import type {
  AppDescriptor,
  AppId,
  DesktopState,
  WindowId,
  WindowInstance,
} from '@/features/desktop/types.ts';

const makeAppId = (id: string): AppId => id as AppId;
const makeWindowId = (id: string): WindowId => id as WindowId;

const makeApp = (
  overrides: Partial<AppDescriptor> & { id: AppId },
): AppDescriptor => ({
  title: 'Test App',
  icon: 'about',
  defaultSize: { width: 400, height: 300 },
  resizable: true,
  singleton: false,
  ...overrides,
});

const makeWindow = (
  overrides: Partial<WindowInstance> & { id: WindowId },
): WindowInstance => ({
  appId: makeAppId('app-1'),
  title: 'Test Window',
  position: { x: 100, y: 100 },
  size: { width: 400, height: 300 },
  state: 'open',
  zIndex: 1,
  previousState: null,
  ...overrides,
});

const makeState = (overrides: Partial<DesktopState> = {}): DesktopState => ({
  windows: new Map<WindowId, WindowInstance>(),
  focusedWindowId: null,
  nextZIndex: 1,
  ...overrides,
});

describe('initialWindowsState', () => {
  it('starts with an empty windows map', () => {
    expect(initialWindowsState.windows.size).toBe(0);
  });

  it('starts with no focused window', () => {
    expect(initialWindowsState.focusedWindowId).toBeNull();
  });

  it('starts with nextZIndex of 1', () => {
    expect(initialWindowsState.nextZIndex).toBe(1);
  });
});

describe('windowsReducer', () => {
  let uuidCalls = 0;

  beforeEach(() => {
    uuidCalls = 0;
    vi.spyOn(globalThis.crypto, 'randomUUID').mockImplementation((() => {
      uuidCalls += 1;
      return `uuid-${uuidCalls}`;
    }) as () => ReturnType<typeof crypto.randomUUID>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('OPEN_APP', () => {
    it('creates a new window with the app data', () => {
      const app = makeApp({ id: makeAppId('notepad') });
      const next = windowsReducer(initialWindowsState, {
        type: 'OPEN_APP',
        app,
      });

      expect(next.windows.size).toBe(1);
      const window = next.windows.values().next().value as WindowInstance;
      expect(window.appId).toBe(app.id);
      expect(window.title).toBe(app.title);
      expect(window.size).toEqual(app.defaultSize);
      expect(window.state).toBe('open');
      expect(window.previousState).toBeNull();
    });

    it('assigns a unique window id via crypto.randomUUID', () => {
      const app = makeApp({ id: makeAppId('notepad') });
      const next = windowsReducer(initialWindowsState, {
        type: 'OPEN_APP',
        app,
      });

      const window = next.windows.values().next().value as WindowInstance;
      expect(window.id).toBe(makeWindowId('uuid-1'));
    });

    it('uses a default position of {100, 100}', () => {
      const app = makeApp({ id: makeAppId('notepad') });
      const next = windowsReducer(initialWindowsState, {
        type: 'OPEN_APP',
        app,
      });

      const window = next.windows.values().next().value as WindowInstance;
      expect(window.position).toEqual({ x: 100, y: 100 });
    });

    it('assigns the current nextZIndex and increments it', () => {
      const app = makeApp({ id: makeAppId('notepad') });
      const next = windowsReducer(makeState({ nextZIndex: 5 }), {
        type: 'OPEN_APP',
        app,
      });

      const window = next.windows.values().next().value as WindowInstance;
      expect(window.zIndex).toBe(5);
      expect(next.nextZIndex).toBe(6);
    });

    it('focuses the newly opened window', () => {
      const app = makeApp({ id: makeAppId('notepad') });
      const next = windowsReducer(initialWindowsState, {
        type: 'OPEN_APP',
        app,
      });

      expect(next.focusedWindowId).toBe(makeWindowId('uuid-1'));
    });

    it('opens multiple distinct windows for non-singleton apps', () => {
      const app = makeApp({ id: makeAppId('notepad'), singleton: false });
      let state = windowsReducer(initialWindowsState, {
        type: 'OPEN_APP',
        app,
      });
      state = windowsReducer(state, { type: 'OPEN_APP', app });

      expect(state.windows.size).toBe(2);
      expect([...state.windows.keys()]).toEqual([
        makeWindowId('uuid-1'),
        makeWindowId('uuid-2'),
      ]);
    });

    it('creates a new window for a singleton app with no existing window', () => {
      const app = makeApp({ id: makeAppId('settings'), singleton: true });
      const next = windowsReducer(initialWindowsState, {
        type: 'OPEN_APP',
        app,
      });

      expect(next.windows.size).toBe(1);
    });

    describe('singleton app with an existing open window', () => {
      const app = makeApp({ id: makeAppId('settings'), singleton: true });
      const existing = makeWindow({
        id: makeWindowId('existing'),
        appId: app.id,
        zIndex: 1,
      });
      const state = makeState({
        windows: new Map([[existing.id, existing]]),
        focusedWindowId: null,
        nextZIndex: 7,
      });

      it('does not create a new window', () => {
        const next = windowsReducer(state, { type: 'OPEN_APP', app });

        expect(next.windows.size).toBe(1);
        expect([...next.windows.keys()]).toEqual([existing.id]);
      });

      it('focuses the existing window', () => {
        const next = windowsReducer(state, { type: 'OPEN_APP', app });

        expect(next.focusedWindowId).toBe(existing.id);
      });

      it('brings the existing window to the front by updating its zIndex', () => {
        const next = windowsReducer(state, { type: 'OPEN_APP', app });

        const updated = next.windows.get(existing.id) as WindowInstance;
        expect(updated.zIndex).toBe(7);
        expect(next.nextZIndex).toBe(8);
      });

      it('preserves the existing window state and previousState when not minimized', () => {
        const next = windowsReducer(state, { type: 'OPEN_APP', app });

        const updated = next.windows.get(existing.id) as WindowInstance;
        expect(updated.state).toBe('open');
        expect(updated.previousState).toBeNull();
      });
    });

    describe('singleton app with an existing minimized window', () => {
      const app = makeApp({ id: makeAppId('settings'), singleton: true });

      it('restores to previousState when one exists', () => {
        const existing = makeWindow({
          id: makeWindowId('existing'),
          appId: app.id,
          state: 'minimized',
          previousState: 'maximized',
          zIndex: 1,
        });
        const state = makeState({
          windows: new Map([[existing.id, existing]]),
          focusedWindowId: null,
          nextZIndex: 7,
        });

        const next = windowsReducer(state, { type: 'OPEN_APP', app });

        const updated = next.windows.get(existing.id) as WindowInstance;
        expect(updated.state).toBe('maximized');
        expect(updated.previousState).toBeNull();
      });

      it('restores to open when previousState is null', () => {
        const existing = makeWindow({
          id: makeWindowId('existing'),
          appId: app.id,
          state: 'minimized',
          previousState: null,
          zIndex: 1,
        });
        const state = makeState({
          windows: new Map([[existing.id, existing]]),
          focusedWindowId: null,
          nextZIndex: 7,
        });

        const next = windowsReducer(state, { type: 'OPEN_APP', app });

        const updated = next.windows.get(existing.id) as WindowInstance;
        expect(updated.state).toBe('open');
        expect(updated.previousState).toBeNull();
      });

      it('focuses the restored window and bumps zIndex', () => {
        const existing = makeWindow({
          id: makeWindowId('existing'),
          appId: app.id,
          state: 'minimized',
          previousState: 'open',
          zIndex: 1,
        });
        const state = makeState({
          windows: new Map([[existing.id, existing]]),
          focusedWindowId: null,
          nextZIndex: 7,
        });

        const next = windowsReducer(state, { type: 'OPEN_APP', app });

        expect(next.focusedWindowId).toBe(existing.id);
        const updated = next.windows.get(existing.id) as WindowInstance;
        expect(updated.zIndex).toBe(7);
        expect(next.nextZIndex).toBe(8);
      });

      it('does not create a new window', () => {
        const existing = makeWindow({
          id: makeWindowId('existing'),
          appId: app.id,
          state: 'minimized',
          previousState: 'open',
          zIndex: 1,
        });
        const state = makeState({
          windows: new Map([[existing.id, existing]]),
          focusedWindowId: null,
          nextZIndex: 7,
        });

        const next = windowsReducer(state, { type: 'OPEN_APP', app });

        expect(next.windows.size).toBe(1);
        expect([...next.windows.keys()]).toEqual([existing.id]);
      });
    });
  });

  describe('CLOSE_WINDOW', () => {
    it('removes the window from the map', () => {
      const window = makeWindow({ id: makeWindowId('win-1') });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        focusedWindowId: window.id,
        nextZIndex: 2,
      });

      const next = windowsReducer(state, {
        type: 'CLOSE_WINDOW',
        windowId: window.id,
      });

      expect(next.windows.has(window.id)).toBe(false);
      expect(next.windows.size).toBe(0);
    });

    it('clears focus when the focused window is closed', () => {
      const window = makeWindow({ id: makeWindowId('win-1') });
      const other = makeWindow({ id: makeWindowId('win-2'), zIndex: 2 });
      const state = makeState({
        windows: new Map([
          [window.id, window],
          [other.id, other],
        ]),
        focusedWindowId: window.id,
        nextZIndex: 3,
      });

      const next = windowsReducer(state, {
        type: 'CLOSE_WINDOW',
        windowId: window.id,
      });

      expect(next.focusedWindowId).toBeNull();
    });

    it('preserves focus when a different window is closed', () => {
      const window = makeWindow({ id: makeWindowId('win-1') });
      const other = makeWindow({ id: makeWindowId('win-2'), zIndex: 2 });
      const state = makeState({
        windows: new Map([
          [window.id, window],
          [other.id, other],
        ]),
        focusedWindowId: other.id,
        nextZIndex: 3,
      });

      const next = windowsReducer(state, {
        type: 'CLOSE_WINDOW',
        windowId: window.id,
      });

      expect(next.focusedWindowId).toBe(other.id);
    });

    it('does not mutate the original state', () => {
      const window = makeWindow({ id: makeWindowId('win-1') });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        focusedWindowId: window.id,
        nextZIndex: 2,
      });
      const originalMap = state.windows;

      windowsReducer(state, { type: 'CLOSE_WINDOW', windowId: window.id });

      expect(originalMap.has(window.id)).toBe(true);
      expect(state.focusedWindowId).toBe(window.id);
    });

    it('is a no-op (returns same state reference) when the window does not exist', () => {
      const state = makeState({ nextZIndex: 5 });

      const next = windowsReducer(state, {
        type: 'CLOSE_WINDOW',
        windowId: makeWindowId('missing'),
      });

      expect(next).toBe(state);
    });
  });

  describe('FOCUS_WINDOW', () => {
    it('sets focusedWindowId to the targeted window', () => {
      const window = makeWindow({ id: makeWindowId('win-1') });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        focusedWindowId: null,
        nextZIndex: 2,
      });

      const next = windowsReducer(state, {
        type: 'FOCUS_WINDOW',
        windowId: window.id,
      });

      expect(next.focusedWindowId).toBe(window.id);
    });

    it('updates the focused window zIndex and increments nextZIndex', () => {
      const window = makeWindow({ id: makeWindowId('win-1'), zIndex: 1 });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        focusedWindowId: null,
        nextZIndex: 5,
      });

      const next = windowsReducer(state, {
        type: 'FOCUS_WINDOW',
        windowId: window.id,
      });

      expect((next.windows.get(window.id) as WindowInstance).zIndex).toBe(5);
      expect(next.nextZIndex).toBe(6);
    });

    it('is a no-op (returns same state reference) when the window does not exist', () => {
      const state = makeState({ nextZIndex: 5 });

      const next = windowsReducer(state, {
        type: 'FOCUS_WINDOW',
        windowId: makeWindowId('missing'),
      });

      expect(next).toBe(state);
      expect(next.nextZIndex).toBe(5);
    });

    it('is a no-op (returns same state reference) when the window is minimized', () => {
      const window = makeWindow({
        id: makeWindowId('win-1'),
        state: 'minimized',
      });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        focusedWindowId: null,
        nextZIndex: 5,
      });

      const next = windowsReducer(state, {
        type: 'FOCUS_WINDOW',
        windowId: window.id,
      });

      expect(next).toBe(state);
      expect(next.focusedWindowId).toBeNull();
      expect(next.nextZIndex).toBe(5);
    });
  });

  describe('MINIMIZE_WINDOW', () => {
    it('sets the window state to minimized', () => {
      const window = makeWindow({ id: makeWindowId('win-1'), state: 'open' });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        nextZIndex: 2,
      });

      const next = windowsReducer(state, {
        type: 'MINIMIZE_WINDOW',
        windowId: window.id,
      });

      expect((next.windows.get(window.id) as WindowInstance).state).toBe(
        'minimized',
      );
    });

    it('records the previous state when minimizing a non-minimized window', () => {
      const open = makeWindow({
        id: makeWindowId('win-1'),
        state: 'open',
        previousState: null,
      });
      const state = makeState({
        windows: new Map([[open.id, open]]),
        nextZIndex: 2,
      });

      const next = windowsReducer(state, {
        type: 'MINIMIZE_WINDOW',
        windowId: open.id,
      });

      expect((next.windows.get(open.id) as WindowInstance).previousState).toBe(
        'open',
      );
    });

    it('records maximized as the previous state when minimizing a maximized window', () => {
      const maximized = makeWindow({
        id: makeWindowId('win-1'),
        state: 'maximized',
        previousState: null,
      });
      const state = makeState({
        windows: new Map([[maximized.id, maximized]]),
        nextZIndex: 2,
      });

      const next = windowsReducer(state, {
        type: 'MINIMIZE_WINDOW',
        windowId: maximized.id,
      });

      expect(
        (next.windows.get(maximized.id) as WindowInstance).previousState,
      ).toBe('maximized');
    });

    it('is a no-op (returns same state reference) when the window is already minimized', () => {
      const minimized = makeWindow({
        id: makeWindowId('win-1'),
        state: 'minimized',
        previousState: 'open',
      });
      const state = makeState({
        windows: new Map([[minimized.id, minimized]]),
        nextZIndex: 2,
      });

      const next = windowsReducer(state, {
        type: 'MINIMIZE_WINDOW',
        windowId: minimized.id,
      });

      expect(next).toBe(state);
    });

    it('is a no-op (returns same state reference) when the window does not exist', () => {
      const state = makeState({ nextZIndex: 5 });

      const next = windowsReducer(state, {
        type: 'MINIMIZE_WINDOW',
        windowId: makeWindowId('missing'),
      });

      expect(next).toBe(state);
    });

    it('shifts focus to the highest-zIndex non-minimized window when minimizing the focused window', () => {
      const win1 = makeWindow({
        id: makeWindowId('win-1'),
        zIndex: 1,
        state: 'open',
      });
      const win2 = makeWindow({
        id: makeWindowId('win-2'),
        zIndex: 3,
        state: 'open',
      });
      const win3 = makeWindow({
        id: makeWindowId('win-3'),
        zIndex: 5,
        state: 'minimized',
      });
      const state = makeState({
        windows: new Map([
          [win1.id, win1],
          [win2.id, win2],
          [win3.id, win3],
        ]),
        focusedWindowId: win1.id,
        nextZIndex: 6,
      });

      const next = windowsReducer(state, {
        type: 'MINIMIZE_WINDOW',
        windowId: win1.id,
      });

      expect(next.focusedWindowId).toBe(win2.id);
    });

    it('sets focus to null when minimizing the focused window and no other non-minimized windows remain', () => {
      const win1 = makeWindow({
        id: makeWindowId('win-1'),
        zIndex: 1,
        state: 'open',
      });
      const win2 = makeWindow({
        id: makeWindowId('win-2'),
        zIndex: 2,
        state: 'minimized',
      });
      const state = makeState({
        windows: new Map([
          [win1.id, win1],
          [win2.id, win2],
        ]),
        focusedWindowId: win1.id,
        nextZIndex: 3,
      });

      const next = windowsReducer(state, {
        type: 'MINIMIZE_WINDOW',
        windowId: win1.id,
      });

      expect(next.focusedWindowId).toBeNull();
    });

    it('leaves focus unchanged when minimizing a non-focused window', () => {
      const win1 = makeWindow({
        id: makeWindowId('win-1'),
        zIndex: 1,
        state: 'open',
      });
      const win2 = makeWindow({
        id: makeWindowId('win-2'),
        zIndex: 2,
        state: 'open',
      });
      const state = makeState({
        windows: new Map([
          [win1.id, win1],
          [win2.id, win2],
        ]),
        focusedWindowId: win1.id,
        nextZIndex: 3,
      });

      const next = windowsReducer(state, {
        type: 'MINIMIZE_WINDOW',
        windowId: win2.id,
      });

      expect(next.focusedWindowId).toBe(win1.id);
    });
  });

  describe('TOGGLE_MAXIMIZE', () => {
    it('maximizes an open window', () => {
      const window = makeWindow({ id: makeWindowId('win-1'), state: 'open' });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        nextZIndex: 5,
      });

      const next = windowsReducer(state, {
        type: 'TOGGLE_MAXIMIZE',
        windowId: window.id,
      });

      expect((next.windows.get(window.id) as WindowInstance).state).toBe(
        'maximized',
      );
    });

    it('restores a maximized window to open', () => {
      const window = makeWindow({
        id: makeWindowId('win-1'),
        state: 'maximized',
      });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        nextZIndex: 5,
      });

      const next = windowsReducer(state, {
        type: 'TOGGLE_MAXIMIZE',
        windowId: window.id,
      });

      expect((next.windows.get(window.id) as WindowInstance).state).toBe(
        'open',
      );
    });

    it('brings the window to the front and focuses it', () => {
      const window = makeWindow({
        id: makeWindowId('win-1'),
        state: 'open',
        zIndex: 1,
      });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        focusedWindowId: null,
        nextZIndex: 5,
      });

      const next = windowsReducer(state, {
        type: 'TOGGLE_MAXIMIZE',
        windowId: window.id,
      });

      expect((next.windows.get(window.id) as WindowInstance).zIndex).toBe(5);
      expect(next.nextZIndex).toBe(6);
      expect(next.focusedWindowId).toBe(window.id);
    });

    it('is a no-op (returns same state reference) when the window is minimized', () => {
      const window = makeWindow({
        id: makeWindowId('win-1'),
        state: 'minimized',
      });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        focusedWindowId: null,
        nextZIndex: 5,
      });

      const next = windowsReducer(state, {
        type: 'TOGGLE_MAXIMIZE',
        windowId: window.id,
      });

      expect(next).toBe(state);
    });

    it('is a no-op (returns same state reference) when the window does not exist', () => {
      const state = makeState({ nextZIndex: 5 });

      const next = windowsReducer(state, {
        type: 'TOGGLE_MAXIMIZE',
        windowId: makeWindowId('missing'),
      });

      expect(next).toBe(state);
    });

    it('preserves previousState when maximizing an open window', () => {
      const window = makeWindow({
        id: makeWindowId('win-1'),
        state: 'open',
        previousState: 'maximized',
      });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        nextZIndex: 5,
      });

      const next = windowsReducer(state, {
        type: 'TOGGLE_MAXIMIZE',
        windowId: window.id,
      });

      expect(
        (next.windows.get(window.id) as WindowInstance).previousState,
      ).toBe('maximized');
    });

    it('preserves previousState when restoring a maximized window', () => {
      const window = makeWindow({
        id: makeWindowId('win-1'),
        state: 'maximized',
        previousState: 'open',
      });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        nextZIndex: 5,
      });

      const next = windowsReducer(state, {
        type: 'TOGGLE_MAXIMIZE',
        windowId: window.id,
      });

      expect(
        (next.windows.get(window.id) as WindowInstance).previousState,
      ).toBe('open');
    });
  });

  describe('MOVE_WINDOW', () => {
    it('updates the window position', () => {
      const window = makeWindow({
        id: makeWindowId('win-1'),
        position: { x: 100, y: 100 },
      });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        nextZIndex: 2,
      });

      const next = windowsReducer(state, {
        type: 'MOVE_WINDOW',
        windowId: window.id,
        position: { x: 250, y: 175 },
      });

      expect((next.windows.get(window.id) as WindowInstance).position).toEqual({
        x: 250,
        y: 175,
      });
    });

    it('does not change focus or z-index', () => {
      const window = makeWindow({ id: makeWindowId('win-1'), zIndex: 3 });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        focusedWindowId: window.id,
        nextZIndex: 4,
      });

      const next = windowsReducer(state, {
        type: 'MOVE_WINDOW',
        windowId: window.id,
        position: { x: 10, y: 20 },
      });

      expect((next.windows.get(window.id) as WindowInstance).zIndex).toBe(3);
      expect(next.focusedWindowId).toBe(window.id);
      expect(next.nextZIndex).toBe(4);
    });

    it('is a no-op (returns same state reference) when the window does not exist', () => {
      const state = makeState({ nextZIndex: 2 });

      const next = windowsReducer(state, {
        type: 'MOVE_WINDOW',
        windowId: makeWindowId('missing'),
        position: { x: 10, y: 20 },
      });

      expect(next).toBe(state);
    });
  });

  describe('RESIZE_WINDOW', () => {
    it('updates the window size', () => {
      const window = makeWindow({
        id: makeWindowId('win-1'),
        size: { width: 400, height: 300 },
      });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        nextZIndex: 2,
      });

      const next = windowsReducer(state, {
        type: 'RESIZE_WINDOW',
        windowId: window.id,
        size: { width: 800, height: 600 },
      });

      expect((next.windows.get(window.id) as WindowInstance).size).toEqual({
        width: 800,
        height: 600,
      });
    });

    it('does not change focus or z-index', () => {
      const window = makeWindow({ id: makeWindowId('win-1'), zIndex: 3 });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        focusedWindowId: window.id,
        nextZIndex: 4,
      });

      const next = windowsReducer(state, {
        type: 'RESIZE_WINDOW',
        windowId: window.id,
        size: { width: 800, height: 600 },
      });

      expect((next.windows.get(window.id) as WindowInstance).zIndex).toBe(3);
      expect(next.focusedWindowId).toBe(window.id);
      expect(next.nextZIndex).toBe(4);
    });

    it('is a no-op (returns same state reference) when the window does not exist', () => {
      const state = makeState({ nextZIndex: 2 });

      const next = windowsReducer(state, {
        type: 'RESIZE_WINDOW',
        windowId: makeWindowId('missing'),
        size: { width: 800, height: 600 },
      });

      expect(next).toBe(state);
    });
  });

  describe('RESTORE_WINDOW', () => {
    it('restores a minimized window to its previous state', () => {
      const window = makeWindow({
        id: makeWindowId('win-1'),
        state: 'minimized',
        previousState: 'maximized',
      });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        nextZIndex: 5,
      });

      const next = windowsReducer(state, {
        type: 'RESTORE_WINDOW',
        windowId: window.id,
      });

      expect((next.windows.get(window.id) as WindowInstance).state).toBe(
        'maximized',
      );
      expect(
        (next.windows.get(window.id) as WindowInstance).previousState,
      ).toBeNull();
    });

    it('restores to open when there is no previous state', () => {
      const window = makeWindow({
        id: makeWindowId('win-1'),
        state: 'minimized',
        previousState: null,
      });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        nextZIndex: 5,
      });

      const next = windowsReducer(state, {
        type: 'RESTORE_WINDOW',
        windowId: window.id,
      });

      expect((next.windows.get(window.id) as WindowInstance).state).toBe(
        'open',
      );
      expect(
        (next.windows.get(window.id) as WindowInstance).previousState,
      ).toBeNull();
    });

    it('focuses the restored window and bumps the z-index', () => {
      const window = makeWindow({
        id: makeWindowId('win-1'),
        state: 'minimized',
        previousState: 'open',
        zIndex: 1,
      });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        focusedWindowId: null,
        nextZIndex: 5,
      });

      const next = windowsReducer(state, {
        type: 'RESTORE_WINDOW',
        windowId: window.id,
      });

      expect(next.focusedWindowId).toBe(window.id);
      const restored = next.windows.get(window.id) as WindowInstance;
      expect(restored.zIndex).toBe(5);
      expect(next.nextZIndex).toBe(6);
    });

    it('is a no-op (returns same state reference) when the window is not minimized', () => {
      const window = makeWindow({ id: makeWindowId('win-1'), state: 'open' });
      const state = makeState({
        windows: new Map([[window.id, window]]),
        nextZIndex: 5,
      });

      const next = windowsReducer(state, {
        type: 'RESTORE_WINDOW',
        windowId: window.id,
      });

      expect(next).toBe(state);
    });

    it('is a no-op (returns same state reference) when the window does not exist', () => {
      const state = makeState({ nextZIndex: 5 });

      const next = windowsReducer(state, {
        type: 'RESTORE_WINDOW',
        windowId: makeWindowId('missing'),
      });

      expect(next).toBe(state);
    });
  });

  describe('immutability', () => {
    it('does not mutate the previous state map for OPEN_APP', () => {
      const app = makeApp({ id: makeAppId('notepad') });
      const state = makeState({ nextZIndex: 2 });
      const originalWindows = state.windows;

      windowsReducer(state, { type: 'OPEN_APP', app });

      expect(state.windows).toBe(originalWindows);
      expect(state.windows.size).toBe(0);
      expect(state.nextZIndex).toBe(2);
    });

    it('returns a new state object and a new windows map for mutating actions', () => {
      const app = makeApp({ id: makeAppId('notepad') });
      const state = makeState({ nextZIndex: 2 });

      const next = windowsReducer(state, { type: 'OPEN_APP', app });

      expect(next).not.toBe(state);
      expect(next.windows).not.toBe(state.windows);
    });
  });
});
