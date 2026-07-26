import { describe, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import type {
  AppId,
  WindowId,
  AppDescriptor,
  WindowState,
  WindowInstance,
  DesktopIcon,
  DesktopState,
} from '@/features/desktop/types.ts';
import type { IconName, Position, Size } from '@/common/types.ts';

describe('AppId', () => {
  it('is a branded string', () => {
    expectTypeOf<AppId>().toMatchTypeOf<string>();
    expectTypeOf<string>().not.toExtend<AppId>();
  });

  it('is not assignable to WindowId', () => {
    expectTypeOf<AppId>().not.toEqualTypeOf<WindowId>();
  });
});

describe('WindowId', () => {
  it('is a branded string', () => {
    expectTypeOf<WindowId>().toMatchTypeOf<string>();
    expectTypeOf<string>().not.toExtend<WindowId>();
  });
});

describe('AppDescriptor', () => {
  it('has required fields with correct types', () => {
    expectTypeOf<AppDescriptor>().toHaveProperty('id').toEqualTypeOf<AppId>();
    expectTypeOf<AppDescriptor>()
      .toHaveProperty('title')
      .toEqualTypeOf<string>();
    expectTypeOf<AppDescriptor>()
      .toHaveProperty('icon')
      .toEqualTypeOf<IconName>();
    expectTypeOf<AppDescriptor>()
      .toHaveProperty('defaultSize')
      .toEqualTypeOf<Size>();
    expectTypeOf<AppDescriptor>()
      .toHaveProperty('resizable')
      .toEqualTypeOf<boolean>();
    expectTypeOf<AppDescriptor>()
      .toHaveProperty('singleton')
      .toEqualTypeOf<boolean>();
    expectTypeOf<{
      id: AppId;
      title: string;
      icon: IconName;
      defaultSize: Size;
      resizable: boolean;
      singleton: boolean;
    }>().not.toEqualTypeOf<AppDescriptor>();
  });
});

describe('WindowState', () => {
  it('is the union of expected string literals', () => {
    expectTypeOf<WindowState>().toEqualTypeOf<
      'open' | 'minimized' | 'maximized'
    >();
  });
});

describe('WindowInstance', () => {
  it('has required fields with correct types', () => {
    expectTypeOf<WindowInstance>()
      .toHaveProperty('id')
      .toEqualTypeOf<WindowId>();
    expectTypeOf<WindowInstance>()
      .toHaveProperty('appId')
      .toEqualTypeOf<AppId>();
    expectTypeOf<WindowInstance>()
      .toHaveProperty('title')
      .toEqualTypeOf<string>();
    expectTypeOf<WindowInstance>()
      .toHaveProperty('position')
      .toEqualTypeOf<Position>();
    expectTypeOf<WindowInstance>().toHaveProperty('size').toEqualTypeOf<Size>();
    expectTypeOf<WindowInstance>()
      .toHaveProperty('state')
      .toEqualTypeOf<WindowState>();
    expectTypeOf<WindowInstance>()
      .toHaveProperty('zIndex')
      .toEqualTypeOf<number>();
    expectTypeOf<{
      id: WindowId;
      appId: AppId;
      title: string;
      position: Position;
      size: Size;
      state: WindowState;
      zIndex: number;
    }>().not.toEqualTypeOf<WindowInstance>();
  });
});

describe('DesktopIcon', () => {
  it('has required fields with correct types', () => {
    expectTypeOf<DesktopIcon>().toHaveProperty('appId').toEqualTypeOf<AppId>();
    expectTypeOf<DesktopIcon>().toHaveProperty('label').toEqualTypeOf<string>();
    expectTypeOf<DesktopIcon>()
      .toHaveProperty('icon')
      .toEqualTypeOf<IconName>();
    expectTypeOf<DesktopIcon>()
      .toHaveProperty('position')
      .toEqualTypeOf<Position>();
    expectTypeOf<{
      appId: AppId;
      label: string;
      icon: IconName;
      position: Position;
    }>().not.toEqualTypeOf<DesktopIcon>();
  });
});

describe('DesktopState', () => {
  it('has windows as ReadonlyMap of WindowId to WindowInstance', () => {
    expectTypeOf<DesktopState>()
      .toHaveProperty('windows')
      .toEqualTypeOf<ReadonlyMap<WindowId, WindowInstance>>();
  });

  it('has focusedWindowId as WindowId or null', () => {
    expectTypeOf<DesktopState>()
      .toHaveProperty('focusedWindowId')
      .toEqualTypeOf<WindowId | null>();
  });

  it('has nextZIndex as number', () => {
    expectTypeOf<DesktopState>()
      .toHaveProperty('nextZIndex')
      .toEqualTypeOf<number>();
    expectTypeOf<{
      windows: ReadonlyMap<WindowId, WindowInstance>;
      focusedWindowId: WindowId | null;
      nextZIndex: number;
    }>().not.toEqualTypeOf<DesktopState>();
  });
});
