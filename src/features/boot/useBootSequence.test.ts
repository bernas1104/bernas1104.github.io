import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useBootSequence,
  shouldPlayBootSequence,
} from '@/features/boot/useBootSequence.ts';
import {
  BOOT_MIN_DURATION_MS,
  BOOT_PLAYED_SESSION_KEY,
} from '@/features/boot/config.ts';
import type { BootEnvironment } from '@/features/boot/types.ts';

const production: BootEnvironment = { isDevelopment: false, isTest: false };
const development: BootEnvironment = { isDevelopment: true, isTest: false };
const test: BootEnvironment = { isDevelopment: false, isTest: true };

describe('shouldPlayBootSequence', () => {
  it('plays in development regardless of session state', () => {
    expect(shouldPlayBootSequence(development, false, false)).toBe(true);
    expect(shouldPlayBootSequence(development, true, false)).toBe(true);
  });

  it('plays in test mode regardless of session state', () => {
    expect(shouldPlayBootSequence(test, false, false)).toBe(true);
    expect(shouldPlayBootSequence(test, true, false)).toBe(true);
  });

  it('plays in production when the session has not played yet', () => {
    expect(shouldPlayBootSequence(production, false, false)).toBe(true);
  });

  it('does not play in production when the session has already played', () => {
    expect(shouldPlayBootSequence(production, true, false)).toBe(false);
  });

  it('never plays when a skip is requested', () => {
    expect(shouldPlayBootSequence(development, false, true)).toBe(false);
    expect(shouldPlayBootSequence(production, true, true)).toBe(false);
  });

  it('treats an undefined environment as production', () => {
    expect(shouldPlayBootSequence(undefined, false, false)).toBe(true);
    expect(shouldPlayBootSequence(undefined, true, false)).toBe(false);
  });
});

describe('useBootSequence', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('starts in the booting status', () => {
    const { result } = renderHook(() =>
      useBootSequence({ environment: production }),
    );
    expect(result.current.status).toBe('booting');
  });

  it('returns a skip handler that dismisses the boot sequence', () => {
    const { result } = renderHook(() =>
      useBootSequence({ environment: production }),
    );
    act(() => result.current.skip());
    expect(result.current.status).toBe('dismissed');
  });

  it('auto-dismisses after minDurationMs', () => {
    const { result } = renderHook(() =>
      useBootSequence({ environment: production, minDurationMs: 500 }),
    );
    expect(result.current.status).toBe('booting');

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current.status).toBe('booting');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.status).toBe('dismissed');
  });

  it('uses BOOT_MIN_DURATION_MS when no minDurationMs is provided', () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    renderHook(() => useBootSequence({ environment: production }));
    expect(setTimeoutSpy).toHaveBeenCalledWith(
      expect.any(Function),
      BOOT_MIN_DURATION_MS,
    );
  });

  it('clears the boot timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { unmount } = renderHook(() =>
      useBootSequence({ environment: production }),
    );
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('persists the played flag in production after dismissal', () => {
    const { result } = renderHook(() =>
      useBootSequence({ environment: production }),
    );
    act(() => result.current.skip());
    expect(sessionStorage.getItem(BOOT_PLAYED_SESSION_KEY)).toBe('true');
  });

  it('does not persist the played flag in development', () => {
    const { result } = renderHook(() =>
      useBootSequence({ environment: development }),
    );
    act(() => result.current.skip());
    expect(sessionStorage.getItem(BOOT_PLAYED_SESSION_KEY)).toBeNull();
  });

  it('does not persist the played flag in test mode', () => {
    const { result } = renderHook(() => useBootSequence({ environment: test }));
    act(() => result.current.skip());
    expect(sessionStorage.getItem(BOOT_PLAYED_SESSION_KEY)).toBeNull();
  });

  it('starts dismissed in production when the session has already played', () => {
    sessionStorage.setItem(BOOT_PLAYED_SESSION_KEY, 'true');
    const { result } = renderHook(() =>
      useBootSequence({ environment: production }),
    );
    expect(result.current.status).toBe('dismissed');
  });

  it('starts dismissed when the skipBoot URL param is present', () => {
    window.history.replaceState({}, '', '/?skipBoot');
    const { result } = renderHook(() =>
      useBootSequence({ environment: production }),
    );
    expect(result.current.status).toBe('dismissed');
  });

  it('does not schedule a timeout when already dismissed', () => {
    sessionStorage.setItem(BOOT_PLAYED_SESSION_KEY, 'true');
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    renderHook(() => useBootSequence({ environment: production }));
    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });
});
