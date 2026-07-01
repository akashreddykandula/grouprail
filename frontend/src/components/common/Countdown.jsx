import { useState, useEffect } from 'react';

const pad = (n) => String(n).padStart(2, '0');

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) return setTimeLeft(null);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!timeLeft) return <span className="text-slate-400 text-sm">Journey date has passed</span>;

  return (
    <div className="flex items-center gap-3">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds },
      ].map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg tabular-nums">{pad(value)}</span>
          </div>
          <p className="text-slate-500 text-xs mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
