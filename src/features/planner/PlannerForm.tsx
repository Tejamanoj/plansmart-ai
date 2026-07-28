import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Sparkles, MapPin, Calendar, DollarSign } from 'lucide-react';

/**
 * PlannerForm Feature Component Placeholder
 * Modular feature component for collecting destination, budget, duration, and preferences.
 */
export const PlannerForm: React.FC = () => {
  return (
    <Card className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-400" />
          <h2 className="text-xl font-bold text-white">Create New Trip Plan</h2>
        </div>
        <Badge variant="purple">Architecture Ready</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center py-8">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center">
          <MapPin className="w-6 h-6 text-sky-400 mb-2" />
          <span className="text-sm font-medium text-slate-300">Destination</span>
          <span className="text-xs text-slate-500 mt-1">Smart Autocomplete</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center">
          <Calendar className="w-6 h-6 text-indigo-400 mb-2" />
          <span className="text-sm font-medium text-slate-300">Duration</span>
          <span className="text-xs text-slate-500 mt-1">Days & Timeline</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center">
          <DollarSign className="w-6 h-6 text-emerald-400 mb-2" />
          <span className="text-sm font-medium text-slate-300">Budget & Style</span>
          <span className="text-xs text-slate-500 mt-1">Custom Constraints</span>
        </div>
      </div>

      <p className="text-xs text-center text-slate-400 italic">
        Feature module scaffolded. Interactive form controls & AI generation logic scheduled for feature milestone.
      </p>
    </Card>
  );
};
