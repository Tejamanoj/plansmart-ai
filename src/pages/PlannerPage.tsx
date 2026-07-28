import React from 'react';
import { PlannerForm } from '@/features/planner/PlannerForm';

export const PlannerPage: React.FC = () => {
  return (
    <div className="py-4 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-white">AI Trip Planner</h1>
        <p className="text-slate-400 text-sm">
          Customize your travel preferences to generate a personalized itinerary.
        </p>
      </div>

      <PlannerForm />
    </div>
  );
};
