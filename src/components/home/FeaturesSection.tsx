import React from 'react';
import { Sparkles, DollarSign, Calendar, Compass, Map, Shield, Zap, Globe } from 'lucide-react';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Instant AI Itineraries',
    description: 'Generate complete day-by-day travel plans with activities, timings, and recommendations in under 10 seconds.',
    gradient: 'from-indigo-500 to-purple-600',
    glow: 'indigo',
  },
  {
    icon: DollarSign,
    title: 'Smart Budget Planner',
    description: 'Real-time cost estimation for accommodation, food, transport, and experiences — keeping you in budget.',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'emerald',
  },
  {
    icon: Calendar,
    title: 'Day-by-Day Timeline',
    description: 'Activities organized into logical time slots with realistic pacing, morning to evening.',
    gradient: 'from-sky-500 to-blue-600',
    glow: 'sky',
  },
  {
    icon: Compass,
    title: 'Custom Travel Styles',
    description: 'Choose from Budget, Balanced, Luxury, Adventure, or Family modes — fully tailored to your preference.',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'violet',
  },
  {
    icon: Map,
    title: 'Route Optimization',
    description: 'Smart grouping of nearby attractions reduces transit time and maximizes your time at each destination.',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'amber',
  },
  {
    icon: Shield,
    title: 'Saved Offline Access',
    description: 'Itineraries persist locally so you can access your plans without internet during your trip.',
    gradient: 'from-rose-500 to-pink-600',
    glow: 'rose',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 space-y-14">
      {/* Divider */}
      <div className="section-divider" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/8 text-xs font-semibold text-indigo-300">
          <Zap className="w-3.5 h-3.5" />
          <span>Platform Features</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Everything you need to{' '}
          <span className="gradient-text">plan perfectly</span>
        </h2>
        <p className="text-slate-500 text-base leading-relaxed">
          Intelligent travel planning powered by cutting-edge AI — from inspiration to a complete itinerary.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="glass-card card-shine glass-card-hover rounded-2xl p-6 flex flex-col space-y-4 group"
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-5 h-5 text-white" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        {[
          { value: '10K+', label: 'Trips Planned', icon: Globe },
          { value: '<10s', label: 'Generation Time', icon: Zap },
          { value: '50+', label: 'Destinations', icon: Map },
          { value: '99.4%', label: 'User Satisfaction', icon: Sparkles },
        ].map(({ value, label, icon: Icon }) => (
          <div key={label} className="glass-card rounded-2xl p-5 text-center border border-white/5 hover:border-indigo-500/20 transition-colors">
            <Icon className="w-4 h-4 text-indigo-400 mx-auto mb-2" />
            <div className="text-2xl font-extrabold text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
