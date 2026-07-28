import { GoogleGenerativeAI } from '@google/generative-ai';

// Interface representing the required structure for the generated trip
export interface GeneratedItinerary {
  title: string;
  destination: string;
  durationDays: number;
  travelStyle: string;
  totalBudget: number;
  currency: string;
  days: {
    dayNumber: number;
    title: string;
    activities: {
      title: string;
      description: string;
      timeSlot: string;
      location: string;
      estimatedCost: number;
      category: 'sightseeing' | 'food' | 'outdoor' | 'culture' | 'relaxation' | 'nightlife';
    }[];
  }[];
}

/**
 * Fallback static mock trip generator when Gemini API is unavailable.
 */
function getMockItinerary(promptText: string): GeneratedItinerary {
  // Simple heuristics to parse destination from prompt if possible
  let destination = 'Tokyo, Japan';
  if (promptText.toLowerCase().includes('paris')) {
    destination = 'Paris, France';
  } else if (promptText.toLowerCase().includes('bali')) {
    destination = 'Bali, Indonesia';
  } else if (promptText.toLowerCase().includes('swiss alps') || promptText.toLowerCase().includes('switzerland')) {
    destination = 'Swiss Alps, Switzerland';
  }

  return {
    title: `Smart AI Trip to ${destination}`,
    destination,
    durationDays: 3,
    travelStyle: 'balanced',
    totalBudget: 1500,
    currency: 'USD',
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Iconic Landmarks Exploration',
        activities: [
          {
            title: 'Welcome Walking Tour',
            description: 'Get acclimated with a local walking guide showing top historic neighborhoods.',
            timeSlot: '09:30 AM - 12:00 PM',
            location: 'City Center Hub',
            estimatedCost: 25,
            category: 'culture',
          },
          {
            title: 'Authentic Local Lunch Feast',
            description: 'Savor traditional dishes at a top-rated local dining alley.',
            timeSlot: '12:30 PM - 02:00 PM',
            location: 'Food Street Alley',
            estimatedCost: 30,
            category: 'food',
          },
          {
            title: 'Main Landmark & Architecture Sightseeing',
            description: 'Visit the city\'s most iconic structure and capture memorable photos.',
            timeSlot: '02:30 PM - 05:30 PM',
            location: 'Grand Heritage Plaza',
            estimatedCost: 15,
            category: 'sightseeing',
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Art, Cafés & Leisure Day',
        activities: [
          {
            title: 'Morning Museum Expedition',
            description: 'Explore world-renowned exhibitions and local historical artifacts.',
            timeSlot: '09:00 AM - 12:00 PM',
            location: 'National Arts Museum',
            estimatedCost: 20,
            category: 'culture',
          },
          {
            title: 'Scenic Waterfront Stroll & Coffee',
            description: 'Relax at a cozy café overlooking the beautiful river banks or shoreline.',
            timeSlot: '02:00 PM - 04:30 PM',
            location: 'Waterfront Boulevard',
            estimatedCost: 12,
            category: 'relaxation',
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'Nature Escape & Panoramic Sunset',
        activities: [
          {
            title: 'Outdoor Garden & Nature Walk',
            description: 'Breathe fresh air in the sprawling botanical gardens or nature reserves.',
            timeSlot: '10:00 AM - 01:00 PM',
            location: 'Royal Botanical Reserve',
            estimatedCost: 10,
            category: 'outdoor',
          },
          {
            title: 'Panoramic Skyline Viewing & Dinner',
            description: 'Conclude the journey with panoramic city views and a celebratory dinner.',
            timeSlot: '05:30 PM - 08:30 PM',
            location: 'Summit Observatory Deck',
            estimatedCost: 65,
            category: 'nightlife',
          }
        ]
      }
    ]
  };
}

export const geminiService = {
  async generateTrip(promptText: string): Promise<GeneratedItinerary> {
    const apiKey = process.env.GEMINI_API_KEY;

    // Graceful fallback to Mock JSON if Gemini API key is missing or set to default placeholder
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.warn('⚠️ GEMINI_API_KEY environment variable is missing or set to placeholder. Falling back to high-quality mock JSON.');
      return getMockItinerary(promptText);
    }

    try {
      // Initialize Google Generative AI SDK
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const instruction = `
You are a premium AI trip planning assistant. Generate a highly detailed, realistic trip itinerary in JSON format based on the user's travel request.
The output MUST strictly match the following JSON schema:
{
  "title": "string (e.g. Kyoto 5-Day Cultural Expedition)",
  "destination": "string (e.g. Kyoto, Japan)",
  "durationDays": "number (number of days in the trip)",
  "travelStyle": "string (e.g. budget, luxury, balanced, adventure)",
  "totalBudget": "number (estimated total cost)",
  "currency": "string (e.g. USD, EUR, INR)",
  "days": [
    {
      "dayNumber": "number (starting from 1)",
      "title": "string (the theme of the day)",
      "activities": [
        {
          "title": "string",
          "description": "string",
          "timeSlot": "string (e.g. 09:00 AM - 11:30 AM)",
          "location": "string",
          "estimatedCost": "number",
          "category": "one of: 'sightseeing' | 'food' | 'outdoor' | 'culture' | 'relaxation' | 'nightlife'"
        }
      ]
    }
  ]
}

Ensure all fields are fully populated and the estimated cost is realistic. Do not return any text before or after the JSON payload.
`;

      const result = await model.generateContent([
        { text: instruction },
        { text: `User request: ${promptText}` },
      ]);

      const textResponse = result.response.text();
      if (!textResponse) {
        throw new Error('Empty response received from Gemini API');
      }

      // Parse JSON response safely
      const parsedItinerary: GeneratedItinerary = JSON.parse(textResponse);
      return parsedItinerary;
    } catch (error) {
      console.error('❌ Failed to generate itinerary via Gemini API. Falling back to high-quality mock data:', error);
      return getMockItinerary(promptText);
    }
  },
};
