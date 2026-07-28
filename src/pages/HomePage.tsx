import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Sparkles, Compass, MapPin, Zap, ShieldCheck } from 'lucide-react';
import { APP_CONFIG } from '@/utils/constants';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Itinerary Generation
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Plan Your Next Journey with <span className="gradient-text">{APP_CONFIG.appName}</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Create personalized travel itineraries tailored to your budget, style, and timeframe in seconds. Scalable, AI-native trip planning experience.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/plan">
            <Button size="lg" className="shadow-lg shadow-sky-500/25">
              <Sparkles className="w-5 h-5" /> Start Planning Now
            </Button>
          </Link>
          <Link to="/saved">
            <Button size="lg" variant="secondary">
              <Compass className="w-5 h-5 text-slate-300" /> View Saved Trips
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="space-y-3 hover:border-slate-700/80 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Instant AI Generation</h3>
          <p className="text-sm text-slate-400">
            Generate complete day-by-day itineraries tailored to your unique preferences instantly.
          </p>
        </Card>

        <Card className="space-y-3 hover:border-slate-700/80 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Smart Destination Discovery</h3>
          <p className="text-sm text-slate-400">
            Discover hidden spots, curated dining options, and optimized travel routes.
          </p>
        </Card>

        <Card className="space-y-3 hover:border-slate-700/80 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Budget & Style Control</h3>
          <p className="text-sm text-slate-400">
            Keep full control over expenses with real-time budget estimates and travel styles.
          </p>
        </Card>
      </section>
    </div>
  );
};
