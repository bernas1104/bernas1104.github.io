import { useContext } from 'react';
import { StartMenuContext } from '@/features/desktop/StartMenuContext.tsx';

export type StartMenuHandlers = {
  isStartMenuOpen: boolean;
  closeStartMenu(): void;
  onStartMenuToggle(): void;
};

export function useStartMenu(): StartMenuHandlers {
  const { isStartMenuOpen, closeStartMenu, onStartMenuToggle } =
    useContext(StartMenuContext)!;

  return { isStartMenuOpen, closeStartMenu, onStartMenuToggle };
}
