import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Compass, Sparkles, Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import { NAV_LINKS, APP_CONFIG } from '@/utils/constants';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';
import { useThemeContext } from '@/context/ThemeContext';

/**
 * Navbar — sticky top navigation.
 *
 * Accessibility features:
 *  - role="banner" landmark
 *  - aria-label on all icon-only buttons
 *  - aria-expanded on mobile drawer toggle
 *  - aria-current="page" on active NavLinks (handled by React Router isActive)
 *  - keyboard-focusable all controls
 */
export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <header role="banner" className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" aria-label="PlanSmart AI – Go to homepage" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-6 h-6 animate-pulse-glow" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                {APP_CONFIG.appName}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Sparkles className="w-2.5 h-2.5 mr-1 text-sky-400" aria-hidden="true" /> AI v1.0
                </span>
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:block">{APP_CONFIG.tagline}</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                    isActive
                      ? 'bg-slate-800/80 text-sky-400 shadow-sm border border-slate-700/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {isDark
                ? <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
                : <Moon className="w-4 h-4 text-sky-400" aria-hidden="true" />
              }
            </button>

            <Link to="/plan">
              <Button variant="glow" size="md">
                <span>Start Planning Free</span>
                <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
              </Button>
            </Link>
          </div>

          {/* Mobile: Theme + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {isDark
                ? <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" />
                : <Moon className="w-5 h-5 text-sky-400" aria-hidden="true" />
              }
            </button>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {mobileMenuOpen
                ? <X className="w-6 h-6" aria-hidden="true" />
                : <Menu className="w-6 h-6" aria-hidden="true" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden glass-panel border-t border-slate-800/80 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                    isActive
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="pt-2">
            <Link to="/plan" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="glow" size="lg" className="w-full">
                <span>Start Planning Free</span>
                <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
