import { createContext, type Dispatch } from 'react';
import type { WindowAction } from '@/features/desktop/windowManager/actions.ts';
import type { DesktopState } from '@/features/desktop/types.ts';

interface WindowManagerContextValue {
  state: DesktopState;
  dispatch: Dispatch<WindowAction>;
}

export const WindowManagerContext =
  createContext<WindowManagerContextValue | null>(null);
