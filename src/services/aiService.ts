import type { TripPlanRequest, TripItinerary } from '@/types/trip';

/**
 * AI Service interface abstraction for AI-driven trip generation.
 * Ready for OpenAI / Gemini API integration in upcoming feature milestones.
 */
export const aiService = {
  async generateItinerary(_request: TripPlanRequest): Promise<TripItinerary> {
    // Architecture placeholder for future AI service integration.
    throw new Error('aiService.generateItinerary is scheduled for the AI integration milestone.');
  },
};
