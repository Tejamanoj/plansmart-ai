import React from 'react';
import type { TripItinerary } from '@/types/trip';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import {
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  CheckCircle2,
  Star,
  RotateCcw,
  CheckSquare
} from 'lucide-react';

interface ItineraryOverviewProps {
  trip: TripItinerary;
  onMarkAllComplete?: () => void;
  onResetProgress?: () => void;
}

export const ItineraryOverview: React.FC<ItineraryOverviewProps> = ({
  trip,
  onMarkAllComplete,
  onResetProgress,
}) => {
  let totalActivities = 0;
  let completedActivities = 0;
  let favoriteActivities = 0;
  let totalCost = 0;

  trip.days.forEach((day) => {
    day.activities.forEach((act) => {
      totalActivities += 1;
      if (act.isCompleted) completedActivities += 1;
      if (act.isFavorite) favoriteActivities += 1;
      totalCost += act.estimatedCost;
    });
  });

  const completionPercentage = totalActivities > 0
    ? Math.round((completedActivities / totalActivities) * 100)
    : 0;

  return (
    <Card className="glass-panel border-indigo-500/20 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Title Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-white/6 pb-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="purple" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Itinerary
            </Badge>
            {favoriteActivities > 0 && (
              <Badge variant="warning" className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" /> {favoriteActivities} Favorites
              </Badge>
            )}
            <span className="text-xs text-slate-500">Created {new Date(trip.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {trip.title}
          </h1>
          <p className="text-slate-400 text-sm flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-sky-400" /> {trip.destination}
          </p>
        </div>

        {/* Currency & Total Budget Tag */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col items-start shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Projected Cost</span>
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-0.5">
            {trip.totalBudget} {trip.currency}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Duration</span>
            <span className="text-sm font-bold text-slate-200">{trip.durationDays} Days</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Travel Style</span>
            <span className="text-sm font-bold text-slate-200 capitalize">{trip.travelStyle}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Activities</span>
            <span className="text-sm font-bold text-slate-200">{totalActivities} Events</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Expenses Sum</span>
            <span className="text-sm font-bold text-slate-200">{totalCost} {trip.currency}</span>
          </div>
        </div>
      </div>

      {/* Automatic Live Progress Tracker with Quick Action Buttons */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200">Trip Execution Progress:</span>
            <span className="text-emerald-400 font-bold">
              {completedActivities} of {totalActivities} completed ({completionPercentage}%)
            </span>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onMarkAllComplete && (
              <button
                type="button"
                onClick={onMarkAllComplete}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/25 transition-all flex items-center gap-1 cursor-pointer"
                title="Mark all activities in this itinerary as completed"
              >
                <CheckSquare className="w-3 h-3" />
                <span>Mark All Done</span>
              </button>
            )}

            {onResetProgress && completedActivities > 0 && (
              <button
                type="button"
                onClick={onResetProgress}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-[11px] font-semibold hover:text-white hover:bg-white/10 transition-all flex items-center gap-1 cursor-pointer"
                title="Reset completion progress back to 0%"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
