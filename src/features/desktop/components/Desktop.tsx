import type { AppId } from '../types';
import { useWindowManager } from '../windowManager';
import { DesktopIcon } from './DesktopIcon';
import { Window } from './Window';

export function Desktop() {
  const { state, dispatch } = useWindowManager();

  return (
    <div
      className="desktop bg-desktop min-h-screen"
      onPointerDown={(e: React.PointerEvent<HTMLDivElement>) =>
        e.stopPropagation()
      }
      onClick={() => dispatch({ type: 'CLEAR_FOCUS' })}
    >
      {Array.from(state.windows.values())
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((window) => {
          if (window.state === 'minimized') return null;

          return (
            <Window
              key={window.id}
              app={{
                id: '1' as AppId,
                title: 'BernasOS',
                defaultSize: { width: 400, height: 300 },
                singleton: true,
                resizable: true,
                icon: 'folder',
              }}
              window={window}
              focusedWindowId={state.focusedWindowId}
            />
          );
        })}

      <DesktopIcon
        app={{
          id: '1' as AppId,
          title: 'BernasOS',
          defaultSize: { width: 400, height: 300 },
          singleton: true,
          resizable: true,
          icon: 'folder',
        }}
      />
    </div>
  );
}
