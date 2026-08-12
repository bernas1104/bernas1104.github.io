import { describe, expect, it } from 'vitest';
import {
  initialShutdownState,
  shutdownReducer,
} from '@/features/boot/shutdown/reducer.ts';
import {
  beginShutdown,
  finishShutdown,
} from '@/features/boot/shutdown/actions.ts';

describe('initialShutdownState', () => {
  it('starts in the idle status', () => {
    expect(initialShutdownState.status).toBe('idle');
  });
});

describe('shutdownReducer', () => {
  it('transitions idle to shuttingDown on BEGIN_SHUTDOWN', () => {
    const next = shutdownReducer(initialShutdownState, beginShutdown());
    expect(next.status).toBe('shuttingDown');
  });

  it('transitions shuttingDown to off on FINISH_SHUTDOWN', () => {
    const shuttingDown = shutdownReducer(initialShutdownState, beginShutdown());
    const next = shutdownReducer(shuttingDown, finishShutdown());
    expect(next.status).toBe('off');
  });

  it('returns a new state reference when starting shutdown', () => {
    const next = shutdownReducer(initialShutdownState, beginShutdown());
    expect(next).not.toBe(initialShutdownState);
  });

  it('returns a new state reference when finishing shutdown', () => {
    const shuttingDown = shutdownReducer(initialShutdownState, beginShutdown());
    const next = shutdownReducer(shuttingDown, finishShutdown());
    expect(next).not.toBe(shuttingDown);
  });

  it('is a no-op (returns same state reference) on BEGIN_SHUTDOWN when already shutting down', () => {
    const shuttingDown = shutdownReducer(initialShutdownState, beginShutdown());
    const next = shutdownReducer(shuttingDown, beginShutdown());
    expect(next).toBe(shuttingDown);
  });

  it('is a no-op (returns same state reference) on BEGIN_SHUTDOWN when off', () => {
    const shuttingDown = shutdownReducer(initialShutdownState, beginShutdown());
    const off = shutdownReducer(shuttingDown, finishShutdown());
    const next = shutdownReducer(off, beginShutdown());
    expect(next).toBe(off);
  });

  it('is a no-op (returns same state reference) on FINISH_SHUTDOWN when idle', () => {
    const next = shutdownReducer(initialShutdownState, finishShutdown());
    expect(next).toBe(initialShutdownState);
  });

  it('is a no-op (returns same state reference) on FINISH_SHUTDOWN when off', () => {
    const shuttingDown = shutdownReducer(initialShutdownState, beginShutdown());
    const off = shutdownReducer(shuttingDown, finishShutdown());
    const next = shutdownReducer(off, finishShutdown());
    expect(next).toBe(off);
  });

  it('does not mutate the original state', () => {
    shutdownReducer(initialShutdownState, beginShutdown());
    expect(initialShutdownState.status).toBe('idle');
  });
});
