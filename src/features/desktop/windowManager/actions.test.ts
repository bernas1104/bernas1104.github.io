import { describe, expect, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import {
  clearFocus,
  closeWindow,
  focusWindow,
  minimizeWindow,
  moveWindow,
  openApp,
  resizeWindow,
  restoreWindow,
  toggleMaximizeWindow,
} from '@/features/desktop/windowManager/actions.ts';
import type { WindowAction } from '@/features/desktop/windowManager/actions.ts';
import type { AppDescriptor, WindowId } from '@/features/desktop/types.ts';
import type { Position, Size } from '@/common/types.ts';
import {
  makeApp,
  makeAppId,
  makeWindowId,
} from '@/features/desktop/testUtils.ts';

describe('action creators', () => {
  const app = makeApp({ id: makeAppId('notepad') });
  const windowId = makeWindowId('win-1');

  it('openApp returns an OPEN_APP action with the app', () => {
    expect(openApp(app)).toEqual({ type: 'OPEN_APP', app });
  });

  it('closeWindow returns a CLOSE_WINDOW action with the windowId', () => {
    expect(closeWindow(windowId)).toEqual({
      type: 'CLOSE_WINDOW',
      windowId,
    });
  });

  it('focusWindow returns a FOCUS_WINDOW action with the windowId', () => {
    expect(focusWindow(windowId)).toEqual({
      type: 'FOCUS_WINDOW',
      windowId,
    });
  });

  it('minimizeWindow returns a MINIMIZE_WINDOW action with the windowId', () => {
    expect(minimizeWindow(windowId)).toEqual({
      type: 'MINIMIZE_WINDOW',
      windowId,
    });
  });

  it('toggleMaximizeWindow returns a TOGGLE_MAXIMIZE action with the windowId', () => {
    expect(toggleMaximizeWindow(windowId)).toEqual({
      type: 'TOGGLE_MAXIMIZE',
      windowId,
    });
  });

  it('moveWindow returns a MOVE_WINDOW action with the windowId and position', () => {
    const position: Position = { x: 10, y: 20 };
    expect(moveWindow(windowId, position)).toEqual({
      type: 'MOVE_WINDOW',
      windowId,
      position,
    });
  });

  it('resizeWindow returns a RESIZE_WINDOW action with the windowId and size', () => {
    const size: Size = { width: 800, height: 600 };
    expect(resizeWindow(windowId, size)).toEqual({
      type: 'RESIZE_WINDOW',
      windowId,
      size,
    });
  });

  it('restoreWindow returns a RESTORE_WINDOW action with the windowId', () => {
    expect(restoreWindow(windowId)).toEqual({
      type: 'RESTORE_WINDOW',
      windowId,
    });
  });

  it('clearFocus returns a CLEAR_FOCUS action', () => {
    expect(clearFocus()).toEqual({ type: 'CLEAR_FOCUS' });
  });

  it('each creator returns a member of the WindowAction union', () => {
    expectTypeOf<ReturnType<typeof openApp>>().toMatchTypeOf<WindowAction>();
    expectTypeOf<
      ReturnType<typeof closeWindow>
    >().toMatchTypeOf<WindowAction>();
    expectTypeOf<
      ReturnType<typeof focusWindow>
    >().toMatchTypeOf<WindowAction>();
    expectTypeOf<
      ReturnType<typeof minimizeWindow>
    >().toMatchTypeOf<WindowAction>();
    expectTypeOf<
      ReturnType<typeof toggleMaximizeWindow>
    >().toMatchTypeOf<WindowAction>();
    expectTypeOf<ReturnType<typeof moveWindow>>().toMatchTypeOf<WindowAction>();
    expectTypeOf<
      ReturnType<typeof resizeWindow>
    >().toMatchTypeOf<WindowAction>();
    expectTypeOf<
      ReturnType<typeof restoreWindow>
    >().toMatchTypeOf<WindowAction>();
    expectTypeOf<ReturnType<typeof clearFocus>>().toMatchTypeOf<WindowAction>();
  });
});

describe('WindowAction', () => {
  it('is discriminated by the expected set of type literals', () => {
    expectTypeOf<WindowAction['type']>().toEqualTypeOf<
      | 'CLEAR_FOCUS'
      | 'CLOSE_WINDOW'
      | 'FOCUS_WINDOW'
      | 'MINIMIZE_WINDOW'
      | 'MOVE_WINDOW'
      | 'OPEN_APP'
      | 'RESIZE_WINDOW'
      | 'RESTORE_WINDOW'
      | 'TOGGLE_MAXIMIZE'
    >();
  });

  it('OPEN_APP carries an AppDescriptor', () => {
    expectTypeOf<Extract<WindowAction, { type: 'OPEN_APP' }>>()
      .toHaveProperty('app')
      .toEqualTypeOf<AppDescriptor>();
  });

  it('CLOSE_WINDOW carries a WindowId', () => {
    expectTypeOf<Extract<WindowAction, { type: 'CLOSE_WINDOW' }>>()
      .toHaveProperty('windowId')
      .toEqualTypeOf<WindowId>();
  });

  it('FOCUS_WINDOW carries a WindowId', () => {
    expectTypeOf<Extract<WindowAction, { type: 'FOCUS_WINDOW' }>>()
      .toHaveProperty('windowId')
      .toEqualTypeOf<WindowId>();
  });

  it('MINIMIZE_WINDOW carries a WindowId', () => {
    expectTypeOf<Extract<WindowAction, { type: 'MINIMIZE_WINDOW' }>>()
      .toHaveProperty('windowId')
      .toEqualTypeOf<WindowId>();
  });

  it('TOGGLE_MAXIMIZE carries a WindowId', () => {
    expectTypeOf<Extract<WindowAction, { type: 'TOGGLE_MAXIMIZE' }>>()
      .toHaveProperty('windowId')
      .toEqualTypeOf<WindowId>();
  });

  it('MOVE_WINDOW carries a WindowId and a Position', () => {
    type MoveAction = Extract<WindowAction, { type: 'MOVE_WINDOW' }>;
    expectTypeOf<MoveAction>()
      .toHaveProperty('windowId')
      .toEqualTypeOf<WindowId>();
    expectTypeOf<MoveAction>()
      .toHaveProperty('position')
      .toEqualTypeOf<Position>();
  });

  it('RESIZE_WINDOW carries a WindowId and a Size', () => {
    type ResizeAction = Extract<WindowAction, { type: 'RESIZE_WINDOW' }>;
    expectTypeOf<ResizeAction>()
      .toHaveProperty('windowId')
      .toEqualTypeOf<WindowId>();
    expectTypeOf<ResizeAction>().toHaveProperty('size').toEqualTypeOf<Size>();
  });

  it('RESTORE_WINDOW carries a WindowId', () => {
    expectTypeOf<Extract<WindowAction, { type: 'RESTORE_WINDOW' }>>()
      .toHaveProperty('windowId')
      .toEqualTypeOf<WindowId>();
  });

  it('CLEAR_FOCUS carries only the type discriminant', () => {
    expectTypeOf<
      Extract<WindowAction, { type: 'CLEAR_FOCUS' }>
    >().toEqualTypeOf<{ type: 'CLEAR_FOCUS' }>();
  });
});
