import { describe, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import type {
  BootStatus,
  BootState,
  BootEnvironment,
  BootSequenceConfig,
} from '@/features/boot/types.ts';

describe('BootStatus', () => {
  it('is the union of expected string literals', () => {
    expectTypeOf<BootStatus>().toEqualTypeOf<'booting' | 'dismissed'>();
  });
});

describe('BootState', () => {
  it('has a readonly status of type BootStatus', () => {
    expectTypeOf<BootState>()
      .toHaveProperty('status')
      .toEqualTypeOf<BootStatus>();
    expectTypeOf<{ status: BootStatus }>().not.toEqualTypeOf<BootState>();
  });
});

describe('BootEnvironment', () => {
  it('has readonly isDevelopment and isTest booleans', () => {
    expectTypeOf<BootEnvironment>()
      .toHaveProperty('isDevelopment')
      .toEqualTypeOf<boolean>();
    expectTypeOf<BootEnvironment>()
      .toHaveProperty('isTest')
      .toEqualTypeOf<boolean>();
    expectTypeOf<{
      isDevelopment: boolean;
      isTest: boolean;
    }>().not.toEqualTypeOf<BootEnvironment>();
  });
});

describe('BootSequenceConfig', () => {
  it('has readonly minDurationMs and environment fields', () => {
    expectTypeOf<BootSequenceConfig>()
      .toHaveProperty('minDurationMs')
      .toEqualTypeOf<number>();
    expectTypeOf<BootSequenceConfig>()
      .toHaveProperty('environment')
      .toEqualTypeOf<BootEnvironment>();
    expectTypeOf<{
      minDurationMs: number;
      environment: BootEnvironment;
    }>().not.toEqualTypeOf<BootSequenceConfig>();
  });
});
