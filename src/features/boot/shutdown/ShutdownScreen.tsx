import '@/features/boot/shutdown/shutdownScreen.css';

export function ShutdownScreen() {
  return (
    <div
      className="shutdown-screen"
      role="status"
      aria-label="BernasOS shutdown complete"
    >
      {"It's now safe to turn off your computer."}
    </div>
  );
}
