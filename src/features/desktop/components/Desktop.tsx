import type { AppDescriptor, AppId } from '../types';
import { useWindowManager } from '../windowManager';
import { DesktopIcon } from './DesktopIcon';
import { Window } from './Window';

const bernasOsApp: AppDescriptor = {
  id: '1' as AppId,
  title: 'BernasOS',
  defaultSize: { width: 400, height: 300 },
  singleton: true,
  resizable: true,
  icon: 'folder',
};

export function Desktop() {
  const { state, dispatch } = useWindowManager();

  return (
    <div
      className="desktop bg-desktop min-h-screen"
      role="presentation"
      onPointerDown={(e: React.PointerEvent<HTMLDivElement>) =>
        e.stopPropagation()
      }
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) dispatch({ type: 'CLEAR_FOCUS' });
      }}
    >
      {Array.from(state.windows.values())
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((window) => {
          if (window.state === 'minimized') return null;

          return (
            <Window
              key={window.id}
              app={bernasOsApp}
              window={window}
              focusedWindowId={state.focusedWindowId}
            />
          );
        })}

      <DesktopIcon app={bernasOsApp} />
    </div>
  );
}
