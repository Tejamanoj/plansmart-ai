import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Compass, Sparkles } from 'lucide-react';
import { NAV_LINKS, APP_CONFIG } from '@/utils/constants';
import { cn } from '@/utils/cn';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              {APP_CONFIG.appName}
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Sparkles className="w-2.5 h-2.5 mr-0.5" /> AI
              </span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-slate-800 text-sky-400 shadow-sm border border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
