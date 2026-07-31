import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  TitleBar,
  type TitleBarProps,
} from '@/features/desktop/components/TitleBar.tsx';
import { WindowManagerContext } from '@/features/desktop/windowManager/WindowManagerContext.ts';
import { initialWindowsState } from '@/features/desktop/windowManager/reducer.ts';
import type { WindowAction } from '@/features/desktop/windowManager/index.ts';
import { makeWindow, makeWindowId } from '@/features/desktop/testUtils.ts';

function renderTitleBar(props: TitleBarProps) {
  const dispatch = vi.fn<(action: WindowAction) => void>();
  const utils = render(
    <WindowManagerContext.Provider
      value={{ state: initialWindowsState, dispatch }}
    >
      <TitleBar {...props} />
    </WindowManagerContext.Provider>,
  );
  return { ...utils, dispatch };
}

describe('TitleBar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the title text', () => {
    const win = makeWindow({ id: makeWindowId('w1'), title: 'My App' });
    const { getByText } = renderTitleBar({
      title: 'My App',
      window: win,
      isFocused: true,
    });
    expect(getByText('My App')).toBeInTheDocument();
  });

  it('renders Minimize, Maximize, and Close controls when open', () => {
    const win = makeWindow({ id: makeWindowId('w1'), state: 'open' });
    const { getByRole } = renderTitleBar({
      title: 'T',
      window: win,
      isFocused: true,
    });
    expect(getByRole('button', { name: 'Minimize' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Maximize' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('renders Restore instead of Maximize when maximized', () => {
    const win = makeWindow({ id: makeWindowId('w1'), state: 'maximized' });
    const { getByRole, queryByRole } = renderTitleBar({
      title: 'T',
      window: win,
      isFocused: true,
    });
    expect(getByRole('button', { name: 'Restore' })).toBeInTheDocument();
    expect(queryByRole('button', { name: 'Maximize' })).not.toBeInTheDocument();
  });

  it('applies the inactive class when not focused', () => {
    const win = makeWindow({ id: makeWindowId('w1') });
    const { container } = renderTitleBar({
      title: 'T',
      window: win,
      isFocused: false,
    });
    expect(container.querySelector('.title-bar')).toHaveClass('inactive');
  });

  it('omits the inactive class when focused', () => {
    const win = makeWindow({ id: makeWindowId('w1') });
    const { container } = renderTitleBar({
      title: 'T',
      window: win,
      isFocused: true,
    });
    expect(container.querySelector('.title-bar')).not.toHaveClass('inactive');
  });

  it('dispatches MINIMIZE_WINDOW when the Minimize button is pressed', () => {
    const win = makeWindow({ id: makeWindowId('w1'), state: 'open' });
    const { getByRole, dispatch } = renderTitleBar({
      title: 'T',
      window: win,
      isFocused: true,
    });
    fireEvent.click(getByRole('button', { name: 'Minimize' }));
    expect(dispatch).toHaveBeenCalledWith({
      type: 'MINIMIZE_WINDOW',
      windowId: win.id,
    });
  });

  it('dispatches TOGGLE_MAXIMIZE when the Maximize button is pressed', () => {
    const win = makeWindow({ id: makeWindowId('w1'), state: 'open' });
    const { getByRole, dispatch } = renderTitleBar({
      title: 'T',
      window: win,
      isFocused: true,
    });
    fireEvent.click(getByRole('button', { name: 'Maximize' }));
    expect(dispatch).toHaveBeenCalledWith({
      type: 'TOGGLE_MAXIMIZE',
      windowId: win.id,
    });
  });

  it('dispatches TOGGLE_MAXIMIZE when the Restore button is pressed', () => {
    const win = makeWindow({ id: makeWindowId('w1'), state: 'maximized' });
    const { getByRole, dispatch } = renderTitleBar({
      title: 'T',
      window: win,
      isFocused: true,
    });
    fireEvent.click(getByRole('button', { name: 'Restore' }));
    expect(dispatch).toHaveBeenCalledWith({
      type: 'TOGGLE_MAXIMIZE',
      windowId: win.id,
    });
  });

  it('dispatches CLOSE_WINDOW when the Close button is pressed', () => {
    const win = makeWindow({ id: makeWindowId('w1'), state: 'open' });
    const { getByRole, dispatch } = renderTitleBar({
      title: 'T',
      window: win,
      isFocused: true,
    });
    fireEvent.click(getByRole('button', { name: 'Close' }));
    expect(dispatch).toHaveBeenCalledWith({
      type: 'CLOSE_WINDOW',
      windowId: win.id,
    });
  });

  it('does not start a drag when a control button is pressed', () => {
    const win = makeWindow({
      id: makeWindowId('w1'),
      state: 'open',
      position: { x: 100, y: 100 },
    });
    const { getByRole, container, dispatch } = renderTitleBar({
      title: 'T',
      window: win,
      isFocused: true,
    });
    const titleBar = container.querySelector('.title-bar') as HTMLElement;
    fireEvent.pointerDown(getByRole('button', { name: 'Minimize' }));
    titleBar.dispatchEvent(
      new PointerEvent('pointermove', {
        clientX: 50,
        clientY: 50,
        pointerId: 1,
      }),
    );
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'MOVE_WINDOW' }),
    );
    fireEvent.click(getByRole('button', { name: 'Minimize' }));
    expect(dispatch).toHaveBeenCalledWith({
      type: 'MINIMIZE_WINDOW',
      windowId: win.id,
    });
  });

  it('dispatches MOVE_WINDOW with the new position when the title bar is dragged', () => {
    const win = makeWindow({
      id: makeWindowId('w1'),
      state: 'open',
      position: { x: 100, y: 100 },
    });
    const { container, dispatch } = renderTitleBar({
      title: 'T',
      window: win,
      isFocused: true,
    });
    const titleBar = container.querySelector('.title-bar') as HTMLElement;
    fireEvent.pointerDown(titleBar, { clientX: 10, clientY: 20, pointerId: 1 });
    fireEvent.pointerMove(titleBar, { clientX: 60, clientY: 45, pointerId: 1 });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'MOVE_WINDOW',
      windowId: win.id,
      position: { x: 150, y: 125 },
    });
  });
});
