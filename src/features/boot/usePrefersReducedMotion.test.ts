import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usePrefersReducedMotion } from '@/features/boot/usePrefersReducedMotion.ts';

type ChangeListener = (event: MediaQueryListEvent) => void;

type MatchMediaSpies = {
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
};

function stubMatchMedia(matches: boolean): {
  spies: MatchMediaSpies;
  listeners: Set<ChangeListener>;
} {
  const listeners = new Set<ChangeListener>();
  const spies = {
    addEventListener: vi.fn((type: string, listener: ChangeListener) => {
      if (type === 'change') listeners.add(listener);
    }),
    removeEventListener: vi.fn((type: string, listener: ChangeListener) => {
      if (type === 'change') listeners.delete(listener);
    }),
  };
  const mediaQueryList = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    ...spies,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList;
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mediaQueryList),
  );
  return { spies, listeners };
}

describe('usePrefersReducedMotion', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns the initial matchMedia matches value', () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when the initial query matches', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it('updates when the media query change event fires', () => {
    const { listeners } = stubMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      [...listeners][0]?.({ matches: true } as MediaQueryListEvent);
    });
    expect(result.current).toBe(true);
  });

  it('subscribes to the change event on mount', () => {
    const { spies } = stubMatchMedia(false);
    renderHook(() => usePrefersReducedMotion());
    expect(spies.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('removes the change listener on unmount', () => {
    const { spies } = stubMatchMedia(false);
    const { unmount } = renderHook(() => usePrefersReducedMotion());

    const changeListener = spies.addEventListener.mock.calls[0]?.[1];
    unmount();

    expect(changeListener).toBeDefined();
    expect(spies.removeEventListener).toHaveBeenCalledWith(
      'change',
      changeListener,
    );
  });
});
