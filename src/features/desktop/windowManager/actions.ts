import type { Position, Size } from '@/common/types.ts';
import type { AppDescriptor, WindowId } from '@/features/desktop/types.ts';

export type WindowAction =
  | { type: 'OPEN_APP'; app: AppDescriptor }
  | { type: 'CLOSE_WINDOW'; windowId: WindowId }
  | { type: 'FOCUS_WINDOW'; windowId: WindowId }
  | { type: 'MINIMIZE_WINDOW'; windowId: WindowId }
  | { type: 'TOGGLE_MAXIMIZE'; windowId: WindowId }
  | { type: 'MOVE_WINDOW'; windowId: WindowId; position: Position }
  | { type: 'RESIZE_WINDOW'; windowId: WindowId; size: Size }
  | { type: 'RESTORE_WINDOW'; windowId: WindowId };

export const openApp = (app: AppDescriptor): WindowAction => ({
  type: 'OPEN_APP',
  app,
});

export const closeWindow = (windowId: WindowId): WindowAction => ({
  type: 'CLOSE_WINDOW',
  windowId,
});

export const focusWindow = (windowId: WindowId): WindowAction => ({
  type: 'FOCUS_WINDOW',
  windowId,
});

export const minimizeWindow = (windowId: WindowId): WindowAction => ({
  type: 'MINIMIZE_WINDOW',
  windowId,
});

export const toggleMaximizeWindow = (windowId: WindowId): WindowAction => ({
  type: 'TOGGLE_MAXIMIZE',
  windowId,
});

export const moveWindow = (
  windowId: WindowId,
  position: Position,
): WindowAction => ({
  type: 'MOVE_WINDOW',
  windowId,
  position,
});

export const resizeWindow = (windowId: WindowId, size: Size): WindowAction => ({
  type: 'RESIZE_WINDOW',
  windowId,
  size,
});

export const restoreWindow = (windowId: WindowId): WindowAction => ({
  type: 'RESTORE_WINDOW',
  windowId,
});
