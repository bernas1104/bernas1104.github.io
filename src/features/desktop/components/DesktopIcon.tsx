import { useState } from 'react';
import type { AppDescriptor } from '../types';
import { useWindowManager } from '../windowManager';
import ComputerExplorerIcon from '@/assets/icons/computer_explorer-5.png';

export function DesktopIcon({ app }: { app: AppDescriptor }) {
  const { dispatch } = useWindowManager();
  const [isSelected, setIsSelected] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && isSelected) {
      setIsSelected(false);
      dispatch({ type: 'OPEN_APP', app });
    }
  };

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={app.title}
      onClick={() => setIsSelected(true)}
      onBlur={() => setIsSelected(false)}
      onFocus={() => setIsSelected(true)}
      onDoubleClick={() => {
        setIsSelected(false);
        dispatch({ type: 'OPEN_APP', app });
      }}
      onKeyDown={handleKeyDown}
      className="desktop-icon-container"
    >
      <div className="desktop-icon">
        {isSelected && <div className="icon-selected" />}
        <img
          src={ComputerExplorerIcon}
          alt={'My Computer Icon'}
          width={32}
          height={32}
        />
      </div>
      <div
        className={`desktop-icon-text ${isSelected ? 'icon-text-selected' : ''}`}
      >
        <span>{app.title}</span>
      </div>
    </div>
  );
}
