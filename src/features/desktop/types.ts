import type { Brand, IconName, Position, Size } from '@/common/types.ts';

export type AppId = Brand<string, 'AppId'>;

export type WindowId = Brand<string, 'WindowId'>;

export type AppDescriptor = {
  readonly id: AppId;
  readonly title: string;
  readonly icon: IconName;
  readonly defaultSize: Size;
  readonly resizable: boolean;
  readonly singleton: boolean;
};

export type WindowState = 'open' | 'minimized' | 'maximized';

export type WindowInstance = {
  readonly id: WindowId;
  readonly appId: AppId;
  readonly title: string;
  readonly position: Position;
  readonly size: Size;
  readonly state: WindowState;
  readonly zIndex: number;
};

export type DesktopIcon = {
  readonly appId: AppId;
  readonly label: string;
  readonly icon: IconName;
  readonly position: Position;
};

export type DesktopState = {
  readonly windows: ReadonlyMap<WindowId, WindowInstance>;
  readonly focusedWindowId: WindowId | null;
  readonly nextZIndex: number;
};
