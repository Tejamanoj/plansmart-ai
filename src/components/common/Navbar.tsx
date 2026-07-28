import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Compass, Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { NAV_LINKS, APP_CONFIG } from '@/utils/constants';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-6 h-6 animate-pulse-glow" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                {APP_CONFIG.appName}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Sparkles className="w-2.5 h-2.5 mr-1 text-sky-400" /> AI v0.1
                </span>
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:block">
                {APP_CONFIG.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
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

          {/* Action Call-to-Action Placeholder Button (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/plan">
              <Button variant="glow" size="md">
                <span>Start Planning Free</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-800/80 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-3 rounded-xl text-base font-medium transition-all duration-200',
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
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
