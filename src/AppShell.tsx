import App from '@/App.tsx';
import { StartMenuProvider } from '@/features/desktop/StartMenuProvider.tsx';
import { WindowManagerProvider } from '@/features/desktop/windowManager/index.ts';

export function AppShell() {
  return (
    <WindowManagerProvider>
      <StartMenuProvider>
        <App />
      </StartMenuProvider>
    </WindowManagerProvider>
  );
}
