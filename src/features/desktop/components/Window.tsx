import { useState, useRef } from 'react';
import { useResize } from '@/features/desktop/hooks/useResize.ts';
import type {
  AppDescriptor,
  WindowId,
  WindowInstance,
} from '@/features/desktop/types.ts';
import { TitleBar } from '@/features/desktop/components/TitleBar.tsx';
import { useWindowManager } from '@/features/desktop/windowManager';

export type WindowProps = {
  app: AppDescriptor;
  window: WindowInstance;
  focusedWindowId?: WindowId | null;
  children?: React.ReactNode;
};

export function Window(props: WindowProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const { dispatch } = useWindowManager();
  const { onPointerDown } = useResize(
    ref,
    props.window,
    (windowId, size) => {
      dispatch({ type: 'RESIZE_WINDOW', windowId, size });
    },
    setIsDragging,
  );

  const isMaximized = props.window.state === 'maximized';

  if (props.window.state === 'minimized') return null;

  return (
    <div
      className="window"
      onPointerDown={() =>
        dispatch({ type: 'FOCUS_WINDOW', windowId: props.window.id })
      }
      style={{
        zIndex: props.window.zIndex,
        position: 'absolute',
        top: isMaximized ? '0px' : `${props.window.position.y}px`,
        left: isMaximized ? '0px' : `${props.window.position.x}px`,
        width: isMaximized ? '100%' : `${props.window.size.width}px`,
        height: isMaximized ? '100%' : `${props.window.size.height}px`,
        transition: isDragging
          ? 'none'
          : 'top 0.2s, left 0.2s, width 0.2s, height 0.2s',
      }}
    >
      <TitleBar
        title={props.window.title}
        window={props.window}
        isFocused={props.window.id === props.focusedWindowId}
        onDragStateChange={setIsDragging}
      />
      <div className="window-body">{props.children}</div>

      {props.app.resizable && !isMaximized && (
        <div
          ref={ref}
          style={{
            position: 'absolute',
            top: '98%',
            left: '98%',
            width: '10px',
            height: '10px',
            cursor: 'nwse-resize',
            backgroundColor: 'transparent',
          }}
          onPointerDown={(event) => onPointerDown(event)}
          aria-label="Resize handle"
        />
      )}
    </div>
  );
}
