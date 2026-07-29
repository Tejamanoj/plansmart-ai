import React from 'react';
import { PlannerForm } from '@/features/planner/PlannerForm';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PlannerPage: React.FC = () => {
  return (
    <div className="py-6 space-y-10">
      {/* Back Nav */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 text-xs font-semibold text-indigo-300">
          <Sparkles className="w-3.5 h-3.5" />
          AI Trip Generation Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Plan Your <span className="gradient-text">Perfect Trip</span>
        </h1>
        <p className="text-slate-500 text-base leading-relaxed">
          Describe your ideal vacation and let our AI craft a personalized, day-by-day itinerary with detailed budget estimates.
        </p>
      </div>

      {/* Planner Form */}
      <PlannerForm />
    </div>
  );
};
