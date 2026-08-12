import App from '@/App.tsx';
import { StartMenuProvider } from '@/features/desktop/StartMenuProvider.tsx';
import { WindowManagerProvider } from '@/features/desktop/windowManager/index.ts';
import { ShutdownProvider } from '@/features/boot/shutdown/index.ts';

export function AppShell() {
  return (
    <WindowManagerProvider>
      <StartMenuProvider>
        <ShutdownProvider>
          <App />
        </ShutdownProvider>
      </StartMenuProvider>
    </WindowManagerProvider>
  );
}
