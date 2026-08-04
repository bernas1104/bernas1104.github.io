import { describe, expect, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import { resolveTaskbarAction } from '@/features/desktop/utils/resolveTaskbarAction.ts';
import type { WindowAction } from '@/features/desktop/windowManager/index.ts';
import type {
  AppId,
  WindowId,
  WindowInstance,
} from '@/features/desktop/types.ts';
import {
  makeAppId,
  makeWindow,
  makeWindowId,
} from '@/features/desktop/testUtils.ts';

const appId: AppId = makeAppId('notepad');
const winId: WindowId = makeWindowId('win-1');

const baseWindow: WindowInstance = makeWindow({
  id: winId,
  appId,
  title: 'Notepad',
});

describe('resolveTaskbarAction', () => {
  it('returns RESTORE_WINDOW when the window is minimized', () => {
    const window = makeWindow({ ...baseWindow, state: 'minimized' });
    expect(resolveTaskbarAction(window, null)).toEqual({
      type: 'RESTORE_WINDOW',
      windowId: winId,
    });
  });

  it('returns RESTORE_WINDOW when the window is minimized even if it is focused', () => {
    const window = makeWindow({ ...baseWindow, state: 'minimized' });
    expect(resolveTaskbarAction(window, winId)).toEqual({
      type: 'RESTORE_WINDOW',
      windowId: winId,
    });
  });

  it('returns FOCUS_WINDOW when the window is open but not focused', () => {
    const window = makeWindow({ ...baseWindow, state: 'open' });
    const other: WindowId = makeWindowId('win-2');
    expect(resolveTaskbarAction(window, other)).toEqual({
      type: 'FOCUS_WINDOW',
      windowId: winId,
    });
  });

  it('returns FOCUS_WINDOW when the window is open and no window is focused', () => {
    const window = makeWindow({ ...baseWindow, state: 'open' });
    expect(resolveTaskbarAction(window, null)).toEqual({
      type: 'FOCUS_WINDOW',
      windowId: winId,
    });
  });

  it('returns MINIMIZE_WINDOW when the open window is the focused one', () => {
    const window = makeWindow({ ...baseWindow, state: 'open' });
    expect(resolveTaskbarAction(window, winId)).toEqual({
      type: 'MINIMIZE_WINDOW',
      windowId: winId,
    });
  });

  it('returns MINIMIZE_WINDOW when the maximized window is the focused one', () => {
    const window = makeWindow({ ...baseWindow, state: 'maximized' });
    expect(resolveTaskbarAction(window, winId)).toEqual({
      type: 'MINIMIZE_WINDOW',
      windowId: winId,
    });
  });

  it('returns FOCUS_WINDOW when the maximized window is not focused', () => {
    const window = makeWindow({ ...baseWindow, state: 'maximized' });
    const other: WindowId = makeWindowId('win-2');
    expect(resolveTaskbarAction(window, other)).toEqual({
      type: 'FOCUS_WINDOW',
      windowId: winId,
    });
  });

  it('is pure: returns the same action shape for identical inputs', () => {
    const window = makeWindow({ ...baseWindow, state: 'open' });
    const a = resolveTaskbarAction(window, winId);
    const b = resolveTaskbarAction(window, winId);
    expect(a).toEqual(b);
  });

  it('returns a member of the WindowAction union', () => {
    expectTypeOf<
      ReturnType<typeof resolveTaskbarAction>
    >().toEqualTypeOf<WindowAction>();
  });
});
