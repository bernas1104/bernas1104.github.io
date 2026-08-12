import { Clock } from '@/features/desktop/components/Clock.tsx';
import { useWindowManager } from '@/features/desktop/windowManager/index.ts';
import WindowsStartMenuIcon from '@/assets/icons/windows-4.png';
import { iconMap } from '@/common/icons.ts';
import { useStartMenu } from '@/features/desktop/hooks/useStartMenu.ts';
import { resolveTaskbarAction } from '@/features/desktop/utils/index.ts';
import { appRegistry } from '@/apps/index.ts';

export function Taskbar() {
  const { state, dispatch } = useWindowManager();
  const { isStartMenuOpen, onStartMenuToggle } = useStartMenu();

  return (
    <div className="taskbar">
      <div
        role="button"
        aria-expanded={isStartMenuOpen}
        className={`start-menu-button ${isStartMenuOpen ? 'active' : ''}`}
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
            const app = appRegistry[window.appId];

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
                {app && <img src={iconMap[app.icon]} alt="" />}
                {window.title}
              </button>
            );
          })}
      </div>
      <Clock />
    </div>
  );
}
