export { WindowManagerProvider } from '@/features/desktop/windowManager/WindowManagerProvider.tsx';
export { useWindowManager } from '@/features/desktop/windowManager/useWindowManager.ts';
export { WindowManagerContext } from '@/features/desktop/windowManager/WindowManagerContext.ts';
export { initialWindowsState } from '@/features/desktop/windowManager/reducer.ts';
export {
  openApp,
  closeWindow,
  focusWindow,
  minimizeWindow,
  toggleMaximizeWindow,
  moveWindow,
  resizeWindow,
  restoreWindow,
  clearFocus,
} from '@/features/desktop/windowManager/actions.ts';
export type { WindowAction } from '@/features/desktop/windowManager/actions.ts';
