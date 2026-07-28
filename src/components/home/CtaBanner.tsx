import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

export const CtaBanner: React.FC = () => {
  return (
    <section className="py-12">
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-700/60 p-8 sm:p-12 text-center space-y-6">
        {/* Glow backdrop */}
        <div className="gradient-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/25 pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Start Exploring Without Boundaries
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready to Build Your <span className="gradient-text">Smart Itinerary?</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            Join thousands of travelers using AI to craft effortless, personalized vacation schedules.
          </p>

          <div className="pt-4 flex justify-center">
            <Link to="/plan">
              <Button variant="glow" size="lg" className="px-8">
                <Sparkles className="w-5 h-5" />
                <span>Create Your Plan Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
