import React from 'react';
import { cn } from '@/utils/cn';

interface DaySelectorProps {
  totalDays: number;
  activeDay: number;
  onSelectDay: (day: number) => void;
  dayThemes?: Record<number, string>;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  totalDays,
  activeDay,
  onSelectDay,
  dayThemes = {}
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none flex gap-2">
      {Array.from({ length: totalDays }, (_, i) => i + 1).map((dayNum) => {
        const theme = dayThemes[dayNum] || `Day ${dayNum}`;
        const isActive = activeDay === dayNum;

        return (
          <button
            key={dayNum}
            onClick={() => onSelectDay(dayNum)}
            className={cn(
              'px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap border shrink-0 cursor-pointer select-none',
              isActive
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-sky-500/25 shadow-lg shadow-sky-500/10 scale-102'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            )}
          >
            <div className="text-[10px] font-bold opacity-75 uppercase tracking-wider">Day {dayNum}</div>
            <div className="font-bold truncate max-w-[120px] mt-0.5">{theme}</div>
          </button>
        );
      })}
    </div>
  );
};
