import {
  useDrag,
  type PointerDragHandlers,
} from '@/features/desktop/hooks/useDrag.ts';
import type { WindowId, WindowInstance } from '@/features/desktop/types.ts';

export function useResize(
  ref: React.RefObject<HTMLElement | null>,
  window: WindowInstance,
  onResized: (windowId: WindowId, deltaX: number, deltaY: number) => void,
  onDragStateChange?: (isDragging: boolean) => void,
): PointerDragHandlers {
  return useDrag(ref, window, onResized, onDragStateChange);
}
