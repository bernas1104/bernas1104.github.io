import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import App from '@/App.tsx';
import { WindowManagerProvider } from '@/features/desktop/windowManager/WindowManagerProvider.tsx';
import { StartMenuProvider } from '@/features/desktop/StartMenuProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WindowManagerProvider>
      <StartMenuProvider>
        <App />
      </StartMenuProvider>
    </WindowManagerProvider>
  </StrictMode>,
);
