import type { WindowInstance, WindowId } from '@/features/desktop/types.ts';
import type { WindowAction } from '@/features/desktop/windowManager/index.ts';

export function resolveTaskbarAction(
  window: WindowInstance,
  focusedWindowId: WindowId | null,
): WindowAction {
  if (window.state === 'minimized')
    return { type: 'RESTORE_WINDOW', windowId: window.id };

  if (focusedWindowId !== window.id)
    return { type: 'FOCUS_WINDOW', windowId: window.id };

  return { type: 'MINIMIZE_WINDOW', windowId: window.id };
}
