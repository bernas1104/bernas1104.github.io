import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import type { ActionDispatch } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useRouteSync } from '@/apps/useRouteSync.ts';
import { appRegistry } from '@/apps/index.ts';
import type { WindowAction } from '@/features/desktop/windowManager/actions.ts';
import type {
  DesktopState,
  WindowId,
  WindowInstance,
} from '@/features/desktop/types.ts';
import {
  makeAppId,
  makeWindow,
  makeWindowId,
} from '@/features/desktop/testUtils.ts';

type Dispatch = ActionDispatch<[action: WindowAction]>;

const makeState = (overrides: Partial<DesktopState> = {}): DesktopState => ({
  windows: new Map<WindowId, WindowInstance>(),
  focusedWindowId: null,
  nextZIndex: 1,
  windowsOpenedCount: 0,
  ...overrides,
});

function RouteSyncHarness({
  state,
  dispatch,
}: {
  state: DesktopState;
  dispatch: Dispatch;
}) {
  useRouteSync(state, dispatch);
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

function renderRouteSync(
  initialEntry: string,
  state: DesktopState,
  dispatch: Dispatch,
) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/:appId?"
          element={<RouteSyncHarness state={state} dispatch={dispatch} />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

function makeDispatch(): Dispatch {
  return vi.fn<(action: WindowAction) => void>() as unknown as Dispatch;
}

const projectsApp = appRegistry[makeAppId('projects')];

describe('useRouteSync', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('dispatches CLEAR_FOCUS when there is no appId in the route', () => {
    const dispatch = makeDispatch();
    renderRouteSync('/', makeState(), dispatch);

    expect(dispatch).toHaveBeenCalledWith({ type: 'CLEAR_FOCUS' });
  });

  it('opens the Projects window when visiting /projects on first load', () => {
    const dispatch = makeDispatch();
    renderRouteSync('/projects', makeState(), dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'OPEN_APP',
      app: projectsApp,
    });
  });

  it('ignores unknown app ids without crashing or dispatching', () => {
    const dispatch = makeDispatch();
    renderRouteSync('/nonexistent', makeState(), dispatch);

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('does not dispatch when the route already matches a focused, open window', () => {
    const dispatch = makeDispatch();
    const win = makeWindow({
      id: makeWindowId('w-projects'),
      appId: makeAppId('projects'),
      title: 'Projects',
      state: 'open',
    });
    const state = makeState({
      windows: new Map([[win.id, win]]),
      focusedWindowId: win.id,
    });

    renderRouteSync('/projects', state, dispatch);

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('dispatches FOCUS_WINDOW when the route matches an open but unfocused window', () => {
    const dispatch = makeDispatch();
    const win = makeWindow({
      id: makeWindowId('w-projects'),
      appId: makeAppId('projects'),
      title: 'Projects',
      state: 'open',
    });
    const state = makeState({
      windows: new Map([[win.id, win]]),
      focusedWindowId: null,
    });

    renderRouteSync('/projects', state, dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'FOCUS_WINDOW',
      windowId: win.id,
    });
  });

  it('dispatches OPEN_APP to restore a minimized window matching the route', () => {
    const dispatch = makeDispatch();
    const win = makeWindow({
      id: makeWindowId('w-projects'),
      appId: makeAppId('projects'),
      title: 'Projects',
      state: 'minimized',
      previousState: 'open',
    });
    const state = makeState({
      windows: new Map([[win.id, win]]),
      focusedWindowId: win.id,
    });

    renderRouteSync('/projects', state, dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'OPEN_APP',
      app: projectsApp,
    });
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'FOCUS_WINDOW' }),
    );
  });

  it('updates the URL hash when an app is opened (state -> route)', async () => {
    const dispatch = makeDispatch();
    const win = makeWindow({
      id: makeWindowId('w-projects'),
      appId: makeAppId('projects'),
      title: 'Projects',
      state: 'open',
    });
    const openState = makeState({
      windows: new Map([[win.id, win]]),
      focusedWindowId: win.id,
    });

    const { getByTestId, rerender } = renderRouteSync(
      '/',
      makeState(),
      dispatch,
    );
    expect(getByTestId('location').textContent).toBe('/');

    rerender(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/:appId?"
            element={<RouteSyncHarness state={openState} dispatch={dispatch} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(getByTestId('location').textContent).toBe('/projects');
    });
  });

  it('returns the URL to / when the last window is closed', async () => {
    const dispatch = makeDispatch();
    const win = makeWindow({
      id: makeWindowId('w-projects'),
      appId: makeAppId('projects'),
      title: 'Projects',
      state: 'open',
    });
    const openState = makeState({
      windows: new Map([[win.id, win]]),
      focusedWindowId: win.id,
    });

    const { getByTestId, rerender } = renderRouteSync(
      '/projects',
      openState,
      dispatch,
    );
    expect(getByTestId('location').textContent).toBe('/projects');

    rerender(
      <MemoryRouter initialEntries={['/projects']}>
        <Routes>
          <Route
            path="/:appId?"
            element={
              <RouteSyncHarness state={makeState()} dispatch={dispatch} />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(getByTestId('location').textContent).toBe('/');
    });
  });

  it('navigates to the focused app route when focus changes to another app', async () => {
    const dispatch = makeDispatch();
    const aboutWin = makeWindow({
      id: makeWindowId('w-about'),
      appId: makeAppId('about'),
      title: 'About',
      state: 'open',
    });
    const initialState = makeState({
      windows: new Map([[aboutWin.id, aboutWin]]),
      focusedWindowId: aboutWin.id,
    });

    const { getByTestId, rerender } = renderRouteSync(
      '/about',
      initialState,
      dispatch,
    );
    expect(getByTestId('location').textContent).toBe('/about');

    const projectsWin = makeWindow({
      id: makeWindowId('w-projects'),
      appId: makeAppId('projects'),
      title: 'Projects',
      state: 'open',
    });
    const switchedState = makeState({
      windows: new Map([
        [aboutWin.id, aboutWin],
        [projectsWin.id, projectsWin],
      ]),
      focusedWindowId: projectsWin.id,
      nextZIndex: 3,
      windowsOpenedCount: 2,
    });

    rerender(
      <MemoryRouter initialEntries={['/about']}>
        <Routes>
          <Route
            path="/:appId?"
            element={
              <RouteSyncHarness state={switchedState} dispatch={dispatch} />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(getByTestId('location').textContent).toBe('/projects');
    });
  });
});
