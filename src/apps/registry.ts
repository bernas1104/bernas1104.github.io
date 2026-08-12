import type { AppDescriptor } from '@/features/desktop/types.ts';
import type { AppId } from '@/common/types.ts';
import React from 'react';

export type AppRegistry = Record<AppId, AppDescriptor>;

export const appRegistry: AppRegistry = {
  ['computer' as AppId]: {
    id: 'computer' as AppId,
    title: 'My Computer',
    icon: 'computer',
    defaultSize: { width: 600, height: 400 },
    resizable: true,
    singleton: true,
    component: React.lazy(() => import('@/apps/PlaceholderApp.tsx')),
  },
  ['about' as AppId]: {
    id: 'about' as AppId,
    title: 'About',
    icon: 'about',
    defaultSize: { width: 400, height: 300 },
    resizable: true,
    singleton: true,
    component: React.lazy(() => import('@/apps/about/AboutApp.tsx')),
  },
  ['contact' as AppId]: {
    id: 'contact' as AppId,
    title: 'Contact',
    icon: 'contact',
    defaultSize: { width: 400, height: 300 },
    resizable: false,
    singleton: true,
    component: React.lazy(() => import('@/apps/PlaceholderApp.tsx')),
  },
  ['cv' as AppId]: {
    id: 'cv' as AppId,
    title: 'CV',
    icon: 'cv',
    defaultSize: { width: 400, height: 300 },
    resizable: true,
    singleton: true,
    component: React.lazy(() => import('@/apps/cv/Cv.tsx')),
  },
  ['projects' as AppId]: {
    id: 'projects' as AppId,
    title: 'Projects',
    icon: 'folder',
    defaultSize: { width: 600, height: 400 },
    resizable: true,
    singleton: true,
    component: React.lazy(() => import('@/apps/PlaceholderApp.tsx')),
  },
  ['terminal' as AppId]: {
    id: 'terminal' as AppId,
    title: 'Terminal',
    icon: 'terminal',
    defaultSize: { width: 600, height: 400 },
    resizable: true,
    singleton: false,
    component: React.lazy(() => import('@/apps/PlaceholderApp.tsx')),
  },
};
