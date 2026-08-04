import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useOutsideClick } from '@/features/desktop/hooks/useOutsideClick.ts';

function setupRef(): {
  ref: React.RefObject<HTMLElement | null>;
  el: HTMLElement;
} {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return { ref: { current: el }, el };
}

function dispatchPointerDown(
  target: Node,
  options: PointerEventInit = {},
): void {
  target.dispatchEvent(
    new PointerEvent('pointerdown', { bubbles: true, ...options }),
  );
}

describe('useOutsideClick', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('calls onOutsideClick when a pointerdown occurs outside the ref element', () => {
    const { ref } = setupRef();
    const onOutsideClick = vi.fn();
    renderHook(() => useOutsideClick(ref, onOutsideClick, true));

    dispatchPointerDown(document.body);

    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onOutsideClick when a pointerdown occurs inside the ref element', () => {
    const { ref, el } = setupRef();
    const onOutsideClick = vi.fn();
    renderHook(() => useOutsideClick(ref, onOutsideClick, true));

    dispatchPointerDown(el);

    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('does not call onOutsideClick when the ref has no current element', () => {
    const ref: React.RefObject<HTMLElement | null> = { current: null };
    const onOutsideClick = vi.fn();
    renderHook(() => useOutsideClick(ref, onOutsideClick, true));

    dispatchPointerDown(document.body);

    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('does not call onOutsideClick when disabled', () => {
    const { ref } = setupRef();
    const onOutsideClick = vi.fn();
    renderHook(() => useOutsideClick(ref, onOutsideClick, false));

    dispatchPointerDown(document.body);

    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('does not attach a pointerdown listener when disabled', () => {
    const { ref } = setupRef();
    const onOutsideClick = vi.fn();
    const addSpy = vi.spyOn(document, 'addEventListener');

    renderHook(() => useOutsideClick(ref, onOutsideClick, false));

    expect(addSpy).not.toHaveBeenCalledWith(
      'pointerdown',
      expect.any(Function),
    );
  });

  it('attaches a pointerdown listener when enabled', () => {
    const { ref } = setupRef();
    const onOutsideClick = vi.fn();
    const addSpy = vi.spyOn(document, 'addEventListener');

    renderHook(() => useOutsideClick(ref, onOutsideClick, true));

    expect(addSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function));
  });

  it('removes the pointerdown listener on unmount', () => {
    const { ref } = setupRef();
    const onOutsideClick = vi.fn();
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useOutsideClick(ref, onOutsideClick, true),
    );
    unmount();

    expect(removeSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function));
  });

  it('does not call onOutsideClick after unmount', () => {
    const { ref } = setupRef();
    const onOutsideClick = vi.fn();
    const { unmount } = renderHook(() =>
      useOutsideClick(ref, onOutsideClick, true),
    );

    unmount();
    dispatchPointerDown(document.body);

    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('re-subscribes when enabled changes from false to true', () => {
    const { ref } = setupRef();
    const onOutsideClick = vi.fn();
    const { rerender } = renderHook(
      ({ enabled }) => useOutsideClick(ref, onOutsideClick, enabled),
      { initialProps: { enabled: false } },
    );

    dispatchPointerDown(document.body);
    expect(onOutsideClick).not.toHaveBeenCalled();

    rerender({ enabled: true });
    dispatchPointerDown(document.body);
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('stops calling onOutsideClick when enabled changes from true to false', () => {
    const { ref } = setupRef();
    const onOutsideClick = vi.fn();
    const { rerender } = renderHook(
      ({ enabled }) => useOutsideClick(ref, onOutsideClick, enabled),
      { initialProps: { enabled: true } },
    );

    dispatchPointerDown(document.body);
    expect(onOutsideClick).toHaveBeenCalledTimes(1);

    rerender({ enabled: false });
    dispatchPointerDown(document.body);
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('invokes the latest onOutsideClick when the callback changes across renders', () => {
    const { ref } = setupRef();
    const first = vi.fn();
    const second = vi.fn();

    const { rerender } = renderHook(
      ({ cb }) => useOutsideClick(ref, cb, true),
      { initialProps: { cb: first } },
    );

    dispatchPointerDown(document.body);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();

    rerender({ cb: second });
    dispatchPointerDown(document.body);

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });
});
