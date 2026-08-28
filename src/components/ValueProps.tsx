import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Headphones, Gem, Gift } from 'lucide-react';
import { VALUE_PROPS } from '../data/jewelryData';

const ICON_MAP: Record<string, React.ReactNode> = {
  Truck: <Truck className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  RotateCcw: <RotateCcw className="w-6 h-6" />,
  Headphones: <Headphones className="w-6 h-6" />,
  Gem: <Gem className="w-6 h-6" />,
  Gift: <Gift className="w-6 h-6" />
};

export const ValueProps: React.FC = () => {
  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 w-full">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
        {VALUE_PROPS.map((prop, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 items-center text-center group"
          >
            <div className="w-14 h-14 flex items-center justify-center bg-[#f1edec] dark:bg-zinc-800 rounded-2xl text-[#1c1b1b] dark:text-white group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300 shadow-sm">
              {ICON_MAP[prop.icon] || <Truck className="w-6 h-6" />}
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-[#1c1b1b] dark:text-white">
                {prop.title}
              </h3>
              <p className="text-xs text-[#444748] dark:text-gray-400 leading-relaxed max-w-[180px]">
                {prop.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
