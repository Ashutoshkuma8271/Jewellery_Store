import React, { useState, useEffect } from 'react';
import { Timer, Zap, Sparkles } from 'lucide-react';

interface FlashSaleProps {
  onUnlockAccess: () => void;
}

export const FlashSale: React.FC<FlashSaleProps> = ({ onUnlockAccess }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 50
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTwoDigits = (num: number) => String(num).padStart(2, '0');

  return (
    <section id="deals-section" className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 w-full">
      <div className="relative rounded-3xl overflow-hidden bg-black text-white min-h-[420px] flex items-center p-8 md:p-14 shadow-2xl">
        {/* Background Overlay */}
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center mix-blend-luminosity"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

        <div className="relative z-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold tracking-wider uppercase">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Limited Time Offer</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            The Midnight Flash Sale
          </h2>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Up to 60% off our most-wanted tech, home accents, and accessories. Prices auto-adjust as the clock ticks.
          </p>

          {/* Countdown Clock */}
          <div className="flex items-center gap-6 pt-2">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold font-mono text-white">
                {formatTwoDigits(timeLeft.hours)}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1">
                Hours
              </span>
            </div>

            <span className="text-3xl font-bold text-gray-500">:</span>

            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold font-mono text-white">
                {formatTwoDigits(timeLeft.minutes)}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1">
                Mins
              </span>
            </div>

            <span className="text-3xl font-bold text-gray-500">:</span>

            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold font-mono text-amber-400">
                {formatTwoDigits(timeLeft.seconds)}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1">
                Secs
              </span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onUnlockAccess}
              className="px-8 py-4 bg-white text-black font-semibold text-sm rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Unlock Early Access (60% Off)</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
