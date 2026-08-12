import { useContext } from 'react';
import { ShutdownContext } from '@/features/boot/shutdown/ShutdownContext.ts';

export function useShutdown() {
  const context = useContext(ShutdownContext);

  if (!context) {
    throw new Error('useShutdown must be used within a ShutdownProvider');
  }

  return context;
}
