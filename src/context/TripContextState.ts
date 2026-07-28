import { createContext } from 'react';
import type { TripItinerary, TripPlanRequest } from '@/types/trip';

export interface TripContextType {
  currentPlanRequest: TripPlanRequest | null;
  setCurrentPlanRequest: (request: TripPlanRequest | null) => void;
  savedTrips: TripItinerary[];
  saveTrip: (trip: TripItinerary) => void;
  removeSavedTrip: (tripId: string) => void;
}

export const TripContext = createContext<TripContextType | undefined>(undefined);
