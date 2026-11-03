import { useState, useEffect } from 'react';
import { presenceManager } from '../utils/presence';

export function Listeners() {
  const [count, setCount] = useState<number>(presenceManager.getCount());

  useEffect(() => {
    const unsubscribe = presenceManager.subscribe((activeCount) => {
      setCount(activeCount);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="listeners" title={`${count} active listener${count > 1 ? 's' : ''} on the road`}>
      <span className="listeners__dot" aria-hidden="true" />
      <span className="listeners__count font-mono font-bold">{count.toLocaleString('en-IN')}</span>
      <span className="listeners__label font-semibold tracking-wider uppercase">
        {count === 1 ? 'LISTENING' : 'LISTENING'}
      </span>
    </div>
  );
}
