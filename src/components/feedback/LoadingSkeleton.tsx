import React from 'react';
import { Card } from '@/components/common/Card';
import { cn } from '@/utils/cn';

interface LoadingSkeletonProps {
  type?: 'itinerary' | 'card' | 'form';
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'itinerary', className }) => {
  if (type === 'form') {
    return (
      <Card className={cn('max-w-3xl mx-auto space-y-6 animate-pulse', className)}>
        <div className="h-7 bg-slate-800/80 rounded-lg w-1/3" />
        <div className="h-32 bg-slate-900/90 border border-slate-800/60 rounded-xl" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-slate-800/60 rounded w-1/4" />
          <div className="h-10 bg-slate-800 rounded-xl w-32" />
        </div>
      </Card>
    );
  }

  if (type === 'card') {
    return (
      <Card className={cn('p-6 space-y-4 animate-pulse border border-slate-800', className)}>
        <div className="flex justify-between items-center">
          <div className="h-5 bg-slate-800 rounded-full w-20" />
          <div className="h-4 bg-slate-800 rounded-full w-12" />
        </div>
        <div className="h-6 bg-slate-800 rounded-lg w-3/4" />
        <div className="h-4 bg-slate-800/60 rounded w-full" />
        <div className="h-4 bg-slate-800/60 rounded w-2/3" />
      </Card>
    );
  }

  // Default 'itinerary' skeleton view
  return (
    <div className={cn('space-y-8 animate-pulse', className)}>
      {/* Overview Skeleton */}
      <Card className="glass-panel border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-3 w-full sm:w-2/3">
            <div className="h-4 bg-slate-800/80 rounded-full w-24" />
            <div className="h-8 bg-slate-800 rounded-xl w-3/4" />
            <div className="h-4 bg-slate-800/60 rounded-lg w-1/2" />
          </div>
          <div className="h-14 bg-slate-900 border border-slate-800 rounded-2xl w-36 shrink-0" />
        </div>

        {/* 4 Stat Boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-900/60 border border-slate-800 rounded-xl" />
          ))}
        </div>
      </Card>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-slate-900 border border-slate-800 rounded-xl w-32 shrink-0" />
        ))}
      </div>

      {/* Timeline Skeleton */}
      <div className="space-y-4 pt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 items-start pl-4">
            <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
            <Card className="flex-1 p-5 space-y-3 border border-slate-800/80">
              <div className="h-5 bg-slate-800 rounded-lg w-1/3" />
              <div className="h-4 bg-slate-800/60 rounded w-full" />
              <div className="h-4 bg-slate-800/40 rounded w-4/5" />
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
