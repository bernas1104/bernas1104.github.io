import { useMemo, useReducer, type ReactNode } from 'react';
import { WindowManagerContext } from '@/features/desktop/windowManager/WindowManagerContext.ts';
import {
  initialWindowsState,
  windowsReducer,
} from '@/features/desktop/windowManager/reducer.ts';

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowsReducer, initialWindowsState);
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
}
