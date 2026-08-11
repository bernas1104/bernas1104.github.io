import { lazy } from 'react';
import { vi } from 'vitest';
import type {
  AppDescriptor,
  WindowId,
  WindowInstance,
} from '@/features/desktop/types.ts';
import type { AppId } from '@/common/types.ts';

export const makeAppId = (id: string): AppId => id as AppId;
export const makeWindowId = (id: string): WindowId => id as WindowId;

export const makeApp = (
  overrides: Partial<AppDescriptor> & { id: AppId },
): AppDescriptor => ({
  title: 'Test App',
  icon: 'about',
  defaultSize: { width: 400, height: 300 },
  resizable: true,
  singleton: false,
  component: lazy(() => Promise.resolve({ default: vi.fn() })),
  ...overrides,
});

export const makeWindow = (
  overrides: Partial<WindowInstance> & { id: WindowId },
): WindowInstance => ({
  appId: makeAppId('app-1'),
  title: 'Test Window',
  position: { x: 100, y: 100 },
  size: { width: 400, height: 300 },
  state: 'open',
  zIndex: 1,
  previousState: null,
  ...overrides,
});
