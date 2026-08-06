import { useEffect } from 'react';
import '@/features/boot/boot.css';

export type BootScreenProps = {
  onSkip: () => void;
  prefersReducedMotion: boolean;
};

export function BootScreen({ onSkip, prefersReducedMotion }: BootScreenProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        event.preventDefault();
        onSkip();
      }
      if (event.key === 'Enter') onSkip();
    };

    const handleClick = () => {
      onSkip();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [onSkip]);

  useEffect(() => {
    if (prefersReducedMotion) onSkip();
  }, [prefersReducedMotion, onSkip]);

  return (
    <div
      className="boot-screen"
      role="status"
      aria-live="polite"
      aria-label="BernasOS loading"
    >
      {[...Array(3)].map((_, i) => (
        <div key={i} className={`boot-cloud boot-cloud-${i + 1}`} />
      ))}
      <div className="boot-wordmark">
        <span>BernasOS</span>
      </div>
      <div className="boot-spinner">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="boot-spinner-block" />
        ))}
      </div>
    </div>
  );
}
