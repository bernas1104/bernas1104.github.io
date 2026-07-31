import { useRef } from 'react';
import { useWindowManager } from '@/features/desktop/windowManager/index.ts';
import type { WindowInstance } from '@/features/desktop/types.ts';
import { useDrag } from '@/features/desktop/hooks/useDrag.ts';

export type TitleBarProps = {
  title: string;
  window: WindowInstance;
  isFocused: boolean;
  onDragStateChange?: (isDragging: boolean) => void;
};

export function TitleBar(props: TitleBarProps) {
  const ref = useRef(null);

  const { dispatch } = useWindowManager();
  const { onPointerDown } = useDrag(
    ref,
    props.window,
    (windowId, deltaX, deltaY) => {
      dispatch({
        type: 'MOVE_WINDOW',
        windowId,
        position: {
          x: props.window.position.x + deltaX,
          y: props.window.position.y + deltaY,
        },
      });
    },
    props.onDragStateChange,
  );

  return (
    <div
      ref={ref}
      className={'title-bar' + (props.isFocused ? '' : ' inactive')}
      onPointerDown={onPointerDown}
    >
      <div className="title-bar-icon" style={{ marginRight: 10 }}>
        IC
      </div>
      <div className="title-bar-text" style={{ flex: 1 }}>
        {props.title}
      </div>
      <div className="title-bar-controls">
        <button
          aria-label="Minimize"
          onPointerDown={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            dispatch({ type: 'MINIMIZE_WINDOW', windowId: props.window.id });
          }}
        />
        {props.window.state === 'open' && (
          <button
            aria-label="Maximize"
            onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              dispatch({ type: 'TOGGLE_MAXIMIZE', windowId: props.window.id });
            }}
          />
        )}
        {props.window.state === 'maximized' && (
          <button
            aria-label="Restore"
            onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              dispatch({ type: 'TOGGLE_MAXIMIZE', windowId: props.window.id });
            }}
          />
        )}
        <button
          aria-label="Close"
          onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            dispatch({ type: 'CLOSE_WINDOW', windowId: props.window.id });
          }}
        />
      </div>
    </div>
  );
}
