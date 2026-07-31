import {
  useDrag,
  type PointerDragHandlers,
} from '@/features/desktop/hooks/useDrag.ts';
import type { Size } from '@/common/types.ts';
import type { WindowId, WindowInstance } from '@/features/desktop/types.ts';

export function useResize(
  ref: React.RefObject<HTMLElement | null>,
  win: WindowInstance,
  onResize: (windowId: WindowId, size: Size) => void,
  onDragStateChange?: (isDragging: boolean) => void,
): PointerDragHandlers {
  return useDrag(
    ref,
    win,
    (windowId, deltaX, deltaY) =>
      onResize(windowId, {
        width: win.size.width + deltaX,
        height: win.size.height + deltaY,
      }),
    onDragStateChange,
  );
}
