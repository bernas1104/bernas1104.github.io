import { useCallback, useEffect, useReducer } from 'react';
import {
  BOOT_MIN_DURATION_MS,
  BOOT_PLAYED_SESSION_KEY,
  bootReducer,
  createInitialBootState,
  skipBoot,
  timeoutBoot,
  type BootEnvironment,
  type BootSequenceConfig,
} from '@/features/boot/index.ts';
import type { BootStatus } from '@/features/boot/types.ts';

export type BootSequenceHandlers = {
  status: BootStatus;
  skip: () => void;
};

export function shouldPlayBootSequence(
  environment: BootEnvironment | undefined,
  sessionHasPlayed: boolean,
  skipRequested: boolean,
): boolean {
  if (skipRequested) return false;
  if (environment?.isDevelopment || environment?.isTest) return true;
  if (sessionHasPlayed) return false;

  return true;
}

export function useBootSequence(
  options: Partial<BootSequenceConfig> = {},
): BootSequenceHandlers {
  const {
    minDurationMs = BOOT_MIN_DURATION_MS,
    environment = {
      isDevelopment: import.meta.env.DEV,
      isTest: import.meta.env.MODE === 'test',
    },
  } = options;
  const [state, dispatch] = useReducer(bootReducer, undefined, () => {
    const skipRequested = new URLSearchParams(window.location.search).has(
      'skipBoot',
    );
    const sessionHasPlayed = Boolean(
      sessionStorage.getItem(BOOT_PLAYED_SESSION_KEY),
    );

    return createInitialBootState(() =>
      shouldPlayBootSequence(environment, sessionHasPlayed, skipRequested),
    );
  });

  const status = state.status;
  const skip = useCallback(() => dispatch(skipBoot()), [dispatch]);

  useEffect(() => {
    if (status !== 'booting') return;

    const timer = window.setTimeout(() => {
      dispatch(timeoutBoot());
    }, minDurationMs);

    return () => clearTimeout(timer);
  }, [status, dispatch, minDurationMs]);

  useEffect(() => {
    const isProduction = !environment?.isDevelopment && !environment?.isTest;
    if (status === 'dismissed' && isProduction)
      sessionStorage.setItem(BOOT_PLAYED_SESSION_KEY, 'true');
  }, [status, environment?.isDevelopment, environment?.isTest]);

  return { status, skip };
}
