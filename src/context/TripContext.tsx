import React, { useState, type ReactNode } from 'react';
import type { TripItinerary, TripPlanRequest } from '@/types/trip';
import { tripService } from '@/services/tripService';
import { TripContext } from './TripContextState';

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPlanRequest, setCurrentPlanRequest] = useState<TripPlanRequest | null>(null);
  
  // Use lazy state initialization to read from localStorage securely on mount
  const [savedTrips, setSavedTrips] = useState<TripItinerary[]>(() => tripService.getSavedTrips());

  const saveTrip = (trip: TripItinerary) => {
    tripService.saveTrip(trip);
    setSavedTrips(tripService.getSavedTrips());
  };

  const removeSavedTrip = (tripId: string) => {
    tripService.deleteTrip(tripId);
    setSavedTrips(tripService.getSavedTrips());
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
