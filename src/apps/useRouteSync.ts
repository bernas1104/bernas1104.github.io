import { useEffect, useRef, type ActionDispatch } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import type { DesktopState } from '@/features/desktop/types.ts';
import type { AppId } from '@/common/types.ts';
import type { WindowAction } from '@/features/desktop/windowManager/actions.ts';
import { appRegistry } from '@/apps/index.ts';

export function useRouteSync(
  state: DesktopState,
  dispatch: ActionDispatch<[action: WindowAction]>,
) {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const stateRef = useRef<DesktopState>(state);
  const locationRef = useRef(location);
  const previousStateRef = useRef<DesktopState | undefined>(undefined);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    const appId = params.appId as AppId | undefined;
    if (!appId) {
      dispatch({ type: 'CLEAR_FOCUS' });
      return;
    }

    const app = appRegistry[appId];
    if (!app) return;

    const windows = Array.from(stateRef.current.windows.values());
    const focusedWindow = windows.find(
      (window) => window.id === stateRef.current.focusedWindowId,
    );
    const window =
      focusedWindow && focusedWindow.appId === appId
        ? focusedWindow
        : windows.find((window) => window.appId === appId);

    if (!window) {
      dispatch({ type: 'OPEN_APP', app });
      return;
    }

    if (window.state === 'minimized') {
      dispatch({ type: 'RESTORE_WINDOW', windowId: window.id });
    }
    if (stateRef.current.focusedWindowId !== window.id) {
      dispatch({ type: 'FOCUS_WINDOW', windowId: window.id });
    }
  }, [params.appId, dispatch]);

  useEffect(() => {
    if (previousStateRef.current === state) return;

    if (
      state.windows.size === 0 &&
      (previousStateRef.current?.windows.size ?? 0) === 0
    )
      return;

    const windows = Array.from(state.windows.values());
    const previousWindows = Array.from(
      previousStateRef.current?.windows.values() ?? [],
    );

    const appId = windows.find((w) => w.id === state.focusedWindowId)?.appId;
    const desiredUrl =
      appId && appRegistry[appId] && state.focusedWindowId ? `/${appId}` : '/';
    const isNewApp =
      state.focusedWindowId &&
      !previousWindows.some((w) => w.id === state.focusedWindowId);

    if (locationRef.current.pathname !== desiredUrl)
      navigate(desiredUrl, { replace: !isNewApp });

    previousStateRef.current = state;
  }, [state, navigate]);
}
