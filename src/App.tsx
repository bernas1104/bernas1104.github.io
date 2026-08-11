import {
  useBootSequence,
  usePrefersReducedMotion,
  BootScreen,
} from '@/features/boot/index.ts';
// import { IdleScreen } from '@/features/shell/index.ts';
import { Desktop } from '@/features/desktop/components/Desktop.tsx';

function App() {
  const { status, skip } = useBootSequence();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <>
      {status === 'booting' && (
        <BootScreen onSkip={skip} prefersReducedMotion={prefersReducedMotion} />
      )}
      {status === 'dismissed' && <Desktop />}
    </>
  );
}

export default App;
