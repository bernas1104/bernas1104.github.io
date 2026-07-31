import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { WindowManagerProvider } from './features/desktop/windowManager/WindowManagerProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WindowManagerProvider>
      <App />
    </WindowManagerProvider>
  </StrictMode>,
);
