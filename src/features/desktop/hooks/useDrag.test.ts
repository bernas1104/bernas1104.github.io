import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDrag } from '@/features/desktop/hooks/useDrag.ts';
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

type PointerCaptureEl = HTMLElement & {
  setPointerCapture?: (pointerId: number) => void;
  hasPointerCapture?: (pointerId: number) => boolean;
  releasePointerCapture?: (pointerId: number) => void;
};

function setupRef(): {
  ref: React.RefObject<HTMLElement | null>;
  el: PointerCaptureEl;
} {
  const el = document.createElement('div') as PointerCaptureEl;
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
  type: 'pointermove' | 'pointerup' | 'pointercancel',
  clientX: number,
  clientY: number,
  pointerId = 1,
): void {
  el.dispatchEvent(new PointerEvent(type, { clientX, clientY, pointerId }));
}

describe('useDrag', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('returns an onPointerDown handler', () => {
    const { ref } = setupRef();
    const { result } = renderHook(() =>
      useDrag(ref, makeWindow({ id: makeWindowId('w1') }), vi.fn()),
    );
    expect(typeof result.current.onPointerDown).toBe('function');
  });

  it('signals the start of a drag via onDragStateChange(true)', () => {
    const { ref } = setupRef();
    const onDragStateChange = vi.fn();
    const { result } = renderHook(() =>
      useDrag(
        ref,
        makeWindow({ id: makeWindowId('w1') }),
        vi.fn(),
        onDragStateChange,
      ),
    );
    result.current.onPointerDown(pointerDownEvent(10, 20));
    expect(onDragStateChange).toHaveBeenCalledWith(true);
    expect(onDragStateChange).toHaveBeenCalledTimes(1);
  });

  it('captures the pointer via setPointerCapture when supported', () => {
    const { ref, el } = setupRef();
    el.setPointerCapture = vi.fn();
    const { result } = renderHook(() =>
      useDrag(ref, makeWindow({ id: makeWindowId('w1') }), vi.fn()),
    );
    result.current.onPointerDown(pointerDownEvent(0, 0, 7));
    expect(el.setPointerCapture).toHaveBeenCalledWith(7);
  });

  it('reports the cumulative delta from the drag start on each pointermove', () => {
    const { ref, el } = setupRef();
    const onDelta = vi.fn();
    const win = makeWindow({ id: makeWindowId('w1') });
    const { result } = renderHook(() => useDrag(ref, win, onDelta));
    result.current.onPointerDown(pointerDownEvent(100, 50));
    dispatchPointer(el, 'pointermove', 140, 80);
    expect(onDelta).toHaveBeenCalledWith(win.id, 40, 30);
  });

  it('keeps deltas relative to the start position across multiple moves', () => {
    const { ref, el } = setupRef();
    const onDelta = vi.fn();
    const win = makeWindow({ id: makeWindowId('w1') });
    const { result } = renderHook(() => useDrag(ref, win, onDelta));
    result.current.onPointerDown(pointerDownEvent(100, 50));
    dispatchPointer(el, 'pointermove', 140, 80);
    dispatchPointer(el, 'pointermove', 120, 70);
    expect(onDelta).toHaveBeenLastCalledWith(win.id, 20, 20);
  });

  it('ends the drag and removes listeners on pointerup', () => {
    const { ref, el } = setupRef();
    const onDelta = vi.fn();
    const onDragStateChange = vi.fn();
    const { result } = renderHook(() =>
      useDrag(
        ref,
        makeWindow({ id: makeWindowId('w1') }),
        onDelta,
        onDragStateChange,
      ),
    );
    result.current.onPointerDown(pointerDownEvent(0, 0));
    dispatchPointer(el, 'pointerup', 5, 5);
    expect(onDragStateChange).toHaveBeenLastCalledWith(false);
    dispatchPointer(el, 'pointermove', 99, 99);
    expect(onDelta).not.toHaveBeenCalled();
  });

  it('ends the drag and removes listeners on pointercancel', () => {
    const { ref, el } = setupRef();
    const onDelta = vi.fn();
    const onDragStateChange = vi.fn();
    const { result } = renderHook(() =>
      useDrag(
        ref,
        makeWindow({ id: makeWindowId('w1') }),
        onDelta,
        onDragStateChange,
      ),
    );
    result.current.onPointerDown(pointerDownEvent(0, 0));
    dispatchPointer(el, 'pointercancel', 1, 1);
    expect(onDragStateChange).toHaveBeenLastCalledWith(false);
    dispatchPointer(el, 'pointermove', 99, 99);
    expect(onDelta).not.toHaveBeenCalled();
  });

  it('releases the pointer capture on finish when the element has it captured', () => {
    const { ref, el } = setupRef();
    el.hasPointerCapture = vi.fn(() => true);
    el.releasePointerCapture = vi.fn();
    const { result } = renderHook(() =>
      useDrag(ref, makeWindow({ id: makeWindowId('w1') }), vi.fn()),
    );
    result.current.onPointerDown(pointerDownEvent(0, 0, 4));
    dispatchPointer(el, 'pointerup', 0, 0, 4);
    expect(el.hasPointerCapture).toHaveBeenCalledWith(4);
    expect(el.releasePointerCapture).toHaveBeenCalledWith(4);
  });

  it('does not release pointer capture when the element does not have it captured', () => {
    const { ref, el } = setupRef();
    el.hasPointerCapture = vi.fn(() => false);
    el.releasePointerCapture = vi.fn();
    const { result } = renderHook(() =>
      useDrag(ref, makeWindow({ id: makeWindowId('w1') }), vi.fn()),
    );
    result.current.onPointerDown(pointerDownEvent(0, 0, 4));
    dispatchPointer(el, 'pointerup', 0, 0, 4);
    expect(el.releasePointerCapture).not.toHaveBeenCalled();
  });

  it('is a no-op when the window is maximized', () => {
    const { ref, el } = setupRef();
    const onDelta = vi.fn();
    const onDragStateChange = vi.fn();
    const { result } = renderHook(() =>
      useDrag(
        ref,
        makeWindow({ id: makeWindowId('w1'), state: 'maximized' }),
        onDelta,
        onDragStateChange,
      ),
    );
    result.current.onPointerDown(pointerDownEvent(0, 0));
    expect(onDragStateChange).not.toHaveBeenCalled();
    dispatchPointer(el, 'pointermove', 50, 50);
    expect(onDelta).not.toHaveBeenCalled();
  });

  it('is a no-op when the ref has no current element', () => {
    const ref: React.RefObject<HTMLElement | null> = { current: null };
    const onDelta = vi.fn();
    const onDragStateChange = vi.fn();
    const { result } = renderHook(() =>
      useDrag(
        ref,
        makeWindow({ id: makeWindowId('w1') }),
        onDelta,
        onDragStateChange,
      ),
    );
    result.current.onPointerDown(pointerDownEvent(0, 0));
    expect(onDragStateChange).not.toHaveBeenCalled();
    expect(onDelta).not.toHaveBeenCalled();
  });

  it('works without an onDragStateChange callback', () => {
    const { ref, el } = setupRef();
    const onDelta = vi.fn();
    const win = makeWindow({ id: makeWindowId('w1') });
    const { result } = renderHook(() => useDrag(ref, win, onDelta));
    result.current.onPointerDown(pointerDownEvent(0, 0));
    dispatchPointer(el, 'pointermove', 10, 10);
    expect(onDelta).toHaveBeenCalledWith(win.id, 10, 10);
    dispatchPointer(el, 'pointerup', 10, 10);
  });

  it('cleans up listeners and signals drag end if the component unmounts mid-drag', () => {
    const { ref, el } = setupRef();
    const onDelta = vi.fn();
    const onDragStateChange = vi.fn();
    const { result, unmount } = renderHook(() =>
      useDrag(
        ref,
        makeWindow({ id: makeWindowId('w1') }),
        onDelta,
        onDragStateChange,
      ),
    );
    result.current.onPointerDown(pointerDownEvent(0, 0));
    expect(onDragStateChange).toHaveBeenLastCalledWith(true);

    unmount();

    expect(onDragStateChange).toHaveBeenLastCalledWith(false);
    dispatchPointer(el, 'pointermove', 99, 99);
    expect(onDelta).not.toHaveBeenCalled();
  });
});
