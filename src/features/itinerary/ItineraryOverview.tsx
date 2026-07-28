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
  Star
} from 'lucide-react';

interface ItineraryOverviewProps {
  trip: TripItinerary;
}

export const ItineraryOverview: React.FC<ItineraryOverviewProps> = ({ trip }) => {
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
    <Card className="glass-panel border-slate-700/60 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      <div className="absolute right-0 top-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Title Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-5">
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

      {/* Automatic Live Progress Tracker */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Trip Execution Progress
          </span>
          <span className="text-emerald-400">
            {completedActivities} of {totalActivities} completed ({completionPercentage}%)
          </span>
        </div>
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
