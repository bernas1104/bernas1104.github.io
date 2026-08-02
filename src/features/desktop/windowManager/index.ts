export { WindowManagerProvider } from './WindowManagerProvider.tsx';
export { useWindowManager } from './useWindowManager.ts';
export { WindowManagerContext } from './WindowManagerContext.ts';
export { initialWindowsState } from './reducer.ts';
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
} from './actions.ts';
export type { WindowAction } from './actions.ts';
