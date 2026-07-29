import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

const PERKS = [
  'No signup required — start instantly',
  'AI-generated in under 10 seconds',
  'Budget-smart & personalized to you',
];

export const CtaBanner: React.FC = () => {
  return (
    <section className="py-16">
      <div className="section-divider mb-16" />

      <div className="relative rounded-3xl overflow-hidden border border-indigo-500/20 p-[1px]">
        {/* Gradient border glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/30 via-purple-500/15 to-transparent pointer-events-none" />

        {/* Content container */}
        <div className="relative glass-card rounded-3xl px-8 py-14 sm:px-16 sm:py-16 text-center overflow-hidden">
          {/* Background orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(99,102,241,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.6) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free Forever · No Credit Card</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Your next adventure{' '}
              <br />
              <span className="gradient-text">starts right here</span>
            </h2>

            {/* Sub */}
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Join thousands of travelers who use PlanSmart AI to build
              effortless, personalized travel plans — in seconds.
            </p>

            {/* Perks */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {PERKS.map((perk) => (
                <div key={perk} className="flex items-center gap-1.5 text-sm text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link to="/plan">
                <button className="btn-primary flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white cursor-pointer shadow-xl shadow-indigo-500/25">
                  <Sparkles className="w-5 h-5" />
                  <span>Create My Travel Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/itinerary/sample-tokyo-2026">
                <button className="flex items-center gap-2 px-6 py-4 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/8 hover:border-white/20 transition-all duration-200 cursor-pointer">
                  View Demo Plan
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
