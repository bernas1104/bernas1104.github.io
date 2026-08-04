import { createContext } from 'react';
import type { StartMenuHandlers } from '@/features/desktop/hooks/useStartMenu.ts';

export const StartMenuContext = createContext<StartMenuHandlers | null>(null);
