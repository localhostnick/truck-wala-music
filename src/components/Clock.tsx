import { useState, useEffect } from 'react';

export function Clock() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    const interval = window.setInterval(updateTime, 30000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="clock" aria-label="Current time">
      {time || '\u00A0'}
    </div>
  );
}
