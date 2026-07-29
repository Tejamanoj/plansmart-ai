import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export const MainLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col text-slate-100 font-sans relative" style={{ background: 'var(--bg-base)' }}>
      {/* Layered ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[10%] w-[700px] h-[700px] rounded-full bg-indigo-600/8 blur-[140px]" />
        <div className="absolute top-[30%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/6 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[600px] h-[600px] rounded-full bg-sky-500/5 blur-[130px]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <Navbar />
      <main
        id="main-content"
        key={location.pathname}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10"
        tabIndex={-1}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
