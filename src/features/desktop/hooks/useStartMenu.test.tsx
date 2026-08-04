import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  useStartMenu,
  type StartMenuHandlers,
} from '@/features/desktop/hooks/useStartMenu.ts';
import { StartMenuContext } from '@/features/desktop/StartMenuContext.tsx';

function makeHandlers(
  overrides: Partial<StartMenuHandlers> = {},
): StartMenuHandlers {
  return {
    isStartMenuOpen: false,
    closeStartMenu: vi.fn(),
    onStartMenuToggle: vi.fn(),
    ...overrides,
  };
}

describe('useStartMenu', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the start menu handlers from the provider', () => {
    const handlers = makeHandlers({ isStartMenuOpen: true });
    const { result } = renderHook(() => useStartMenu(), {
      wrapper: ({ children }) => (
        <StartMenuContext.Provider value={handlers}>
          {children}
        </StartMenuContext.Provider>
      ),
    });

    expect(result.current.isStartMenuOpen).toBe(true);
    expect(result.current.closeStartMenu).toBe(handlers.closeStartMenu);
    expect(result.current.onStartMenuToggle).toBe(handlers.onStartMenuToggle);
  });

  it('reflects an updated context value on re-render', () => {
    let value = makeHandlers({ isStartMenuOpen: false });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StartMenuContext.Provider value={value}>
        {children}
      </StartMenuContext.Provider>
    );

    const { result, rerender } = renderHook(() => useStartMenu(), { wrapper });
    expect(result.current.isStartMenuOpen).toBe(false);

    value = makeHandlers({ isStartMenuOpen: true });
    rerender();

    expect(result.current.isStartMenuOpen).toBe(true);
    expect(result.current.closeStartMenu).toBe(value.closeStartMenu);
  });

  it('throws when used outside of a StartMenuProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useStartMenu())).toThrow();
    spy.mockRestore();
  });
});
