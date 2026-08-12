import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StartMenu } from '@/features/desktop/components/StartMenu.tsx';
import { WindowManagerContext } from '@/features/desktop/windowManager/index.ts';
import type { WindowAction } from '@/features/desktop/windowManager/index.ts';
import { StartMenuContext } from '@/features/desktop/StartMenuContext.tsx';
import { appRegistry } from '@/apps/index.ts';
import type {
  DesktopState,
  WindowId,
  WindowInstance,
} from '@/features/desktop/types.ts';
import {
  makeAppId,
  makeWindow,
  makeWindowId,
} from '@/features/desktop/testUtils.ts';

const makeState = (overrides: Partial<DesktopState> = {}): DesktopState => ({
  windows: new Map<WindowId, WindowInstance>(),
  focusedWindowId: null,
  nextZIndex: 1,
  windowsOpenedCount: 0,
  ...overrides,
});

interface RenderOptions {
  state?: DesktopState;
  isStartMenuOpen?: boolean;
  closeStartMenu?: () => void;
  onStartMenuToggle?: () => void;
}

function renderStartMenu({
  state = makeState(),
  isStartMenuOpen = true,
  closeStartMenu = vi.fn(),
  onStartMenuToggle = vi.fn(),
}: RenderOptions = {}) {
  const dispatch = vi.fn<(action: WindowAction) => void>();
  const utils = render(
    <WindowManagerContext.Provider value={{ state, dispatch }}>
      <StartMenuContext.Provider
        value={{ isStartMenuOpen, closeStartMenu, onStartMenuToggle }}
      >
        <StartMenu />
      </StartMenuContext.Provider>
    </WindowManagerContext.Provider>,
  );
  return { ...utils, dispatch, closeStartMenu, onStartMenuToggle };
}

function dispatchPointerDown(target: Node): void {
  target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
}

describe('StartMenu', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('renders nothing when the start menu is closed', () => {
    const { container } = renderStartMenu({ isStartMenuOpen: false });
    expect(container.querySelector('.start-menu')).not.toBeInTheDocument();
  });

  it('renders the start menu when open', () => {
    const { container } = renderStartMenu();
    expect(container.querySelector('.start-menu')).toBeInTheDocument();
  });

  it('renders the sidebar with the BernasOS title', () => {
    const { container } = renderStartMenu();
    expect(container.querySelector('.start-menu-sidebar')).toBeInTheDocument();
    const sidebarTitle = container.querySelector('.sidebar-title');
    expect(sidebarTitle).toBeInTheDocument();
    expect((sidebarTitle as HTMLElement).textContent).toContain('Bernas');
    expect((sidebarTitle as HTMLElement).textContent).toContain('OS');
  });

  it('renders a menu item for every registered app', () => {
    const { getByText } = renderStartMenu();
    for (const app of Object.values(appRegistry)) {
      expect(getByText(app.title)).toBeInTheDocument();
    }
  });

  it('renders the Shutdown menu item with an icon and label', () => {
    const { getByAltText, getByText, container } = renderStartMenu();
    expect(container.querySelector('.start-menu-item')).toBeInTheDocument();
    expect(getByAltText('Shutdown')).toBeInTheDocument();
    expect(getByText('Shutdown')).toBeInTheDocument();
  });

  it('closes the menu when the Escape key is pressed', () => {
    const { closeStartMenu } = renderStartMenu();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(closeStartMenu).toHaveBeenCalledTimes(1);
  });

  it('does not close the menu when a non-Escape key is pressed', () => {
    const { closeStartMenu } = renderStartMenu();
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(closeStartMenu).not.toHaveBeenCalled();
  });

  it('closes the menu on a pointerdown outside the menu', () => {
    const { closeStartMenu } = renderStartMenu();
    dispatchPointerDown(document.body);
    expect(closeStartMenu).toHaveBeenCalledTimes(1);
  });

  it('does not close the menu on a pointerdown inside the menu', () => {
    const { container, closeStartMenu } = renderStartMenu();
    dispatchPointerDown(container.querySelector('.start-menu') as HTMLElement);
    expect(closeStartMenu).not.toHaveBeenCalled();
  });

  it('dispatches OPEN_APP with the app descriptor and closes the menu when an app item is clicked', () => {
    const about = Object.values(appRegistry).find(
      (app) => app.id === makeAppId('about'),
    )!;
    const { getByText, dispatch, closeStartMenu } = renderStartMenu();
    const item = getByText(about.title).closest(
      '.start-menu-item',
    ) as HTMLElement;

    fireEvent.click(item);

    expect(dispatch).toHaveBeenCalledWith({ type: 'OPEN_APP', app: about });
    expect(closeStartMenu).toHaveBeenCalledTimes(1);
  });

  it('closes the menu without dispatching a window action when the Shutdown item is clicked', () => {
    const { getByText, dispatch, closeStartMenu } = renderStartMenu();
    const shutdownItem = getByText('Shutdown').closest(
      '.start-menu-item',
    ) as HTMLElement;

    fireEvent.click(shutdownItem);

    expect(dispatch).not.toHaveBeenCalled();
    expect(closeStartMenu).toHaveBeenCalledTimes(1);
  });

  it('uses the start-menu z-index token when no window is focused', () => {
    const { container } = renderStartMenu({ state: makeState() });
    const menu = container.querySelector('.start-menu') as HTMLElement;
    expect(menu.style.zIndex).toBe('var(--win98-z-index-start-menu)');
  });

  it('uses an empty z-index when a window is focused', () => {
    const win = makeWindow({ id: makeWindowId('w1'), state: 'open' });
    const state = makeState({
      windows: new Map([[win.id, win]]),
      focusedWindowId: win.id,
    });
    const { container } = renderStartMenu({ state });
    const menu = container.querySelector('.start-menu') as HTMLElement;
    expect(menu.style.zIndex).toBe('');
  });
});
