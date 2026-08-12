import { describe, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import type {
  ShutdownStatus,
  ShutdownState,
} from '@/features/boot/shutdown/types.ts';

describe('ShutdownStatus', () => {
  it('is the union of expected string literals', () => {
    expectTypeOf<ShutdownStatus>().toEqualTypeOf<
      'idle' | 'shuttingDown' | 'off'
    >();
  });
});

describe('ShutdownState', () => {
  it('has a readonly status of type ShutdownStatus', () => {
    expectTypeOf<ShutdownState>()
      .toHaveProperty('status')
      .toEqualTypeOf<ShutdownStatus>();
    expectTypeOf<{
      status: ShutdownStatus;
    }>().not.toEqualTypeOf<ShutdownState>();
  });
});
