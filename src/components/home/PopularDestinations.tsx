import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, TrendingUp } from 'lucide-react';

const DESTINATIONS = [
  {
    city: 'Tokyo',
    country: 'Japan',
    tagline: 'Neon skylines meet ancient temple traditions',
    days: '5–7 Days',
    avgBudget: '$1,850',
    rating: '4.9',
    style: 'Balanced',
    emoji: '🗼',
    color: 'from-indigo-500/20 to-purple-500/10',
    border: 'border-indigo-500/20',
    tag: 'Most Popular',
    tagColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  },
  {
    city: 'Paris',
    country: 'France',
    tagline: 'Art, haute cuisine & timeless romance',
    days: '4–6 Days',
    avgBudget: '$2,100',
    rating: '4.8',
    style: 'Luxury',
    emoji: '🗺',
    color: 'from-rose-500/15 to-pink-500/10',
    border: 'border-rose-500/20',
    tag: 'Trending',
    tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    tagline: 'Rice terraces, beaches & spiritual wellness',
    days: '7–10 Days',
    avgBudget: '$1,200',
    rating: '4.9',
    style: 'Relaxation',
    emoji: '🌿',
    color: 'from-emerald-500/15 to-teal-500/10',
    border: 'border-emerald-500/20',
    tag: 'Best Value',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    city: 'Rome',
    country: 'Italy',
    tagline: 'Millennia of history, piazzas & trattorias',
    days: '3–5 Days',
    avgBudget: '$1,650',
    rating: '4.7',
    style: 'Culture',
    emoji: '🏛️',
    color: 'from-amber-500/15 to-orange-500/10',
    border: 'border-amber-500/20',
    tag: 'Classic',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
];

export const PopularDestinations: React.FC = () => {
  return (
    <section className="py-16 space-y-12">
      <div className="section-divider" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/8 text-xs font-semibold text-indigo-300">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Popular Destinations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Where will you{' '}
            <span className="gradient-text">go next?</span>
          </h2>
          <p className="text-slate-500 text-sm">
            Top global destinations with AI-ready itinerary plans.
          </p>
        </div>
        <Link to="/plan">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/4 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/8 hover:border-indigo-500/30 transition-all duration-200 cursor-pointer shrink-0">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {DESTINATIONS.map((dest, idx) => (
          <div
            key={idx}
            className={`relative glass-card card-shine glass-card-hover rounded-2xl p-5 flex flex-col justify-between space-y-4 border ${dest.border} group`}
          >
            {/* Top gradient overlay */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${dest.color} opacity-40 pointer-events-none`} />

            <div className="relative space-y-3">
              {/* Badge row */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${dest.tagColor}`}>
                  {dest.tag}
                </span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="text-xs font-bold">{dest.rating}</span>
                </div>
              </div>

              {/* Emoji & Title */}
              <div>
                <div className="text-3xl mb-2">{dest.emoji}</div>
                <h3 className="text-lg font-bold text-white">
                  {dest.city}
                  <span className="text-slate-500 font-normal text-sm ml-1">{dest.country}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{dest.tagline}</p>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{dest.days}</span>
                </div>
                <span className="text-emerald-400 font-semibold">{dest.avgBudget}</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              to={`/plan?destination=${encodeURIComponent(dest.city)}`}
              className="relative"
            >
              <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-xs font-semibold text-slate-300 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all duration-200 cursor-pointer group-hover:border-indigo-500/25">
                <span>Generate Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};
