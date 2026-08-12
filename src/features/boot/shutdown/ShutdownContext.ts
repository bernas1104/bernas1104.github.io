import { type Dispatch, createContext } from 'react';
import type { ShutdownState } from '@/features/boot/shutdown/types.ts';
import type { ShutdownAction } from '@/features/boot/shutdown/actions.ts';

interface ShutdownContextValue {
  state: ShutdownState;
  dispatch: Dispatch<ShutdownAction>;
}

export const ShutdownContext = createContext<ShutdownContextValue | null>(null);
