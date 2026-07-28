import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Heart } from 'lucide-react';
import { APP_CONFIG } from '@/utils/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 pt-16 pb-12 mt-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="gradient-glow top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1">
                {APP_CONFIG.appName}
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI-powered trip planning engine that creates personalized, budget-friendly travel itineraries in seconds.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-sky-400 transition-colors">Home Page</Link></li>
              <li><Link to="/plan" className="hover:text-sky-400 transition-colors">Plan New Trip</Link></li>
              <li><Link to="/saved" className="hover:text-sky-400 transition-colors">Saved Itineraries</Link></li>
            </ul>
          </div>

          {/* Tech Stack Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Tech Architecture</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>React 19 + TypeScript</li>
              <li>Vite 8 Build System</li>
              <li>Tailwind CSS v4</li>
              <li>React Router v7</li>
            </ul>
          </div>

          {/* Internship Assignment Info Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Assignment Project</h4>
            <p className="text-sm text-slate-400">
              Built for Frontend AI Internship Assignment Milestone 2 (Application Layout & UI System).
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <span>Layout Milestone Complete</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Divider */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {APP_CONFIG.appName}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for AI Trip Planning
          </p>
        </div>
      </div>
    </footer>
  );
};
