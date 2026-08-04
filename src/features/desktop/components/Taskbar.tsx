import { Clock } from '@/features/desktop/components/Clock.tsx';
import { useWindowManager } from '@/features/desktop/windowManager/index.ts';
import WindowsStartMenuIcon from '@/assets/icons/windows-4.png';
import { useStartMenu } from '@/features/desktop/hooks/useStartMenu.ts';
import { resolveTaskbarAction } from '@/features/desktop/utils/index.ts';

export function Taskbar() {
  const { state, dispatch } = useWindowManager();
  const { onStartMenuToggle } = useStartMenu();

  return (
    <div className="taskbar">
      <div
        className="start-menu-button"
        role="button"
        onClick={() => onStartMenuToggle()}
        onPointerDown={(e: React.PointerEvent<HTMLDivElement>) =>
          e.stopPropagation()
        }
      >
        <img src={WindowsStartMenuIcon} alt="Start Menu" />
        <span className="start-menu-text">Start</span>
      </div>
      <div className="taskbar-buttons">
        {Array.from(state.windows.values())
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((window) => {
            return (
              <button
                key={window.id}
                className={`taskbar-button ${
                  state.focusedWindowId === window.id ? 'focused' : ''
                }`}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();

                  const win = state.windows.get(window.id);
                  if (!win) return;

                  dispatch(resolveTaskbarAction(window, state.focusedWindowId));
                }}
              >
                {window.title}
              </button>
            );
          })}
      </div>
      <Clock />
    </div>
  );
}
