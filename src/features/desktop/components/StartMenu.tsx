import { useEffect, useRef } from 'react';
import { useOutsideClick } from '@/features/desktop/hooks/useOutsideClick.ts';
import { useStartMenu } from '@/features/desktop/hooks/useStartMenu.ts';
import { useWindowManager } from '@/features/desktop/windowManager/index.ts';
import { iconMap } from '@/common/icons.ts';
import { appRegistry } from '@/apps/registry.ts';

export function StartMenu() {
  const ref = useRef<HTMLDivElement | null>(null);

  const { state, dispatch } = useWindowManager();
  const { isStartMenuOpen: isOpen, closeStartMenu } = useStartMenu();
  useOutsideClick(ref, closeStartMenu, true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeStartMenu();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeStartMenu]);

  return (
    isOpen && (
      <div
        className="start-menu"
        ref={ref}
        style={{
          zIndex: state.focusedWindowId
            ? ''
            : 'var(--win98-z-index-start-menu)',
        }}
      >
        <div className="start-menu-sidebar">
          <div className="sidebar-title">
            <strong className="title-shadow">Bernas</strong>OS
          </div>
        </div>
        <div className="start-menu-content">
          {Object.values(appRegistry).map((app) => (
            <button
              role="button"
              key={app.id}
              className="start-menu-item"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                dispatch({ type: 'OPEN_APP', app });
                closeStartMenu();
              }}
            >
              <img src={iconMap[app.icon]} alt={app.title} />
              <span>{app.title}</span>
            </button>
          ))}
          <hr />
          <button
            role="button"
            className="start-menu-item"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              // TODO -- Shutdown functionality
              closeStartMenu();
            }}
          >
            <img src={iconMap['shutdown']} alt="Shutdown" />
            <span>Shutdown</span>
          </button>
        </div>
      </div>
    )
  );
}
