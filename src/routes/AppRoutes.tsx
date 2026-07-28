import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

/**
 * Code-split each page with React.lazy so only the current route's JS
 * is loaded on initial paint. Suspense fallback is a lightweight spinner.
 *
 * Performance impact:
 *  - HomePage  loads immediately (largest, most-visited)
 *  - PlannerPage, ItineraryPage, SavedTripsPage load on demand
 *  - NotFoundPage is tiny but lazy-loaded to keep the initial bundle small
 */
const HomePage       = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const PlannerPage    = lazy(() => import('@/pages/PlannerPage').then((m) => ({ default: m.PlannerPage })));
const ItineraryPage  = lazy(() => import('@/pages/ItineraryPage').then((m) => ({ default: m.ItineraryPage })));
const SavedTripsPage = lazy(() => import('@/pages/SavedTripsPage').then((m) => ({ default: m.SavedTripsPage })));
const NotFoundPage   = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

/** Minimal accessible loading indicator shown during Suspense boundary */
const PageLoader: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Loading page content"
    className="flex items-center justify-center min-h-[50vh]"
  >
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-sky-500/30 border-t-sky-400 animate-spin" />
      <p className="text-sm text-slate-400 animate-pulse">Loading…</p>
    </div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="plan" element={<PlannerPage />} />
          <Route path="itinerary/:id" element={<ItineraryPage />} />
          <Route path="saved" element={<SavedTripsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
