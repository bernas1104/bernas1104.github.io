export { WindowManagerProvider } from './WindowManagerProvider.tsx';
export { useWindowManager } from './useWindowManager.ts';
export {
  openApp,
  closeWindow,
  focusWindow,
  minimizeWindow,
  toggleMaximizeWindow,
  moveWindow,
  resizeWindow,
  restoreWindow,
} from './actions.ts';
export type { WindowAction } from './actions.ts';
