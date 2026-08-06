import { describe, expect, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import { skipBoot, timeoutBoot } from '@/features/boot/actions.ts';
import type { BootAction } from '@/features/boot/actions.ts';

describe('action creators', () => {
  it('skipBoot returns a SKIP action', () => {
    expect(skipBoot()).toEqual({ type: 'SKIP' });
  });

  it('timeoutBoot returns a TIMEOUT action', () => {
    expect(timeoutBoot()).toEqual({ type: 'TIMEOUT' });
  });

  it('each creator returns a member of the BootAction union', () => {
    expectTypeOf<ReturnType<typeof skipBoot>>().toMatchTypeOf<BootAction>();
    expectTypeOf<ReturnType<typeof timeoutBoot>>().toMatchTypeOf<BootAction>();
  });
});

describe('BootAction', () => {
  it('is discriminated by the expected set of type literals', () => {
    expectTypeOf<BootAction['type']>().toEqualTypeOf<'SKIP' | 'TIMEOUT'>();
  });

  it('SKIP carries only the type discriminant', () => {
    expectTypeOf<Extract<BootAction, { type: 'SKIP' }>>().toEqualTypeOf<{
      type: 'SKIP';
    }>();
  });

  it('TIMEOUT carries only the type discriminant', () => {
    expectTypeOf<Extract<BootAction, { type: 'TIMEOUT' }>>().toEqualTypeOf<{
      type: 'TIMEOUT';
    }>();
  });
});
