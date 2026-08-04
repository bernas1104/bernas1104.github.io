import { useEffect, useState } from 'react';

const MINUTE_MS = 60_000;

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function Clock() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const update = () => setTime(formatTime(new Date()));

    let interval: ReturnType<typeof setInterval> | undefined;
    const now = new Date();
    const msUntilNextMinute =
      MINUTE_MS - (now.getSeconds() * 1000 + now.getMilliseconds());

    const timeout = setTimeout(() => {
      update();
      interval = setInterval(update, MINUTE_MS);
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeout);
      if (interval !== undefined) clearInterval(interval);
    };
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
