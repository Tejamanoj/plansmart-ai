import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useTripContext } from '@/context/useTripContext';
import {
  Bookmark,
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Trash2,
  ArrowRight,
  Sparkles,
  Clock,
} from 'lucide-react';

/**
 * SavedTripsList — Reads and displays all saved itineraries from TripContext (localStorage).
 * Allows viewing and deleting saved trips.
 */
export const SavedTripsList: React.FC = () => {
  const { savedTrips, removeSavedTrip } = useTripContext();

  const handleDelete = (tripId: string, tripTitle: string) => {
    if (window.confirm(`Delete "${tripTitle}"? This cannot be undone.`)) {
      removeSavedTrip(tripId);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Bookmark className="w-7 h-7 text-sky-400" aria-hidden="true" />
            Saved Itineraries
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Your AI-generated trip plans, stored locally on this device.
          </p>
        </div>
        <Badge variant="info" className="self-start sm:self-auto">
          {savedTrips.length} {savedTrips.length === 1 ? 'Trip' : 'Trips'} Saved
        </Badge>
      </div>

      {/* Empty State */}
      {savedTrips.length === 0 && (
        <Card className="text-center py-16 space-y-5">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Compass className="w-8 h-8 animate-float" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">No Saved Trips Yet</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Generate a trip plan and it will automatically appear here for future access.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/plan">
              <Button variant="glow" size="md">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Plan Your First Trip</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Trip Cards Grid */}
      {savedTrips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedTrips.map((trip) => {
            const totalActivities = trip.days.reduce((sum, day) => sum + day.activities.length, 0);
            const completedActivities = trip.days.reduce(
              (sum, day) => sum + day.activities.filter((a) => a.isCompleted).length,
              0
            );
            const completionPct = totalActivities > 0
              ? Math.round((completedActivities / totalActivities) * 100)
              : 0;

            return (
              <Card
                key={trip.id}
                className="glass-card-hover border border-slate-800 flex flex-col gap-4 p-5 group"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                      {trip.title}
                    </h2>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" aria-hidden="true" />
                      <span className="truncate">{trip.destination}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(trip.id, trip.title)}
                    aria-label={`Delete ${trip.title}`}
                    title="Delete trip"
                    className="shrink-0 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-500/40 transition-all duration-200 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" aria-hidden="true" /> Days
                    </span>
                    <span className="font-bold text-slate-200">{trip.durationDays}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-500 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" aria-hidden="true" /> Budget
                    </span>
                    <span className="font-bold text-emerald-400">{trip.totalBudget}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden="true" /> Style
                    </span>
                    <span className="font-bold text-slate-200 capitalize truncate">{trip.travelStyle}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{completedActivities}/{totalActivities} activities done</span>
                    <span className="text-emerald-400 font-semibold">{completionPct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full transition-all duration-500"
                      style={{ width: `${completionPct}%` }}
                      aria-valuenow={completionPct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      role="progressbar"
                      aria-label={`${completionPct}% activities completed`}
                    />
                  </div>
                </div>

                {/* Created date */}
                <p className="text-[10px] text-slate-600">
                  Saved {new Date(trip.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>

                {/* View Button */}
                <Link to={`/itinerary/${trip.id}`} className="mt-auto block">
                  <Button variant="secondary" size="sm" className="w-full">
                    <span>View Itinerary</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      )}

      {/* Plan Another Trip CTA */}
      {savedTrips.length > 0 && (
        <div className="flex justify-center pt-4">
          <Link to="/plan">
            <Button variant="glow" size="md">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Plan Another Trip</span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
