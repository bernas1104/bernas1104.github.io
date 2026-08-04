import { useMemo, useState } from 'react';
import { StartMenuContext } from '@/features/desktop/StartMenuContext.tsx';

export function StartMenuProvider({ children }: { children: React.ReactNode }) {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  const value = useMemo(
    () => ({
      isStartMenuOpen,
      closeStartMenu: () => setIsStartMenuOpen(false),
      onStartMenuToggle: () => setIsStartMenuOpen(!isStartMenuOpen),
    }),
    [isStartMenuOpen],
  );

  return (
    <StartMenuContext.Provider value={value}>
      {children}
    </StartMenuContext.Provider>
  );
}
