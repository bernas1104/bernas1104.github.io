import { createHashRouter } from 'react-router';
import { AppShell } from '@/AppShell.tsx';

export const router = createHashRouter([
  {
    path: '/:appId?',
    Component: AppShell,
  },
]);
