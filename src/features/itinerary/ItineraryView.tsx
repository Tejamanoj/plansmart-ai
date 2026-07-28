import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Map, Clock, CheckCircle2 } from 'lucide-react';

interface ItineraryViewProps {
  tripId?: string;
}

/**
 * ItineraryView Feature Component Placeholder
 * Modular feature component for displaying day-by-day itineraries, interactive maps, and activities.
 */
export const ItineraryView: React.FC<ItineraryViewProps> = ({ tripId }) => {
  return (
    <div className="space-y-6">
      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="info">Itinerary View</Badge>
            {tripId && <span className="text-xs text-slate-500">ID: {tripId}</span>}
          </div>
          <h1 className="text-2xl font-extrabold text-white">Scaffolded Itinerary Module</h1>
          <p className="text-slate-400 text-sm">Modular Day-by-Day view structure ready for AI response rendering.</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-semibold text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" /> Day 1 Timeline Overview
            </span>
            <Badge variant="success">Sample Module</Badge>
          </div>
          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div key={item} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Activity Slot #{item}</h4>
                  <p className="text-xs text-slate-400">Time slot & activity detail placeholder.</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center min-h-[220px] text-center">
          <Map className="w-10 h-10 text-indigo-400 mb-3" />
          <h3 className="text-base font-semibold text-slate-200">Map & Route View</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Interactive map integration component container.
          </p>
        </Card>
      </div>
    </div>
  );
};
