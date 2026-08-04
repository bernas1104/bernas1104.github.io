import type { AppDescriptor, AppId } from '@/features/desktop/types.ts';
import { useWindowManager } from '@/features/desktop/windowManager/index.ts';
import { DesktopIcon } from '@/features/desktop/components/DesktopIcon.tsx';
import { Window } from '@/features/desktop/components/Window.tsx';
import { Taskbar } from '@/features/desktop/components/Taskbar.tsx';
import { StartMenu } from '@/features/desktop/components/StartMenu.tsx';

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
      onClick={() => dispatch({ type: 'CLEAR_FOCUS' })}
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
      <Taskbar />
      <StartMenu />
    </div>
  );
}
