import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { PlannerPage } from '@/pages/PlannerPage';
import { ItineraryPage } from '@/pages/ItineraryPage';
import { SavedTripsPage } from '@/pages/SavedTripsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="plan" element={<PlannerPage />} />
        <Route path="itinerary/:id" element={<ItineraryPage />} />
        <Route path="saved" element={<SavedTripsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
