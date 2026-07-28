import { ApiClient } from './api/client';
import type { TripItinerary } from '@/types/trip';
import { sanitizeItinerary } from '@/utils/sanitizeItinerary';

/**
 * AI Service layer orchestrating trip generation endpoints with defensive sanitization.
 */
export const aiService = {
  async generateItinerary(prompt: string): Promise<TripItinerary> {
    const rawData = await ApiClient.post<Partial<TripItinerary>, { prompt: string }>(
      '/generate-trip',
      { prompt }
    );
    
    // Defensive sanitization: Ensures all arrays and properties are safe and valid
    return sanitizeItinerary(rawData);
  },
};
