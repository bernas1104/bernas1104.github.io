import type {
  DesktopState,
  WindowInstance,
  WindowId,
} from '@/features/desktop/types.ts';
import type { WindowAction } from '@/features/desktop/windowManager/actions.ts';

export const initialWindowsState: DesktopState = {
  windows: new Map<WindowId, WindowInstance>(),
  focusedWindowId: null,
  nextZIndex: 1,
};

export function windowsReducer(
  state: DesktopState,
  action: WindowAction,
): DesktopState {
  switch (action.type) {
    case 'OPEN_APP': {
      if (action.app.singleton) {
        const existingWindow = Array.from(state.windows.values()).find(
          (window) => window.appId === action.app.id,
        );

        if (existingWindow) {
          return {
            ...state,
            focusedWindowId: existingWindow.id,
            windows: (() => {
              const newWindows = new Map(state.windows);
              newWindows.set(existingWindow.id, {
                ...existingWindow,
                state:
                  existingWindow.state === 'minimized'
                    ? (existingWindow.previousState ?? 'open')
                    : existingWindow.state,
                previousState:
                  existingWindow.state === 'minimized'
                    ? null
                    : existingWindow.previousState,
                zIndex: state.nextZIndex,
              });
              return newWindows;
            })(),
            nextZIndex: state.nextZIndex + 1,
          };
        }
      }

      const window: WindowInstance = {
        id: crypto.randomUUID() as WindowId,
        appId: action.app.id,
        title: action.app.title,
        position: { x: 100, y: 100 },
        size: action.app.defaultSize,
        state: 'open',
        zIndex: state.nextZIndex,
        previousState: null,
      };

      return {
        ...state,
        windows: new Map(state.windows).set(window.id, window),
        focusedWindowId: window.id,
        nextZIndex: state.nextZIndex + 1,
      };
    }
    case 'CLOSE_WINDOW': {
      if (!state.windows.has(action.windowId)) return state;

      return {
        ...state,
        windows: (() => {
          const newWindows = new Map(state.windows);
          newWindows.delete(action.windowId);
          return newWindows;
        })(),
        focusedWindowId:
          state.focusedWindowId === action.windowId
            ? null
            : state.focusedWindowId,
      };
    }
    case 'FOCUS_WINDOW': {
      const window = state.windows.get(action.windowId);
      if (!window || window.state === 'minimized') return state;

      return {
        ...state,
        windows: (() => {
          const newWindows = new Map(state.windows);
          const windowToFocus = newWindows.get(action.windowId);
          if (windowToFocus) {
            newWindows.set(action.windowId, {
              ...windowToFocus,
              zIndex: state.nextZIndex,
            });
          }
          return newWindows;
        })(),
        focusedWindowId: action.windowId,
        nextZIndex: state.nextZIndex + 1,
      };
    }
    case 'MINIMIZE_WINDOW': {
      const window = state.windows.get(action.windowId);
      if (!window || window.state === 'minimized') return state;

      return {
        ...state,
        windows: (() => {
          const newWindows = new Map(state.windows);
          newWindows.set(action.windowId, {
            ...window,
            state: 'minimized',
            previousState: window.state,
          });
          return newWindows;
        })(),
        focusedWindowId:
          (state.focusedWindowId === action.windowId
            ? Array.from(state.windows.values())
                .filter(
                  (w) => w.id !== action.windowId && w.state !== 'minimized',
                )
                .sort((a, b) => b.zIndex - a.zIndex)[0]?.id
            : state.focusedWindowId) ?? null,
      };
    }
    case 'TOGGLE_MAXIMIZE': {
      const window = state.windows.get(action.windowId);
      if (!window || window.state === 'minimized') return state;

      return {
        ...state,
        windows: (() => {
          const newWindows = new Map(state.windows);
          const windowToMaximize = newWindows.get(action.windowId);
          if (windowToMaximize) {
            newWindows.set(action.windowId, {
              ...windowToMaximize,
              state:
                windowToMaximize.state === 'maximized' ? 'open' : 'maximized',
              zIndex: state.nextZIndex,
            });
          }
          return newWindows;
        })(),
        focusedWindowId: action.windowId,
        nextZIndex: state.nextZIndex + 1,
      };
    }
    case 'MOVE_WINDOW': {
      if (!state.windows.has(action.windowId)) return state;

      return {
        ...state,
        windows: (() => {
          const newWindows = new Map(state.windows);
          const windowToMove = newWindows.get(action.windowId);
          if (windowToMove) {
            newWindows.set(action.windowId, {
              ...windowToMove,
              position: action.position,
            });
          }
          return newWindows;
        })(),
      };
    }
    case 'RESIZE_WINDOW': {
      if (!state.windows.has(action.windowId)) return state;

      return {
        ...state,
        windows: (() => {
          const newWindows = new Map(state.windows);
          const windowToResize = newWindows.get(action.windowId);
          if (windowToResize) {
            newWindows.set(action.windowId, {
              ...windowToResize,
              size: action.size,
            });
          }
          return newWindows;
        })(),
      };
    }
    case 'RESTORE_WINDOW': {
      const window = state.windows.get(action.windowId);
      if (window?.state !== 'minimized') return state;

      return {
        ...state,
        windows: (() => {
          const newWindows = new Map(state.windows);
          const windowToRestore = newWindows.get(action.windowId);
          if (windowToRestore) {
            newWindows.set(action.windowId, {
              ...windowToRestore,
              state: windowToRestore.previousState ?? 'open',
              previousState: null,
            });
          }
          return newWindows;
        })(),
        focusedWindowId: action.windowId,
        nextZIndex: state.nextZIndex + 1,
      };
    }
    default: {
      action satisfies never;
      return state;
    }
  }
}
