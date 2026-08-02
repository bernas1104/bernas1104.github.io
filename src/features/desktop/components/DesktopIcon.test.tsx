import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DesktopIcon } from '@/features/desktop/components/DesktopIcon.tsx';
import { WindowManagerContext } from '@/features/desktop/windowManager/WindowManagerContext.ts';
import { initialWindowsState } from '@/features/desktop/windowManager/reducer.ts';
import type { WindowAction } from '@/features/desktop/windowManager/index.ts';
import type { AppDescriptor } from '@/features/desktop/types.ts';
import { makeApp, makeAppId } from '@/features/desktop/testUtils.ts';

function renderDesktopIcon(
  app: AppDescriptor = makeApp({
    id: makeAppId('my-computer'),
    title: 'My Computer',
  }),
) {
  const dispatch = vi.fn<(action: WindowAction) => void>();
  const utils = render(
    <WindowManagerContext.Provider
      value={{ state: initialWindowsState, dispatch }}
    >
      <DesktopIcon app={app} />
    </WindowManagerContext.Provider>,
  );
  return { ...utils, dispatch, app };
}

describe('DesktopIcon', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a button with an aria-label of the app title', () => {
    const { getByRole } = renderDesktopIcon();
    expect(getByRole('button', { name: 'My Computer' })).toBeInTheDocument();
  });

  it('renders the app title as visible text', () => {
    const { getByText } = renderDesktopIcon();
    expect(getByText('My Computer')).toBeInTheDocument();
  });

  it('renders the computer explorer icon image', () => {
    const { getByAltText } = renderDesktopIcon();
    const img = getByAltText('My Computer Icon');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('width', '32');
    expect(img).toHaveAttribute('height', '32');
  });

  it('is focusable via tabIndex', () => {
    const { getByRole } = renderDesktopIcon();
    expect(getByRole('button')).toHaveAttribute('tabindex', '0');
  });

  it('does not show selected styling initially', () => {
    const { container } = renderDesktopIcon();
    expect(container.querySelector('.icon-selected')).not.toBeInTheDocument();
    expect(container.querySelector('.desktop-icon-text')).not.toHaveClass(
      'icon-text-selected',
    );
  });

  it('selects the icon on single click', () => {
    const { container, getByRole } = renderDesktopIcon();
    fireEvent.click(getByRole('button'));
    expect(container.querySelector('.icon-selected')).toBeInTheDocument();
    expect(container.querySelector('.desktop-icon-text')).toHaveClass(
      'icon-text-selected',
    );
  });

  it('selects the icon on focus', () => {
    const { container, getByRole } = renderDesktopIcon();
    fireEvent.focus(getByRole('button'));
    expect(container.querySelector('.icon-selected')).toBeInTheDocument();
    expect(container.querySelector('.desktop-icon-text')).toHaveClass(
      'icon-text-selected',
    );
  });

  it('deselects the icon on blur', () => {
    const { container, getByRole } = renderDesktopIcon();
    fireEvent.click(getByRole('button'));
    expect(container.querySelector('.icon-selected')).toBeInTheDocument();
    fireEvent.blur(getByRole('button'));
    expect(container.querySelector('.icon-selected')).not.toBeInTheDocument();
    expect(container.querySelector('.desktop-icon-text')).not.toHaveClass(
      'icon-text-selected',
    );
  });

  it('dispatches OPEN_APP with the app on double click', () => {
    const { getByRole, dispatch, app } = renderDesktopIcon();
    fireEvent.doubleClick(getByRole('button'));
    expect(dispatch).toHaveBeenCalledWith({ type: 'OPEN_APP', app });
  });

  it('deselects the icon after double click', () => {
    const { container, getByRole } = renderDesktopIcon();
    fireEvent.click(getByRole('button'));
    fireEvent.doubleClick(getByRole('button'));
    expect(container.querySelector('.icon-selected')).not.toBeInTheDocument();
  });

  it('dispatches OPEN_APP with the app on Enter when selected', () => {
    const { getByRole, dispatch, app } = renderDesktopIcon();
    fireEvent.click(getByRole('button'));
    fireEvent.keyDown(getByRole('button'), { key: 'Enter' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'OPEN_APP', app });
  });

  it('deselects the icon after pressing Enter', () => {
    const { container, getByRole } = renderDesktopIcon();
    fireEvent.click(getByRole('button'));
    fireEvent.keyDown(getByRole('button'), { key: 'Enter' });
    expect(container.querySelector('.icon-selected')).not.toBeInTheDocument();
  });

  it('does not dispatch OPEN_APP on Enter when not selected', () => {
    const { getByRole, dispatch } = renderDesktopIcon();
    fireEvent.keyDown(getByRole('button'), { key: 'Enter' });
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('ignores non-Enter keys when selected', () => {
    const { getByRole, dispatch } = renderDesktopIcon();
    fireEvent.click(getByRole('button'));
    fireEvent.keyDown(getByRole('button'), { key: ' ' });
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('does not dispatch OPEN_APP on single click', () => {
    const { getByRole, dispatch } = renderDesktopIcon();
    fireEvent.click(getByRole('button'));
    expect(dispatch).not.toHaveBeenCalled();
  });
});
