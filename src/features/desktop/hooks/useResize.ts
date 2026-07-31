import {
  useDrag,
  type PointerDragHandlers,
} from '@/features/desktop/hooks/useDrag.ts';
import type { Size } from '@/common/types.ts';
import type { WindowId, WindowInstance } from '@/features/desktop/types.ts';

export function useResize(
  ref: React.RefObject<HTMLElement | null>,
  window: WindowInstance,
  onResize: (windowId: WindowId, size: Size) => void,
  onDragStateChange?: (isDragging: boolean) => void,
): PointerDragHandlers {
  return useDrag(
    ref,
    window,
    (windowId, deltaX, deltaY) =>
      onResize(windowId, {
        width: window.size.width + deltaX,
        height: window.size.height + deltaY,
      }),
    onDragStateChange,
  );
}
