import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Bookmark, Compass } from 'lucide-react';

/**
 * SavedTripsList Feature Component Placeholder
 * Modular feature component for rendering saved/bookmarked trip cards from LocalStorage/API.
 */
export const SavedTripsList: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-sky-400" /> Saved Trips
          </h1>
          <p className="text-slate-400 text-sm">Access and manage your saved AI itineraries.</p>
        </div>
        <Badge variant="info">0 Saved</Badge>
      </div>

      <Card className="text-center py-12 space-y-3">
        <div className="mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
          <Compass className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-medium text-slate-200">No Saved Trips Yet</h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Your bookmarked itineraries will be displayed here once you generate and save trip plans.
        </p>
      </Card>
    </div>
  );
};
