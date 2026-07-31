import { useCallback, useState, useRef } from 'react';
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
};

export function Window(props: WindowProps) {
  const ref = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  const { dispatch } = useWindowManager();
  const { onPointerDown } = useResize(
    ref,
    props.window,
    (windowId, deltaX, deltaY) => {
      dispatch({
        type: 'RESIZE_WINDOW',
        windowId,
        size: {
          width: props.window.size.width + deltaX,
          height: props.window.size.height + deltaY,
        },
      });
    },
    setIsDragging,
  );

  const getWindowTopPosition = useCallback(() => {
    if (props.window.state === 'maximized') return '0px';

    return props.window.position.y + 'px';
  }, [props.window.state, props.window.position.y]);

  const getWindowLeftPosition = useCallback(() => {
    if (props.window.state === 'maximized') return '0px';

    return props.window.position.x + 'px';
  }, [props.window.state, props.window.position.x]);

  const getWindowWidth = useCallback(() => {
    if (props.window.state === 'maximized') return '100%';

    return props.window.size.width + 'px';
  }, [props.window.state, props.window.size.width]);

  const getWindowHeight = useCallback(() => {
    if (props.window.state === 'maximized') return '100%';

    return props.window.size.height + 'px';
  }, [props.window.state, props.window.size.height]);

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
        top: getWindowTopPosition(),
        left: getWindowLeftPosition(),
        width: getWindowWidth(),
        height: getWindowHeight(),
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
      <div className="window-body">
        <div className="field-border">
          <span className="field-border-text">Window Content</span>
        </div>
      </div>

      {props.app.resizable && props.window.state !== 'maximized' && (
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
          aria-label="Resize handler"
        />
      )}
    </div>
  );
}
