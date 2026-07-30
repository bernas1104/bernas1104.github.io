import { useContext } from 'react';
import { WindowManagerContext } from '@/features/desktop/windowManager/WindowManagerContext.ts';

export function useWindowManager() {
  const context = useContext(WindowManagerContext);

  if (!context) {
    throw new Error(
      'useWindowManager must be used within a WindowManagerProvider',
    );
  }

  return context;
}
