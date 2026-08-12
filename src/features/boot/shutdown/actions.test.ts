import { describe, expect, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import {
  beginShutdown,
  finishShutdown,
} from '@/features/boot/shutdown/actions.ts';
import type { ShutdownAction } from '@/features/boot/shutdown/actions.ts';

describe('action creators', () => {
  it('beginShutdown returns a BEGIN_SHUTDOWN action', () => {
    expect(beginShutdown()).toEqual({ type: 'BEGIN_SHUTDOWN' });
  });

  it('finishShutdown returns a FINISH_SHUTDOWN action', () => {
    expect(finishShutdown()).toEqual({ type: 'FINISH_SHUTDOWN' });
  });

  it('each creator returns a member of the ShutdownAction union', () => {
    expectTypeOf<
      ReturnType<typeof beginShutdown>
    >().toMatchTypeOf<ShutdownAction>();
    expectTypeOf<
      ReturnType<typeof finishShutdown>
    >().toMatchTypeOf<ShutdownAction>();
  });
});

describe('ShutdownAction', () => {
  it('is discriminated by the expected set of type literals', () => {
    expectTypeOf<ShutdownAction['type']>().toEqualTypeOf<
      'BEGIN_SHUTDOWN' | 'FINISH_SHUTDOWN'
    >();
  });

  it('BEGIN_SHUTDOWN carries only the type discriminant', () => {
    expectTypeOf<
      Extract<ShutdownAction, { type: 'BEGIN_SHUTDOWN' }>
    >().toEqualTypeOf<{
      type: 'BEGIN_SHUTDOWN';
    }>();
  });

  it('FINISH_SHUTDOWN carries only the type discriminant', () => {
    expectTypeOf<
      Extract<ShutdownAction, { type: 'FINISH_SHUTDOWN' }>
    >().toEqualTypeOf<{
      type: 'FINISH_SHUTDOWN';
    }>();
  });
});
