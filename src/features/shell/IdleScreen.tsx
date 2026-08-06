import '@/features/shell/idleScreen.css';

export function IdleScreen() {
  // PLACEHOLDER -- replaced by M2.4 Desktop
  return (
    <div
      className="idle-screen"
      role="status"
      aria-live="polite"
      aria-label="BernasOS idle screen"
    >
      <div className="idle-wordmark">
        <span>BernasOS is under construction.</span>
      </div>
    </div>
  );
}
