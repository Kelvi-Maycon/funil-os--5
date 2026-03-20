import { useState, useEffect, useRef } from 'react';

export default function SegmentTimer({ durationSeconds, label }) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    setElapsed(0);
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [label]);

  const remaining = Math.max(0, durationSeconds - elapsed);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = Math.min(100, (elapsed / durationSeconds) * 100);
  const overtime = elapsed > durationSeconds;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="font-bold text-neutral-700">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${overtime ? 'bg-orange-400' : 'bg-teal-500'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className={`text-xs font-mono font-bold ${overtime ? 'text-orange-500' : 'text-neutral-500'}`}>
        {overtime ? '+' : ''}{minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
