import React from 'react';
import { Card } from '@/components/common/Card';
import { Sparkles, DollarSign, Calendar, Compass, Map, Shield } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Instant AI Itineraries',
      description: 'Generates day-by-day itineraries custom-built around your interests and destination goals.',
      color: 'sky',
      badge: 'Core Engine',
    },
    {
      icon: DollarSign,
      title: 'Smart Budget Optimizer',
      description: 'Calculates activity, dining, and stay expense estimates to keep your journey within budget.',
      color: 'emerald',
      badge: 'Financial Intelligence',
    },
    {
      icon: Calendar,
      title: 'Day-by-Day Timeline',
      description: 'Organizes sightseeing, food spots, and hidden gems in logical time slots with realistic pacing.',
      color: 'indigo',
      badge: 'Time Management',
    },
    {
      icon: Compass,
      title: 'Custom Travel Styles',
      description: 'Tailor plans to Budget, Luxury, Family, or Adventure styles at the click of a button.',
      color: 'purple',
      badge: 'Personalization',
    },
    {
      icon: Map,
      title: 'Smart Route Pacing',
      description: 'Minimizes transit time by grouping nearby activities and attractions together.',
      color: 'amber',
      badge: 'Route Optimization',
    },
    {
      icon: Shield,
      title: 'Offline & Saved Access',
      description: 'Bookmark itineraries in local storage for quick access anywhere on your trip.',
      color: 'rose',
      badge: 'Data Security',
    },
  ];

  return (
    <section className="py-16 space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Engineered for <span className="gradient-text">Seamless Travel Planning</span>
        </h2>
        <p className="text-slate-400 text-base">
          Discover intelligent capabilities designed to remove friction from your vacation planning.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <Card
              key={idx}
              className="glass-card glass-card-hover p-6 flex flex-col justify-between space-y-4 border border-slate-800"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
