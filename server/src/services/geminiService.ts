import { GoogleGenerativeAI } from '@google/generative-ai';

// Interface representing the required structure for the generated trip
export interface GeneratedItinerary {
  id: string;
  title: string;
  destination: string;
  durationDays: number;
  travelStyle: string;
  totalBudget: number;
  currency: string;
  createdAt: string;
  days: {
    dayNumber: number;
    title: string;
    activities: {
      id: string;
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
 * Fallback static mock trip generator when Gemini API is unavailable or returns invalid format.
 */
function getMockItinerary(promptText: string): GeneratedItinerary {
  let destination = 'Tokyo, Japan';
  if (promptText.toLowerCase().includes('paris')) {
    destination = 'Paris, France';
  } else if (promptText.toLowerCase().includes('bali')) {
    destination = 'Bali, Indonesia';
  } else if (promptText.toLowerCase().includes('swiss alps') || promptText.toLowerCase().includes('switzerland')) {
    destination = 'Swiss Alps, Switzerland';
  } else if (promptText.toLowerCase().includes('london')) {
    destination = 'London, United Kingdom';
  } else if (promptText.toLowerCase().includes('new york') || promptText.toLowerCase().includes('nyc')) {
    destination = 'New York City, USA';
  } else if (promptText.toLowerCase().includes('dubai')) {
    destination = 'Dubai, UAE';
  }

  const tripId = crypto.randomUUID ? crypto.randomUUID() : `trip-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  return {
    id: tripId,
    title: `Smart AI Trip to ${destination}`,
    destination,
    durationDays: 3,
    travelStyle: 'balanced',
    totalBudget: 1500,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Iconic Landmarks Exploration',
        activities: [
          {
            id: `${tripId}-act-1-1`,
            title: 'Welcome Walking Tour',
            description: 'Get acclimated with a local walking guide showing top historic neighborhoods.',
            timeSlot: '09:30 AM - 12:00 PM',
            location: 'City Center Hub',
            estimatedCost: 25,
            category: 'culture',
          },
          {
            id: `${tripId}-act-1-2`,
            title: 'Authentic Local Lunch Feast',
            description: 'Savor traditional dishes at a top-rated local dining alley.',
            timeSlot: '12:30 PM - 02:00 PM',
            location: 'Food Street Alley',
            estimatedCost: 30,
            category: 'food',
          },
          {
            id: `${tripId}-act-1-3`,
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
            id: `${tripId}-act-2-1`,
            title: 'Morning Museum Expedition',
            description: 'Explore world-renowned exhibitions and local historical artifacts.',
            timeSlot: '09:00 AM - 12:00 PM',
            location: 'National Arts Museum',
            estimatedCost: 20,
            category: 'culture',
          },
          {
            id: `${tripId}-act-2-2`,
            title: 'Scenic Waterfront Stroll & Coffee',
            description: 'Relax at a cozy café overlooking the beautiful river banks or shoreline.',
            timeSlot: '02:00 PM - 04:30 PM',
            location: 'Waterfront Boulevard',
            estimatedCost: 12,
            category: 'relaxation',
          },
          {
            id: `${tripId}-act-2-3`,
            title: 'Night Market & Street Food Tour',
            description: 'Explore the vibrant night market with street food vendors and local crafts.',
            timeSlot: '06:30 PM - 09:00 PM',
            location: 'Night Market District',
            estimatedCost: 20,
            category: 'food',
          },
        ]
      },
      {
        dayNumber: 3,
        title: 'Nature Escape & Panoramic Sunset',
        activities: [
          {
            id: `${tripId}-act-3-1`,
            title: 'Outdoor Garden & Nature Walk',
            description: 'Breathe fresh air in the sprawling botanical gardens or nature reserves.',
            timeSlot: '10:00 AM - 01:00 PM',
            location: 'Royal Botanical Reserve',
            estimatedCost: 10,
            category: 'outdoor',
          },
          {
            id: `${tripId}-act-3-2`,
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

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.warn('⚠️ GEMINI_API_KEY environment variable is missing or set to placeholder. Falling back to high-quality mock JSON.');
      return getMockItinerary(promptText);
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const tripId = crypto.randomUUID ? crypto.randomUUID() : `trip-${Date.now()}`;

      const instruction = `
You are a premium AI trip planning assistant. Generate a highly detailed, realistic trip itinerary in JSON format based on the user's travel request.
The output MUST strictly match the following JSON schema (all fields required):
{
  "title": "string (e.g. Kyoto 5-Day Cultural Expedition)",
  "destination": "string (e.g. Kyoto, Japan)",
  "durationDays": "number (number of days in the trip — must match the number of day objects)",
  "travelStyle": "string — one of: budget | balanced | luxury | adventure | family",
  "totalBudget": "number (estimated total cost as a plain number, no currency symbols)",
  "currency": "string (e.g. USD, EUR, INR, GBP)",
  "days": [
    {
      "dayNumber": "number (starting from 1)",
      "title": "string (the theme of the day)",
      "activities": [
        {
          "title": "string (name of the activity)",
          "description": "string (2-3 sentence description)",
          "timeSlot": "string (e.g. 09:00 AM - 11:30 AM)",
          "location": "string (specific location or neighbourhood)",
          "estimatedCost": "number (cost in the trip's currency, plain number)",
          "category": "one of exactly: sightseeing | food | outdoor | culture | relaxation | nightlife"
        }
      ]
    }
  ]
}

Rules:
- Include 3-5 activities per day.
- All estimated costs must be realistic numbers (no strings, no currency signs).
- Ensure the number of day objects matches durationDays exactly.
- Do not return any text before or after the JSON payload. No markdown code fences.
`;

      const result = await model.generateContent([
        { text: instruction },
        { text: `User request: ${promptText}` },
      ]);

      const textResponse = result.response.text();
      if (!textResponse) {
        throw new Error('Empty response received from Gemini API');
      }

      // Robust Markdown codeblock stripping in case Gemini wraps response in ```json ... ```
      const cleanedText = textResponse.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

      try {
        const parsedItinerary = JSON.parse(cleanedText);
        
        // Basic schema validation check
        if (!parsedItinerary || typeof parsedItinerary !== 'object' || !Array.isArray(parsedItinerary.days)) {
          throw new Error('Malformed JSON structure: missing days array');
        }

        // Inject id + createdAt (not in Gemini output) and activity ids
        const enriched: GeneratedItinerary = {
          ...parsedItinerary,
          id: tripId,
          createdAt: new Date().toISOString(),
          days: parsedItinerary.days.map((day: { dayNumber: number; title: string; activities: object[] }, dIdx: number) => ({
            ...day,
            activities: day.activities.map((act: object, aIdx: number) => ({
              ...act,
              id: `${tripId}-act-${dIdx + 1}-${aIdx + 1}`,
            })),
          })),
        };

        return enriched;
      } catch (jsonErr) {
        console.warn('⚠️ Gemini returned non-parsable or malformed JSON. Using mock fallback.', jsonErr);
        return getMockItinerary(promptText);
      }
    } catch (error) {
      console.error('❌ Failed to generate itinerary via Gemini API. Falling back to high-quality mock data:', error);
      return getMockItinerary(promptText);
    }
  },
};
