import type { AppId } from '@/common/types.ts';
import { useWindowManager } from '@/features/desktop/windowManager/index.ts';
import { DesktopIcon } from '@/features/desktop/components/DesktopIcon.tsx';
import { Window } from '@/features/desktop/components/Window.tsx';
import { Taskbar } from '@/features/desktop/components/Taskbar.tsx';
import { StartMenu } from '@/features/desktop/components/StartMenu.tsx';
import { appRegistry } from '@/apps/index.ts';

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
              app={appRegistry[window.appId as AppId]}
              window={window}
              focusedWindowId={state.focusedWindowId}
            />
          );
        })}
      {Object.values(appRegistry).map((app) => {
        return <DesktopIcon key={app.id} app={app} />;
      })}
      <Taskbar />
      <StartMenu />
    </div>
  );
}
