import { useReducer, type ReactNode } from 'react';
import { WindowManagerContext } from '@/features/desktop/windowManager/WindowManagerContext.ts';
import {
  initialWindowsState,
  windowsReducer,
} from '@/features/desktop/windowManager/reducer.ts';

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowsReducer, initialWindowsState);

  return (
    <WindowManagerContext.Provider value={{ state, dispatch }}>
      {children}
    </WindowManagerContext.Provider>
  );
}
