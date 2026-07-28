import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Sparkles, Compass, MapPin, Calendar, Clock, DollarSign, ArrowRight, Play } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-6 pb-16 overflow-hidden">
      {/* Background Glowing Ambient Orbs */}
      <div className="gradient-glow top-0 left-1/4 w-96 h-96 bg-sky-500/20 pointer-events-none" />
      <div className="gradient-glow bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Text Content & CTAs */}
        <div className="lg:col-span-7 space-y-8 text-left">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 text-xs font-semibold backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>AI-Powered Travel Intelligence • Milestone 2 Layout</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Plan Your Next Adventure with <span className="gradient-text">Smart AI Precision</span>
          </h1>

          {/* Subheadline */}
          <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-2xl">
            Transform your destination dreams into complete, personalized travel itineraries tailored to your budget, timeline, and travel style in seconds.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/plan">
              <Button variant="glow" size="lg" className="shadow-2xl">
                <Sparkles className="w-5 h-5" />
                <span>Start Planning Free</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link to="/itinerary/sample-tokyo-2026">
              <Button variant="secondary" size="lg">
                <Play className="w-4 h-4 fill-slate-300 text-slate-300" />
                <span>Explore Sample Plan</span>
              </Button>
            </Link>
          </div>

          {/* Key Metrics / Counter Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">10K+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Smart Trips Generated</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">99.4%</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Satisfaction Score</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">50+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Global Destinations</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Animated Mock Preview Card */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-600 opacity-20 blur-xl animate-pulse-glow" />

          <Card className="relative glass-panel rounded-3xl p-6 sm:p-7 space-y-5 animate-float border-slate-700/60 shadow-2xl">
            {/* Header of Mock Card */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Tokyo 5-Day Expedition</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" /> 5 Days • Balanced Style
                  </p>
                </div>
              </div>
              <Badge variant="purple">AI Generated</Badge>
            </div>

            {/* Budget Pill */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Total Estimated Budget
              </span>
              <span className="text-sm font-bold text-emerald-400">$1,850 USD</span>
            </div>

            {/* Timeline Activity Slots */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Day 1 Schedule Highlights</div>
              
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                <Clock className="w-4 h-4 text-sky-400 mt-1 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-200">09:00 AM • Senso-ji Temple & Asakusa</div>
                  <div className="text-[11px] text-slate-400">Explore historic shrines & cultural street markets</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                <Clock className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-200">01:00 PM • Shibuya Crossing & Ramen Alley</div>
                  <div className="text-[11px] text-slate-400">Famous crossing view & authentic Michelin ramen</div>
                </div>
              </div>
            </div>

            {/* Footer Badge of Mock Card */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-sky-400" /> Optimized for walking routes
              </span>
              <span className="text-sky-400 font-semibold">99.8% Match</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
