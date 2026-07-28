import React, { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'info' | 'success' | 'warning' | 'purple';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'info',
  ...props
}) => {
  const variantStyles = {
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
