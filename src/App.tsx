import {
  useBootSequence,
  usePrefersReducedMotion,
  BootScreen,
} from '@/features/boot/index.ts';
import { Desktop } from '@/features/desktop/components/Desktop.tsx';
import { useShutdown, ShutdownScreen } from '@/features/boot/shutdown/index.ts';

function App() {
  const { status, skip } = useBootSequence();
  const {
    state: { status: shutdownStatus },
  } = useShutdown();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <>
      {(status === 'booting' || shutdownStatus === 'shuttingDown') && (
        <BootScreen
          onSkip={shutdownStatus === 'shuttingDown' ? () => {} : skip}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}
      {status === 'dismissed' && shutdownStatus === 'idle' && <Desktop />}
      {shutdownStatus === 'off' && <ShutdownScreen />}
    </>
  );
}

export default App;
