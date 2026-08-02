import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Desktop } from '@/features/desktop/components/Desktop.tsx';
import { WindowManagerContext } from '@/features/desktop/windowManager/WindowManagerContext.ts';
import type { WindowAction } from '@/features/desktop/windowManager/index.ts';
import type {
  DesktopState,
  WindowId,
  WindowInstance,
} from '@/features/desktop/types.ts';
import { makeWindow, makeWindowId } from '@/features/desktop/testUtils.ts';

const makeState = (overrides: Partial<DesktopState> = {}): DesktopState => ({
  windows: new Map<WindowId, WindowInstance>(),
  focusedWindowId: null,
  nextZIndex: 1,
  windowsOpenedCount: 0,
  ...overrides,
});

function renderDesktop(state: DesktopState = makeState()) {
  const dispatch = vi.fn<(action: WindowAction) => void>();
  const utils = render(
    <WindowManagerContext.Provider value={{ state, dispatch }}>
      <Desktop />
    </WindowManagerContext.Provider>,
  );
  return { ...utils, dispatch };
}

describe('Desktop', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the desktop container', () => {
    const { container } = renderDesktop();
    expect(container.querySelector('.desktop')).toBeInTheDocument();
  });

  it('renders a desktop icon', () => {
    const { getByRole } = renderDesktop();
    expect(getByRole('button', { name: 'BernasOS' })).toBeInTheDocument();
  });

  it('renders no windows when the state is empty', () => {
    const { container } = renderDesktop();
    expect(container.querySelectorAll('.window')).toHaveLength(0);
  });

  it('dispatches CLEAR_FOCUS when the desktop background is clicked', () => {
    const { container, dispatch } = renderDesktop();
    fireEvent.click(container.querySelector('.desktop') as HTMLElement);
    expect(dispatch).toHaveBeenCalledWith({ type: 'CLEAR_FOCUS' });
  });

  it('renders a window for each non-minimized window in state', () => {
    const win1 = makeWindow({
      id: makeWindowId('w1'),
      title: 'Window One',
      state: 'open',
    });
    const win2 = makeWindow({
      id: makeWindowId('w2'),
      title: 'Window Two',
      state: 'open',
    });
    const state = makeState({
      windows: new Map([
        [win1.id, win1],
        [win2.id, win2],
      ]),
    });

    const { getByText, container } = renderDesktop(state);

    expect(getByText('Window One')).toBeInTheDocument();
    expect(getByText('Window Two')).toBeInTheDocument();
    expect(container.querySelectorAll('.window')).toHaveLength(2);
  });

  it('does not render minimized windows', () => {
    const open = makeWindow({
      id: makeWindowId('w1'),
      title: 'Visible',
      state: 'open',
    });
    const minimized = makeWindow({
      id: makeWindowId('w2'),
      title: 'Hidden',
      state: 'minimized',
    });
    const state = makeState({
      windows: new Map([
        [open.id, open],
        [minimized.id, minimized],
      ]),
    });

    const { container, queryByText } = renderDesktop(state);

    expect(container.querySelectorAll('.window')).toHaveLength(1);
    expect(queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('renders windows ordered by descending zIndex (highest first in DOM)', () => {
    const low = makeWindow({
      id: makeWindowId('low'),
      title: 'Low',
      zIndex: 1,
    });
    const high = makeWindow({
      id: makeWindowId('high'),
      title: 'High',
      zIndex: 9,
    });
    const mid = makeWindow({
      id: makeWindowId('mid'),
      title: 'Mid',
      zIndex: 5,
    });
    const state = makeState({
      windows: new Map([
        [low.id, low],
        [high.id, high],
        [mid.id, mid],
      ]),
    });

    const { container } = renderDesktop(state);
    const titleTexts = [...container.querySelectorAll('.title-bar-text')].map(
      (el) => el.textContent,
    );

    expect(titleTexts).toEqual(['Low', 'Mid', 'High']);
  });

  it('marks the focused window as active and the others as inactive', () => {
    const focused = makeWindow({
      id: makeWindowId('focused'),
      title: 'Focused',
      zIndex: 1,
    });
    const other = makeWindow({
      id: makeWindowId('other'),
      title: 'Other',
      zIndex: 2,
    });
    const state = makeState({
      windows: new Map([
        [focused.id, focused],
        [other.id, other],
      ]),
      focusedWindowId: focused.id,
    });

    const { container } = renderDesktop(state);
    const titleBars = [...container.querySelectorAll('.title-bar')];
    const focusedBar = titleBars.find((bar) =>
      bar.textContent?.includes('Focused'),
    );
    const otherBar = titleBars.find((bar) =>
      bar.textContent?.includes('Other'),
    );

    expect(focusedBar).not.toHaveClass('inactive');
    expect(otherBar).toHaveClass('inactive');
  });

  it('does not dispatch CLEAR_FOCUS when a window is clicked', () => {
    const win = makeWindow({
      id: makeWindowId('w1'),
      title: 'Win',
      state: 'open',
    });
    const state = makeState({
      windows: new Map([[win.id, win]]),
      focusedWindowId: win.id,
    });

    const { container, dispatch } = renderDesktop(state);
    fireEvent.click(container.querySelector('.window') as HTMLElement);

    expect(dispatch).not.toHaveBeenCalledWith({ type: 'CLEAR_FOCUS' });
  });

  it('uses the app from the module to render the desktop icon', () => {
    const { getByRole } = renderDesktop();
    const icon = getByRole('button', { name: 'BernasOS' });
    expect(icon).toBeInTheDocument();
    expect(icon.tagName).toBe('DIV');
  });
});
