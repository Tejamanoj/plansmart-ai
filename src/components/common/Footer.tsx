import React from 'react';
import { Compass } from 'lucide-react';
import { APP_CONFIG } from '@/utils/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Compass className="w-4 h-4 text-sky-400" />
          <span>© {new Date().getFullYear()} {APP_CONFIG.appName}. All rights reserved.</span>
        </div>
        <div className="text-xs text-slate-500">
          Frontend AI Internship Assignment Foundation • Milestone 1
        </div>
      </div>
    </footer>
  );
};
