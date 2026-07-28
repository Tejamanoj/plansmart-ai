export type TravelStyle = 'budget' | 'balanced' | 'luxury' | 'adventure' | 'family';

export type ActivityCategory = 'sightseeing' | 'food' | 'outdoor' | 'culture' | 'relaxation' | 'nightlife';

export interface Activity {
  id: string;
  title: string;
  description: string;
  timeSlot: string; // e.g. "09:00 AM - 11:30 AM"
  location: string;
  estimatedCost: number;
  category: ActivityCategory;
}

export interface DayItinerary {
  dayNumber: number;
  date?: string;
  title: string;
  activities: Activity[];
}

export interface TripPlanRequest {
  destination: string;
  durationDays: number;
  travelStyle: TravelStyle;
  budgetTotal: number;
  currency: string;
  interests: string[];
}

export interface TripItinerary {
  id: string;
  title: string;
  destination: string;
  startDate?: string;
  durationDays: number;
  travelStyle: TravelStyle;
  totalBudget: number;
  currency: string;
  days: DayItinerary[];
  createdAt: string;
}
