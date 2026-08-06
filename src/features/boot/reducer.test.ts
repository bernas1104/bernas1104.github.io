import { describe, expect, it } from 'vitest';
import {
  initialBootState,
  bootReducer,
  createInitialBootState,
} from '@/features/boot/reducer.ts';
import { skipBoot, timeoutBoot } from '@/features/boot/actions.ts';

describe('initialBootState', () => {
  it('starts in the booting status', () => {
    expect(initialBootState.status).toBe('booting');
  });
});

describe('createInitialBootState', () => {
  it('starts booting when shouldPlay returns true', () => {
    expect(createInitialBootState(() => true).status).toBe('booting');
  });

  it('starts dismissed when shouldPlay returns false', () => {
    expect(createInitialBootState(() => false).status).toBe('dismissed');
  });
});

describe('bootReducer', () => {
  it('transitions booting to dismissed on SKIP', () => {
    const next = bootReducer(initialBootState, skipBoot());
    expect(next.status).toBe('dismissed');
  });

  it('transitions booting to dismissed on TIMEOUT', () => {
    const next = bootReducer(initialBootState, timeoutBoot());
    expect(next.status).toBe('dismissed');
  });

  it('returns a new state reference when dismissing from booting', () => {
    const next = bootReducer(initialBootState, skipBoot());
    expect(next).not.toBe(initialBootState);
  });

  it('is a no-op (returns same state reference) on SKIP when already dismissed', () => {
    const dismissed = bootReducer(initialBootState, skipBoot());
    const next = bootReducer(dismissed, skipBoot());
    expect(next).toBe(dismissed);
  });

  it('is a no-op (returns same state reference) on TIMEOUT when already dismissed', () => {
    const dismissed = bootReducer(initialBootState, timeoutBoot());
    const next = bootReducer(dismissed, timeoutBoot());
    expect(next).toBe(dismissed);
  });

  it('does not mutate the original state', () => {
    bootReducer(initialBootState, skipBoot());
    expect(initialBootState.status).toBe('booting');
  });
});
