import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  Window,
  type WindowProps,
} from '@/features/desktop/components/Window.tsx';
import { WindowManagerContext } from '@/features/desktop/windowManager/WindowManagerContext.ts';
import { initialWindowsState } from '@/features/desktop/windowManager/reducer.ts';
import type { WindowAction } from '@/features/desktop/windowManager/index.ts';
import {
  makeApp,
  makeAppId,
  makeWindow,
  makeWindowId,
} from '@/features/desktop/testUtils.ts';

function renderWindow(props: WindowProps) {
  const dispatch = vi.fn<(action: WindowAction) => void>();
  const utils = render(
    <WindowManagerContext.Provider
      value={{ state: initialWindowsState, dispatch }}
    >
      <Window {...props} />
    </WindowManagerContext.Provider>,
  );
  return { ...utils, dispatch };
}

describe('Window', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when minimized', () => {
    const app = makeApp({ id: makeAppId('a1') });
    const win = makeWindow({ id: makeWindowId('w1'), state: 'minimized' });
    const { container } = renderWindow({
      app,
      window: win,
      focusedWindowId: win.id,
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the window chrome with title and body when open', () => {
    const app = makeApp({ id: makeAppId('a1') });
    const win = makeWindow({
      id: makeWindowId('w1'),
      title: 'Notepad',
      state: 'open',
    });
    const { container, getByText } = renderWindow({
      app,
      window: win,
      focusedWindowId: win.id,
    });
    expect(container.querySelector('.window')).toBeInTheDocument();
    expect(getByText('Notepad')).toBeInTheDocument();
    expect(container.querySelector('.window-body')).toBeInTheDocument();
  });

  it('positions and sizes the window from its position and size when open', () => {
    const app = makeApp({ id: makeAppId('a1') });
    const win = makeWindow({
      id: makeWindowId('w1'),
      position: { x: 120, y: 80 },
      size: { width: 320, height: 240 },
      state: 'open',
    });
    const { container } = renderWindow({
      app,
      window: win,
      focusedWindowId: win.id,
    });
    const el = container.querySelector('.window') as HTMLElement;
    expect(el.style.top).toBe('80px');
    expect(el.style.left).toBe('120px');
    expect(el.style.width).toBe('320px');
    expect(el.style.height).toBe('240px');
  });

  it('fills the viewport when maximized', () => {
    const app = makeApp({ id: makeAppId('a1'), resizable: true });
    const win = makeWindow({
      id: makeWindowId('w1'),
      state: 'maximized',
      position: { x: 120, y: 80 },
      size: { width: 320, height: 240 },
    });
    const { container } = renderWindow({
      app,
      window: win,
      focusedWindowId: win.id,
    });
    const el = container.querySelector('.window') as HTMLElement;
    expect(el.style.top).toBe('0px');
    expect(el.style.left).toBe('0px');
    expect(el.style.width).toBe('100%');
    expect(el.style.height).toBe('100%');
  });

  it('applies the window zIndex as the z-index style', () => {
    const app = makeApp({ id: makeAppId('a1') });
    const win = makeWindow({
      id: makeWindowId('w1'),
      zIndex: 7,
      state: 'open',
    });
    const { container } = renderWindow({
      app,
      window: win,
      focusedWindowId: win.id,
    });
    expect(
      (container.querySelector('.window') as HTMLElement).style.zIndex,
    ).toBe('7');
  });

  it('renders a resize handle when the app is resizable and the window is open', () => {
    const app = makeApp({ id: makeAppId('a1'), resizable: true });
    const win = makeWindow({ id: makeWindowId('w1'), state: 'open' });
    const { getByLabelText } = renderWindow({
      app,
      window: win,
      focusedWindowId: win.id,
    });
    expect(getByLabelText('Resize handle')).toBeInTheDocument();
  });

  it('does not render a resize handle when the app is not resizable', () => {
    const app = makeApp({ id: makeAppId('a1'), resizable: false });
    const win = makeWindow({ id: makeWindowId('w1'), state: 'open' });
    const { queryByLabelText } = renderWindow({
      app,
      window: win,
      focusedWindowId: win.id,
    });
    expect(queryByLabelText('Resize handle')).not.toBeInTheDocument();
  });

  it('does not render a resize handle when the window is maximized', () => {
    const app = makeApp({ id: makeAppId('a1'), resizable: true });
    const win = makeWindow({ id: makeWindowId('w1'), state: 'maximized' });
    const { queryByLabelText } = renderWindow({
      app,
      window: win,
      focusedWindowId: win.id,
    });
    expect(queryByLabelText('Resize handle')).not.toBeInTheDocument();
  });

  it('dispatches FOCUS_WINDOW when the window receives a pointer down', () => {
    const app = makeApp({ id: makeAppId('a1') });
    const win = makeWindow({ id: makeWindowId('w1'), state: 'open' });
    const { container, dispatch } = renderWindow({
      app,
      window: win,
      focusedWindowId: win.id,
    });
    fireEvent.pointerDown(container.querySelector('.window') as HTMLElement);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FOCUS_WINDOW',
      windowId: win.id,
    });
  });

  it('dispatches RESIZE_WINDOW with the new size when the resize handle is dragged', () => {
    const app = makeApp({ id: makeAppId('a1'), resizable: true });
    const win = makeWindow({
      id: makeWindowId('w1'),
      size: { width: 400, height: 300 },
      state: 'open',
    });
    const { getByLabelText, dispatch } = renderWindow({
      app,
      window: win,
      focusedWindowId: win.id,
    });
    const handle = getByLabelText('Resize handle');
    fireEvent.pointerDown(handle, { clientX: 0, clientY: 0, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 50, clientY: 25, pointerId: 1 });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'RESIZE_WINDOW',
      windowId: win.id,
      size: { width: 450, height: 325 },
    });
  });

  it('animates the window geometry by default', () => {
    const app = makeApp({ id: makeAppId('a1') });
    const win = makeWindow({ id: makeWindowId('w1'), state: 'open' });
    const { container } = renderWindow({
      app,
      window: win,
      focusedWindowId: win.id,
    });
    const winEl = container.querySelector('.window') as HTMLElement;
    expect(winEl.style.transition).toContain('top 0.2s');
    expect(winEl.style.transition).toContain('width 0.2s');
  });

  it('disables the transition while the title bar is being dragged', () => {
    const app = makeApp({ id: makeAppId('a1') });
    const win = makeWindow({ id: makeWindowId('w1'), state: 'open' });
    const { container } = renderWindow({
      app,
      window: win,
      focusedWindowId: win.id,
    });
    const winEl = container.querySelector('.window') as HTMLElement;
    const titleBar = container.querySelector('.title-bar') as HTMLElement;
    expect(winEl.style.transition).not.toBe('none');
    fireEvent.pointerDown(titleBar);
    expect(winEl.style.transition).toBe('none');
    fireEvent.pointerUp(titleBar);
    expect(winEl.style.transition).not.toBe('none');
  });

  it('passes the focused state to the title bar', () => {
    const app = makeApp({ id: makeAppId('a1') });
    const win = makeWindow({ id: makeWindowId('w1'), state: 'open' });
    const { container } = renderWindow({
      app,
      window: win,
      focusedWindowId: win.id,
    });
    expect(container.querySelector('.title-bar')).not.toHaveClass('inactive');
  });

  it('passes the unfocused state to the title bar', () => {
    const app = makeApp({ id: makeAppId('a1') });
    const win = makeWindow({ id: makeWindowId('w1'), state: 'open' });
    const { container } = renderWindow({
      app,
      window: win,
      focusedWindowId: null,
    });
    expect(container.querySelector('.title-bar')).toHaveClass('inactive');
  });

  it('renders children inside the window body', () => {
    const app = makeApp({ id: makeAppId('a1') });
    const win = makeWindow({ id: makeWindowId('w1'), state: 'open' });
    const { getByText } = render(
      <WindowManagerContext.Provider
        value={{ state: initialWindowsState, dispatch: vi.fn() }}
      >
        <Window app={app} window={win} focusedWindowId={win.id}>
          <p>Hello from app</p>
        </Window>
      </WindowManagerContext.Provider>,
    );
    expect(getByText('Hello from app')).toBeInTheDocument();
  });

  it('dispatches MOVE_WINDOW when the title bar is dragged', () => {
    const app = makeApp({ id: makeAppId('a1') });
    const win = makeWindow({
      id: makeWindowId('w1'),
      state: 'open',
      position: { x: 100, y: 100 },
    });
    const { container, dispatch } = renderWindow({
      app,
      window: win,
      focusedWindowId: win.id,
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

  it('does not dispatch MOVE_WINDOW when a maximized title bar is dragged', () => {
    const app = makeApp({ id: makeAppId('a1') });
    const win = makeWindow({
      id: makeWindowId('w1'),
      state: 'maximized',
      position: { x: 100, y: 100 },
    });
    const { container, dispatch } = renderWindow({
      app,
      window: win,
      focusedWindowId: win.id,
    });
    const titleBar = container.querySelector('.title-bar') as HTMLElement;
    fireEvent.pointerDown(titleBar, { clientX: 10, clientY: 20, pointerId: 1 });
    fireEvent.pointerMove(titleBar, { clientX: 60, clientY: 45, pointerId: 1 });
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'MOVE_WINDOW' }),
    );
  });
});
