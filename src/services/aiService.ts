import { ApiClient } from './api/client';
import type { TripItinerary } from '@/types/trip';

/**
 * AI Service layer orchestrating trip generation endpoints.
 */
export const aiService = {
  async generateItinerary(prompt: string): Promise<TripItinerary> {
    const data = await ApiClient.post<Omit<TripItinerary, 'id' | 'createdAt'>, { prompt: string }>(
      '/generate-trip',
      { prompt }
    );
    
    // Enrich with client-side unique identifiers and generation timestamp
    return {
      ...data,
      id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    } as TripItinerary;
  },
};
