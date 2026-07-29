import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, Compass } from 'lucide-react';
import { NAV_LINKS, APP_CONFIG } from '@/utils/constants';
import { cn } from '@/utils/cn';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      role="banner"
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'glass-panel border-b border-indigo-500/15 shadow-lg shadow-indigo-950/50'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* Brand */}
          <Link to="/" aria-label="PlanSmart AI – Go to homepage" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow duration-300">
                <Compass className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#050810] animate-pulse" />
            </div>
            <div>
              <span className="text-[17px] font-bold tracking-tight text-white">
                {APP_CONFIG.appName}
              </span>
              <div className="flex items-center gap-1 mt-[-2px]">
                <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                <span className="text-[10px] font-semibold text-indigo-400 tracking-wider uppercase">
                  AI Travel Engine
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute inset-0 rounded-lg bg-indigo-500/15 border border-indigo-500/25" />
                    )}
                    <span className="relative">{link.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Action */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/plan">
              <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer">
                <Sparkles className="w-4 h-4" />
                <span>Start Planning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center"
            >
              {mobileMenuOpen
                ? <X className="w-5 h-5" aria-hidden="true" />
                : <Menu className="w-5 h-5" aria-hidden="true" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="md:hidden border-t border-white/5 bg-[#080d1e]/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-4 animate-fade-in-up">
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/plan" onClick={() => setMobileMenuOpen(false)}>
            <button className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer">
              <Sparkles className="w-4 h-4" />
              <span>Start Planning Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      )}
    </header>
  );
};
