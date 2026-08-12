import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useShutdown } from '@/features/boot/shutdown/useShutdown.ts';
import { ShutdownProvider } from '@/features/boot/shutdown/ShutdownProvider.tsx';
import { beginShutdown } from '@/features/boot/shutdown/actions.ts';
import {
  BOOT_MIN_DURATION_MS,
  BOOT_PLAYED_SESSION_KEY,
} from '@/features/boot/config.ts';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ShutdownProvider>{children}</ShutdownProvider>
);

describe('useShutdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('starts in the idle status', () => {
    const { result } = renderHook(() => useShutdown(), { wrapper });
    expect(result.current.state.status).toBe('idle');
  });

  it('transitions to shuttingDown on BEGIN_SHUTDOWN and resets the boot flag', () => {
    sessionStorage.setItem(BOOT_PLAYED_SESSION_KEY, 'true');
    const { result } = renderHook(() => useShutdown(), { wrapper });

    act(() => result.current.dispatch(beginShutdown()));

    expect(result.current.state.status).toBe('shuttingDown');
    expect(sessionStorage.getItem(BOOT_PLAYED_SESSION_KEY)).toBeNull();
  });

  it('moves to off after BOOT_MIN_DURATION_MS without closing the window yet', () => {
    const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {});
    const { result } = renderHook(() => useShutdown(), { wrapper });

    act(() => result.current.dispatch(beginShutdown()));
    expect(result.current.state.status).toBe('shuttingDown');

    act(() => {
      vi.advanceTimersByTime(BOOT_MIN_DURATION_MS - 1);
    });
    expect(result.current.state.status).toBe('shuttingDown');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.state.status).toBe('off');
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('closes the window after another BOOT_MIN_DURATION_MS once off', () => {
    const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {});
    const { result } = renderHook(() => useShutdown(), { wrapper });

    act(() => result.current.dispatch(beginShutdown()));

    act(() => {
      vi.advanceTimersByTime(BOOT_MIN_DURATION_MS);
    });
    expect(result.current.state.status).toBe('off');
    expect(closeSpy).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(BOOT_MIN_DURATION_MS - 1);
    });
    expect(closeSpy).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('never closes the window while idle', () => {
    const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {});
    renderHook(() => useShutdown(), { wrapper });

    act(() => {
      vi.advanceTimersByTime(BOOT_MIN_DURATION_MS * 2);
    });

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('clears pending timers on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { result, unmount } = renderHook(() => useShutdown(), { wrapper });

    act(() => result.current.dispatch(beginShutdown()));
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('throws when used outside of a ShutdownProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useShutdown())).toThrow();
    spy.mockRestore();
  });
});
