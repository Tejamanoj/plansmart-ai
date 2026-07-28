import React from 'react';
import { PlannerForm } from '@/features/planner/PlannerForm';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export const PlannerPage: React.FC = () => {
  return (
    <div className="py-6 space-y-8">
      {/* Back Navigation */}
      <div>
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
      </div>

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> AI Trip Generation Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Plan Your <span className="gradient-text">Perfect Trip</span>
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Describe your ideal vacation below and let our AI craft a personalized day-by-day itinerary with budget estimates.
        </p>
      </div>

      {/* Trip Planning Form */}
      <PlannerForm />
    </div>
  );
};
