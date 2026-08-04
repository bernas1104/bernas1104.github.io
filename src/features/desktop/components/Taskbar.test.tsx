import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Taskbar } from '@/features/desktop/components/Taskbar.tsx';
import { WindowManagerContext } from '@/features/desktop/windowManager/index.ts';
import type { WindowAction } from '@/features/desktop/windowManager/index.ts';
import { StartMenuContext } from '@/features/desktop/StartMenuContext.tsx';
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

interface Handlers {
  isStartMenuOpen: boolean;
  closeStartMenu: () => void;
  onStartMenuToggle: () => void;
}

function renderTaskbar(
  state: DesktopState = makeState(),
  handlers: Handlers = {
    isStartMenuOpen: false,
    closeStartMenu: vi.fn(),
    onStartMenuToggle: vi.fn(),
  },
) {
  const dispatch = vi.fn<(action: WindowAction) => void>();
  const utils = render(
    <WindowManagerContext.Provider value={{ state, dispatch }}>
      <StartMenuContext.Provider value={handlers}>
        <Taskbar />
      </StartMenuContext.Provider>
    </WindowManagerContext.Provider>,
  );
  return { ...utils, dispatch, handlers };
}

describe('Taskbar', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('renders the taskbar container', () => {
    const { container } = renderTaskbar();
    expect(container.querySelector('.taskbar')).toBeInTheDocument();
  });

  it('renders the Start button with the Start icon and label', () => {
    const { container, getByAltText, getByText } = renderTaskbar();
    const startButton = container.querySelector('.start-menu-button');
    expect(startButton).toBeInTheDocument();
    expect(startButton).toHaveAttribute('role', 'button');
    expect(getByAltText('Start Menu')).toBeInTheDocument();
    expect(getByText('Start')).toBeInTheDocument();
  });

  it('renders no taskbar buttons when there are no windows', () => {
    const { container } = renderTaskbar();
    expect(container.querySelectorAll('.taskbar-button')).toHaveLength(0);
  });

  it('renders one taskbar button per window', () => {
    const w1 = makeWindow({ id: makeWindowId('w1'), title: 'Notepad' });
    const w2 = makeWindow({ id: makeWindowId('w2'), title: 'Calculator' });
    const state = makeState({
      windows: new Map([
        [w1.id, w1],
        [w2.id, w2],
      ]),
    });

    const { container } = renderTaskbar(state);

    expect(container.querySelectorAll('.taskbar-button')).toHaveLength(2);
  });

  it('renders the window title as the button label', () => {
    const w = makeWindow({ id: makeWindowId('w1'), title: 'Notepad' });
    const state = makeState({ windows: new Map([[w.id, w]]) });

    const { getByText } = renderTaskbar(state);

    expect(getByText('Notepad')).toBeInTheDocument();
  });

  it('renders buttons ordered by ascending zIndex', () => {
    const low = makeWindow({
      id: makeWindowId('low'),
      title: 'Low',
      zIndex: 1,
    });
    const high = makeWindow({
      id: makeWindowId('high'),
      title: 'High',
      zIndex: 3,
    });
    const mid = makeWindow({
      id: makeWindowId('mid'),
      title: 'Mid',
      zIndex: 2,
    });
    const state = makeState({
      windows: new Map([
        [high.id, high],
        [low.id, low],
        [mid.id, mid],
      ]),
    });

    const { container } = renderTaskbar(state);
    const titles = [...container.querySelectorAll('.taskbar-button')].map(
      (b) => b.textContent,
    );

    expect(titles).toEqual(['Low', 'Mid', 'High']);
  });

  it('applies the focused class only to the focused window button', () => {
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

    const { getByText } = renderTaskbar(state);

    expect(getByText('Focused')).toHaveClass('focused');
    expect(getByText('Other')).not.toHaveClass('focused');
  });

  it('renders the clock', () => {
    const { container } = renderTaskbar();
    expect(container.querySelector('.clock-container')).toBeInTheDocument();
  });

  it('calls onStartMenuToggle when the Start button is clicked', () => {
    const { container, handlers } = renderTaskbar();
    fireEvent.click(
      container.querySelector('.start-menu-button') as HTMLElement,
    );
    expect(handlers.onStartMenuToggle).toHaveBeenCalledTimes(1);
  });

  it('dispatches MINIMIZE_WINDOW when the focused open window button is clicked', () => {
    const win = makeWindow({
      id: makeWindowId('w1'),
      title: 'Notepad',
      state: 'open',
    });
    const state = makeState({
      windows: new Map([[win.id, win]]),
      focusedWindowId: win.id,
    });

    const { getByText, dispatch } = renderTaskbar(state);
    fireEvent.click(getByText('Notepad'));

    expect(dispatch).toHaveBeenCalledWith({
      type: 'MINIMIZE_WINDOW',
      windowId: win.id,
    });
  });

  it('dispatches FOCUS_WINDOW when a non-focused open window button is clicked', () => {
    const win = makeWindow({
      id: makeWindowId('w1'),
      title: 'Notepad',
      state: 'open',
    });
    const other = makeWindow({
      id: makeWindowId('w2'),
      title: 'Other',
      state: 'open',
      zIndex: 2,
    });
    const state = makeState({
      windows: new Map([
        [win.id, win],
        [other.id, other],
      ]),
      focusedWindowId: other.id,
    });

    const { getByText, dispatch } = renderTaskbar(state);
    fireEvent.click(getByText('Notepad'));

    expect(dispatch).toHaveBeenCalledWith({
      type: 'FOCUS_WINDOW',
      windowId: win.id,
    });
  });

  it('dispatches FOCUS_WINDOW when an open window button is clicked with no focused window', () => {
    const win = makeWindow({
      id: makeWindowId('w1'),
      title: 'Notepad',
      state: 'open',
    });
    const state = makeState({
      windows: new Map([[win.id, win]]),
      focusedWindowId: null,
    });

    const { getByText, dispatch } = renderTaskbar(state);
    fireEvent.click(getByText('Notepad'));

    expect(dispatch).toHaveBeenCalledWith({
      type: 'FOCUS_WINDOW',
      windowId: win.id,
    });
  });

  it('dispatches RESTORE_WINDOW when a minimized window button is clicked', () => {
    const win = makeWindow({
      id: makeWindowId('w1'),
      title: 'Notepad',
      state: 'minimized',
    });
    const state = makeState({
      windows: new Map([[win.id, win]]),
      focusedWindowId: null,
    });

    const { getByText, dispatch } = renderTaskbar(state);
    fireEvent.click(getByText('Notepad'));

    expect(dispatch).toHaveBeenCalledWith({
      type: 'RESTORE_WINDOW',
      windowId: win.id,
    });
  });
});
