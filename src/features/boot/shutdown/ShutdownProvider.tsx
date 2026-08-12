import { useEffect, useMemo, useReducer, type ReactNode } from 'react';
import {
  shutdownReducer,
  initialShutdownState,
} from '@/features/boot/shutdown/reducer.ts';
import { ShutdownContext } from '@/features/boot/shutdown/ShutdownContext.ts';
import { finishShutdown } from '@/features/boot/shutdown/actions.ts';
import {
  BOOT_MIN_DURATION_MS,
  BOOT_PLAYED_SESSION_KEY,
} from '@/features/boot/config.ts';

export function ShutdownProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(shutdownReducer, initialShutdownState);
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  useEffect(() => {
    if (state.status !== 'shuttingDown') return;

    sessionStorage.removeItem(BOOT_PLAYED_SESSION_KEY);
    const timer = window.setTimeout(
      () => dispatch(finishShutdown()),
      BOOT_MIN_DURATION_MS,
    );

    return () => window.clearTimeout(timer);
  }, [state.status, dispatch]);

  useEffect(() => {
    if (state.status !== 'off') return;

    const timer = window.setTimeout(() => window.close(), BOOT_MIN_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [state.status]);

  return (
    <ShutdownContext.Provider value={value}>
      {children}
    </ShutdownContext.Provider>
  );
}
