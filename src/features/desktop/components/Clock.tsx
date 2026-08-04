import { useEffect, useState } from 'react';

export function Clock() {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clock-container">
      <div className="vertical-separator" />
      <div className="clock">
        <span className="clock-text" aria-label="Current time">
          {time}
        </span>
      </div>
    </div>
  );
}
