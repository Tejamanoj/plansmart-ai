import React, { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, glass = true, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-300',
        glass
          ? 'glass-panel shadow-xl'
          : 'bg-slate-900/90 border border-slate-800 shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
