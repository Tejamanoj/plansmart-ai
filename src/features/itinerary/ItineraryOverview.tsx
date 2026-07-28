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
  Sparkles
} from 'lucide-react';

interface ItineraryOverviewProps {
  trip: TripItinerary;
}

export const ItineraryOverview: React.FC<ItineraryOverviewProps> = ({ trip }) => {
  const totalActivities = trip.days.reduce((sum, day) => sum + day.activities.length, 0);

  // Calculate actual summed cost of all activities to compare with totalBudget
  const totalCost = trip.days.reduce(
    (sum, day) => sum + day.activities.reduce((dSum, act) => dSum + act.estimatedCost, 0),
    0
  );

  return (
    <Card className="glass-panel border-slate-700/60 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background decoration orbs */}
      <div className="absolute right-0 top-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Title Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="purple" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Itinerary
            </Badge>
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

      {/* Expense Allocation Warning / Success Summary */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Budget Utilization Status</span>
          <span className={totalCost <= trip.totalBudget ? 'text-emerald-400' : 'text-rose-400'}>
            {totalCost} / {trip.totalBudget} {trip.currency} ({Math.round((totalCost / trip.totalBudget) * 100)}%)
          </span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              totalCost <= trip.totalBudget ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min((totalCost / trip.totalBudget) * 100, 100)}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
