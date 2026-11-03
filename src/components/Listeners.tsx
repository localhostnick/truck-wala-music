import { useState, useEffect } from 'react';
import { calculateLiveListeners } from '../utils/listeners';

export function Listeners() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setCount(calculateLiveListeners());
    update();
    const interval = window.setInterval(update, 6000);
    return () => window.clearInterval(interval);
  }, []);

  if (count === null) {
    return <div className="listeners" aria-hidden="true" />;
  }

  return (
    <div className="listeners">
      <span className="listeners__dot" aria-hidden="true" />
      <span className="listeners__count">{count.toLocaleString('en-IN')}</span>
      <span className="listeners__label">listening</span>
    </div>
  );
}
