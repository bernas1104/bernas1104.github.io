import { useEffect, useRef } from 'react';
import type { WindowId, WindowInstance } from '@/features/desktop/types.ts';

export type PointerDragHandlers = {
  onPointerDown(event: React.PointerEvent): void;
};

export function useDrag(
  ref: React.RefObject<HTMLElement | null>,
  window: WindowInstance,
  onDelta: (windowId: WindowId, deltaX: number, deltaY: number) => void,
  onDragStateChange?: (isDragging: boolean) => void,
): PointerDragHandlers {
  const finishRef = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      finishRef.current?.();
    },
    [],
  );

  const onPointerDown = (event: React.PointerEvent) => {
    const el = ref.current;

    if (window.state === 'maximized' || !el) return;

    el.setPointerCapture?.(event.pointerId);

    const startX = event.clientX;
    const startY = event.clientY;

    const onMove = (e: PointerEvent) => {
      onDelta(window.id, e.clientX - startX, e.clientY - startY);
    };

    const finish = () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', finish);
      el.removeEventListener('pointercancel', finish);

      if (el.hasPointerCapture?.(event.pointerId))
        el.releasePointerCapture(event.pointerId);

      onDragStateChange?.(false);
      finishRef.current = null;
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', finish);
    el.addEventListener('pointercancel', finish);
    finishRef.current = finish;
    onDragStateChange?.(true);
  };

  return { onPointerDown };
}
