import React, { type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:brightness-110 active:scale-[0.98]',
    glow:
      'relative bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 text-white font-bold shadow-xl shadow-sky-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] border border-white/20',
    secondary:
      'bg-slate-800/90 text-slate-100 border border-slate-700/80 hover:bg-slate-700/90 hover:border-slate-600 active:scale-[0.98]',
    outline:
      'border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800/60 hover:border-slate-500 active:scale-[0.98]',
    ghost:
      'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
