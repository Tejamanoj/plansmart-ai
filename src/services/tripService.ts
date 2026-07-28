import type { TripItinerary } from '@/types/trip';
import { APP_CONFIG } from '@/utils/constants';

/**
 * tripService — localStorage persistence layer for saved itineraries.
 *
 * Design decisions:
 *  - All methods are wrapped in try/catch so storage errors (QuotaExceededError,
 *    SecurityError in private browsing, JSON parse failures) never crash the app.
 *  - getSavedTrips() validates each entry has at minimum an `id` before returning,
 *    silently dropping corrupt data rather than propagating it downstream.
 *  - saveTrip() trims to the MAX_SAVED_TRIPS limit (most recent first) to prevent
 *    unbounded localStorage growth.
 *  - Separate storageAvailable() check lets the UI warn users in restricted envs.
 */

const MAX_SAVED_TRIPS = 20;

function isValidTrip(obj: unknown): obj is TripItinerary {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as TripItinerary).id === 'string' &&
    typeof (obj as TripItinerary).title === 'string'
  );
}

export const tripService = {
  /** Check if localStorage is writable (fails in private/incognito on some browsers) */
  storageAvailable(): boolean {
    try {
      const key = '__plansmart_test__';
      localStorage.setItem(key, '1');
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  getSavedTrips(): TripItinerary[] {
    try {
      const data = localStorage.getItem(APP_CONFIG.storageKeys.savedTrips);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      // Filter out any corrupt/partial entries
      return parsed.filter(isValidTrip);
    } catch {
      return [];
    }
  },

  saveTrip(trip: TripItinerary): void {
    try {
      const existing = this.getSavedTrips();
      // Replace if same ID, otherwise prepend (newest first)
      const without = existing.filter((t) => t.id !== trip.id);
      const updated = [trip, ...without].slice(0, MAX_SAVED_TRIPS);
      localStorage.setItem(APP_CONFIG.storageKeys.savedTrips, JSON.stringify(updated));
    } catch (err) {
      if (err instanceof DOMException && err.name === 'QuotaExceededError') {
        // localStorage full — silently drop; UI still works, data just won't persist
        console.warn('[PlanSmart] localStorage quota exceeded. New trip not persisted.');
      }
      // All other errors suppressed to avoid crashing the UI
    }
  },

  deleteTrip(tripId: string): void {
    try {
      const existing = this.getSavedTrips();
      const updated = existing.filter((t) => t.id !== tripId);
      localStorage.setItem(APP_CONFIG.storageKeys.savedTrips, JSON.stringify(updated));
    } catch {
      // Fail silently — worst case the trip remains in the list until refresh
    }
  },

  clearAll(): void {
    try {
      localStorage.removeItem(APP_CONFIG.storageKeys.savedTrips);
    } catch {
      // Ignore
    }
  },
};
