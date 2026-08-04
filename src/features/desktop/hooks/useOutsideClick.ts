import { useEffect, useRef } from 'react';

export function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  onOutsideClick: () => void,
  enabled: boolean,
) {
  const onOutsideClickRef = useRef(onOutsideClick);

  useEffect(() => {
    onOutsideClickRef.current = onOutsideClick;
  }, [onOutsideClick]);

  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (event: PointerEvent) => {
      const el = ref.current;

      if (el && !el.contains(event.target as Node)) {
        onOutsideClickRef.current();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [ref, enabled]);
}
