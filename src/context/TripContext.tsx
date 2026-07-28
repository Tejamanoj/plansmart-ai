import React, { useState, type ReactNode } from 'react';
import type { TripItinerary, TripPlanRequest } from '@/types/trip';
import { TripContext } from './TripContextState';

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPlanRequest, setCurrentPlanRequest] = useState<TripPlanRequest | null>(null);
  const [savedTrips, setSavedTrips] = useState<TripItinerary[]>([]);

  const saveTrip = (trip: TripItinerary) => {
    setSavedTrips((prev) => [...prev.filter((t) => t.id !== trip.id), trip]);
  };

  const removeSavedTrip = (tripId: string) => {
    setSavedTrips((prev) => prev.filter((t) => t.id !== tripId));
  };

  return (
    <TripContext.Provider
      value={{
        currentPlanRequest,
        setCurrentPlanRequest,
        savedTrips,
        saveTrip,
        removeSavedTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};
