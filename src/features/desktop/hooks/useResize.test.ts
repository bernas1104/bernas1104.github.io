import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useResize } from '@/features/desktop/hooks/useResize.ts';
import type {
  AppId,
  WindowId,
  WindowInstance,
} from '@/features/desktop/types.ts';

const makeAppId = (id: string): AppId => id as AppId;
const makeWindowId = (id: string): WindowId => id as WindowId;

const makeWindow = (
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

function setupRef(): {
  ref: React.RefObject<HTMLElement | null>;
  el: HTMLElement;
} {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return { ref: { current: el }, el };
}

function pointerDownEvent(
  clientX: number,
  clientY: number,
  pointerId = 1,
): React.PointerEvent {
  return new PointerEvent('pointerdown', {
    clientX,
    clientY,
    pointerId,
  }) as unknown as React.PointerEvent;
}

function dispatchPointer(
  el: HTMLElement,
  type: 'pointermove' | 'pointerup',
  clientX: number,
  clientY: number,
  pointerId = 1,
): void {
  el.dispatchEvent(new PointerEvent(type, { clientX, clientY, pointerId }));
}

describe('useResize', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('returns an onPointerDown handler', () => {
    const { ref } = setupRef();
    const { result } = renderHook(() =>
      useResize(ref, makeWindow({ id: makeWindowId('w1') }), vi.fn()),
    );
    expect(typeof result.current.onPointerDown).toBe('function');
  });

  it('invokes onResized with the delta while the resize handle is dragged', () => {
    const { ref, el } = setupRef();
    const onResized = vi.fn();
    const win = makeWindow({ id: makeWindowId('w1') });
    const { result } = renderHook(() => useResize(ref, win, onResized));
    result.current.onPointerDown(pointerDownEvent(0, 0));
    dispatchPointer(el, 'pointermove', 50, 25);
    expect(onResized).toHaveBeenCalledWith(win.id, 50, 25);
  });

  it('reports deltas relative to the start across multiple moves', () => {
    const { ref, el } = setupRef();
    const onResized = vi.fn();
    const win = makeWindow({ id: makeWindowId('w1') });
    const { result } = renderHook(() => useResize(ref, win, onResized));
    result.current.onPointerDown(pointerDownEvent(20, 10));
    dispatchPointer(el, 'pointermove', 70, 35);
    dispatchPointer(el, 'pointermove', 60, 30);
    expect(onResized).toHaveBeenLastCalledWith(win.id, 40, 20);
  });

  it('propagates drag state changes via onDragStateChange', () => {
    const { ref, el } = setupRef();
    const onDragStateChange = vi.fn();
    const { result } = renderHook(() =>
      useResize(
        ref,
        makeWindow({ id: makeWindowId('w1') }),
        vi.fn(),
        onDragStateChange,
      ),
    );
    result.current.onPointerDown(pointerDownEvent(0, 0));
    expect(onDragStateChange).toHaveBeenCalledWith(true);
    dispatchPointer(el, 'pointerup', 0, 0);
    expect(onDragStateChange).toHaveBeenLastCalledWith(false);
  });

  it('is a no-op when the window is maximized', () => {
    const { ref, el } = setupRef();
    const onResized = vi.fn();
    const onDragStateChange = vi.fn();
    const { result } = renderHook(() =>
      useResize(
        ref,
        makeWindow({ id: makeWindowId('w1'), state: 'maximized' }),
        onResized,
        onDragStateChange,
      ),
    );
    result.current.onPointerDown(pointerDownEvent(0, 0));
    dispatchPointer(el, 'pointermove', 99, 99);
    expect(onResized).not.toHaveBeenCalled();
    expect(onDragStateChange).not.toHaveBeenCalled();
  });
});
