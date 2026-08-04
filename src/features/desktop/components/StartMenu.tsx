import { useEffect, useRef } from 'react';
import { useOutsideClick } from '@/features/desktop/hooks/useOutsideClick.ts';
import { useStartMenu } from '@/features/desktop/hooks/useStartMenu.ts';
import { useWindowManager } from '@/features/desktop/windowManager/index.ts';
import ComputerIcon from '@/assets/icons/computer_explorer-3.png';
import type { AppId } from '@/features/desktop/types.ts';

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
          <div
            className="start-menu-item"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              dispatch({
                type: 'OPEN_APP',
                app: {
                  id: '1' as AppId,
                  title: 'BernasOS',
                  defaultSize: { width: 400, height: 300 },
                  singleton: true,
                  resizable: true,
                  icon: 'folder',
                },
              });
              closeStartMenu();
            }}
          >
            <img src={ComputerIcon} alt="My Computer" />
            <span>My Computer</span>
          </div>
        </div>
      </div>
    )
  );
}
