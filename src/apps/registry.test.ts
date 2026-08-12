import { describe, expect, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import type { ComponentType, LazyExoticComponent } from 'react';
import { appRegistry, type AppRegistry } from '@/apps/index.ts';
import type { AppDescriptor } from '@/features/desktop/types.ts';
import type { AppId, IconName } from '@/common/types.ts';
import { iconMap } from '@/common/icons.ts';

const EXPECTED_APP_IDS = [
  'about',
  'contact',
  'cv',
  'projects',
  'terminal',
] as const;

const LAZY_TYPEOF = Symbol.for('react.lazy');

describe('appRegistry', () => {
  it('is typed as AppRegistry (Record<AppId, AppDescriptor>)', () => {
    expectTypeOf(appRegistry).toEqualTypeOf<AppRegistry>();
    expectTypeOf<AppRegistry>().toEqualTypeOf<Record<AppId, AppDescriptor>>();
  });

  it('every value in the registry is an AppDescriptor', () => {
    expectTypeOf<
      (typeof appRegistry)[keyof typeof appRegistry]
    >().toEqualTypeOf<AppDescriptor>();
  });

  it('the AppDescriptor component field is a lazy exotic component', () => {
    expectTypeOf<AppDescriptor['component']>().toEqualTypeOf<
      LazyExoticComponent<ComponentType<Record<string, never>>>
    >();
  });

  it('contains exactly the expected app ids', () => {
    expect(Object.keys(appRegistry).sort()).toEqual(
      [...EXPECTED_APP_IDS].sort(),
    );
  });

  it('contains the apps required by the issue (About, CV, Projects, Contact, Terminal)', () => {
    const required = [
      'about',
      'cv',
      'projects',
      'contact',
      'terminal',
    ] as const;
    for (const id of required) {
      expect(appRegistry[id as AppId]).toBeDefined();
    }
  });

  it('each entry id matches its registry key', () => {
    for (const [key, app] of Object.entries(appRegistry)) {
      expect(app.id).toBe(key as AppId);
    }
  });

  it('each component is a React.lazy exotic component (code-split)', () => {
    for (const app of Object.values(appRegistry)) {
      const component = app.component as unknown as {
        $$typeof: symbol;
        _init: () => unknown;
      };
      expect(component.$$typeof).toBe(LAZY_TYPEOF);
      expect(typeof component._init).toBe('function');
      expect('_payload' in app.component).toBe(true);
    }
  });

  it('each app has a non-empty title', () => {
    for (const app of Object.values(appRegistry)) {
      expect(typeof app.title).toBe('string');
      expect(app.title.length).toBeGreaterThan(0);
    }
  });

  it('each app icon is a valid IconName that resolves in the icon map', () => {
    for (const app of Object.values(appRegistry)) {
      expect(iconMap).toHaveProperty(app.icon as IconName);
    }
  });

  it('each app has a positive default size', () => {
    for (const app of Object.values(appRegistry)) {
      expect(app.defaultSize.width).toBeGreaterThan(0);
      expect(app.defaultSize.height).toBeGreaterThan(0);
    }
  });

  it('each app declares resizable and singleton as booleans', () => {
    for (const app of Object.values(appRegistry)) {
      expect(typeof app.resizable).toBe('boolean');
      expect(typeof app.singleton).toBe('boolean');
    }
  });

  it('marks About, CV, Projects and Contact as singleton apps', () => {
    expect(appRegistry['about' as AppId].singleton).toBe(true);
    expect(appRegistry['contact' as AppId].singleton).toBe(true);
    expect(appRegistry['cv' as AppId].singleton).toBe(true);
    expect(appRegistry['projects' as AppId].singleton).toBe(true);
  });

  it('marks Terminal as a non-singleton app (multiple instances allowed)', () => {
    expect(appRegistry['terminal' as AppId].singleton).toBe(false);
  });
});
