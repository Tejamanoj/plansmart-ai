import type { TripItinerary } from '@/types/trip';
import { APP_CONFIG } from '@/utils/constants';

export const tripService = {
  getSavedTrips(): TripItinerary[] {
    try {
      const data = localStorage.getItem(APP_CONFIG.storageKeys.savedTrips);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTrip(trip: TripItinerary): void {
    const existing = this.getSavedTrips();
    const updated = [...existing.filter((t) => t.id !== trip.id), trip];
    localStorage.setItem(APP_CONFIG.storageKeys.savedTrips, JSON.stringify(updated));
  },

  deleteTrip(tripId: string): void {
    const existing = this.getSavedTrips();
    const updated = existing.filter((t) => t.id !== tripId);
    localStorage.setItem(APP_CONFIG.storageKeys.savedTrips, JSON.stringify(updated));
  },
};
