import type { TripItinerary, DayItinerary, Activity, ActivityCategory, TravelStyle } from '@/types/trip';

const VALID_CATEGORIES: ActivityCategory[] = [
  'sightseeing',
  'food',
  'outdoor',
  'culture',
  'relaxation',
  'nightlife',
];

/**
 * Sanitizes and repairs raw or malformed itinerary payloads from the API.
 * Ensures default fallback values for any missing array or field to guarantee zero frontend crashes.
 */
export function sanitizeItinerary(raw: Partial<TripItinerary>): TripItinerary {
  const destination = typeof raw.destination === 'string' && raw.destination.trim()
    ? raw.destination.trim()
    : 'Unknown Destination';

  const title = typeof raw.title === 'string' && raw.title.trim()
    ? raw.title.trim()
    : `Trip to ${destination}`;

  const durationDays = typeof raw.durationDays === 'number' && raw.durationDays > 0
    ? raw.durationDays
    : (Array.isArray(raw.days) && raw.days.length > 0 ? raw.days.length : 3);

  const travelStyle = typeof raw.travelStyle === 'string' && raw.travelStyle.trim()
    ? raw.travelStyle
    : 'balanced';

  const totalBudget = typeof raw.totalBudget === 'number' && raw.totalBudget >= 0
    ? raw.totalBudget
    : 1500;

  const currency = typeof raw.currency === 'string' && raw.currency.trim()
    ? raw.currency.trim()
    : 'USD';

  // Sanitize days array safely
  const rawDays = Array.isArray(raw.days) ? raw.days : [];
  const days: DayItinerary[] = rawDays.map((d: Partial<DayItinerary>, dayIdx: number) => {
    const dayNumber = typeof d?.dayNumber === 'number' ? d.dayNumber : dayIdx + 1;
    const dayTitle = typeof d?.title === 'string' && d.title.trim() ? d.title.trim() : `Day ${dayNumber}`;

    // Sanitize activities array safely inside each day
    const rawActivities = Array.isArray(d?.activities) ? d.activities : [];
    const activities: Activity[] = rawActivities.map((a: Partial<Activity>, actIdx: number) => {
      const category: ActivityCategory = (typeof a?.category === 'string' && VALID_CATEGORIES.includes(a.category as ActivityCategory))
        ? (a.category as ActivityCategory)
        : 'sightseeing';

      return {
        id: typeof a?.id === 'string' ? a.id : `act-${dayNumber}-${actIdx + 1}`,
        title: typeof a?.title === 'string' && a.title.trim() ? a.title.trim() : `Activity #${actIdx + 1}`,
        description: typeof a?.description === 'string' ? a.description.trim() : 'Explore local landmarks and points of interest.',
        timeSlot: typeof a?.timeSlot === 'string' && a.timeSlot.trim() ? a.timeSlot.trim() : '09:00 AM - 11:30 AM',
        location: typeof a?.location === 'string' ? a.location.trim() : destination,
        estimatedCost: typeof a?.estimatedCost === 'number' && a.estimatedCost >= 0 ? a.estimatedCost : 0,
        category,
      };
    });

    return {
      dayNumber,
      title: dayTitle,
      activities,
    };
  });

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9)),
    title,
    destination,
    durationDays,
    travelStyle: travelStyle as TravelStyle,
    totalBudget,
    currency,
    days: days.length > 0 ? days : [
      {
        dayNumber: 1,
        title: 'Arrival & City Orientation',
        activities: [
          {
            id: 'act-1-1',
            title: 'Welcome Walking Tour',
            description: 'Get acclimated with a local walking guide showing top historic neighborhoods.',
            timeSlot: '09:30 AM - 12:00 PM',
            location: destination,
            estimatedCost: 20,
            category: 'culture',
          }
        ]
      }
    ],
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
  };
}
