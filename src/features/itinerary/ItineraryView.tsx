import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTripContext } from '@/context/useTripContext';
import { ItineraryOverview } from './ItineraryOverview';
import { DaySelector } from './DaySelector';
import { ActivityCard } from './ActivityCard';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Compass, Clock, AlertTriangle } from 'lucide-react';
import type { TripItinerary, DayItinerary, Activity } from '@/types/trip';

// High-fidelity fallback mock Tokyo itinerary for demonstration and /itinerary/sample-tokyo-2026 URL
const MOCK_TOKYO_ITINERARY: TripItinerary = {
  id: 'sample-tokyo-2026',
  title: 'Tokyo Cultural & Future Expedition',
  destination: 'Tokyo, Japan',
  durationDays: 5,
  travelStyle: 'balanced',
  totalBudget: 2200,
  currency: 'USD',
  createdAt: new Date().toISOString(),
  days: [
    {
      dayNumber: 1,
      title: 'Arrival & Historic Asakusa',
      activities: [
        {
          id: 't1',
          title: 'Explore Senso-ji Temple',
          description: 'Tokyo\'s oldest and most iconic Buddhist temple. Stroll through Nakamise-dori shopping street for snacks and crafts.',
          timeSlot: '09:30 AM - 12:00 PM',
          location: 'Asakusa, Taito City',
          estimatedCost: 0,
          category: 'culture',
        },
        {
          id: 't2',
          title: 'Lunch at Asakusa Imahan',
          description: 'Legendary restaurant established in 1889, famous for its melt-in-the-mouth Sukiyaki and Shabu-shabu beef dishes.',
          timeSlot: '12:30 PM - 02:00 PM',
          location: 'Nishi-Asakusa, Taito City',
          estimatedCost: 45,
          category: 'food',
        },
        {
          id: 't3',
          title: 'Sumida River Cruise',
          description: 'Relaxing water bus ride from Asakusa to Hama-rikyu Gardens, offering unique views of Tokyo Skytree and bridges.',
          timeSlot: '02:30 PM - 04:00 PM',
          location: 'Sumida River Pier',
          estimatedCost: 15,
          category: 'sightseeing',
        },
        {
          id: 't4',
          title: 'Teatime at Hama-rikyu Tea House',
          description: 'Drink traditional matcha green tea with wagashi sweets at a floating teahouse in a historical Edo-period garden.',
          timeSlot: '04:15 PM - 05:30 PM',
          location: 'Hama-rikyu Gardens',
          estimatedCost: 10,
          category: 'relaxation',
        }
      ]
    },
    {
      dayNumber: 2,
      title: 'Neon Shibuya & Harajuku Trends',
      activities: [
        {
          id: 't5',
          title: 'Meiji Jingu Shrine Sanctuary',
          description: 'A serene Shinto shrine dedicated to Emperor Meiji, nestled inside a dense forest of 120,000 evergreen trees.',
          timeSlot: '09:00 AM - 10:45 AM',
          location: 'Yoyogikamizonocho, Shibuya',
          estimatedCost: 0,
          category: 'culture',
        },
        {
          id: 't6',
          title: 'Stroll Takeshita Street & Crepes',
          description: 'Walk through the epicentre of Japanese youth culture and kawaii fashion. Try a famous warm crepe packed with fresh fruit and cream.',
          timeSlot: '11:00 AM - 12:30 PM',
          location: 'Jingumae, Shibuya',
          estimatedCost: 8,
          category: 'food',
        },
        {
          id: 't7',
          title: 'Shibuya Crossing & Shibuya Sky',
          description: 'Cross the world\'s busiest pedestrian intersection. Head up to the open-air observatory deck for panoramic 360-degree views.',
          timeSlot: '01:30 PM - 03:30 PM',
          location: 'Shibuya Station Square',
          estimatedCost: 20,
          category: 'sightseeing',
        },
        {
          id: 't8',
          title: 'Izakaya Dinner in Nonbei Yokocho',
          description: 'Enjoy yakitori skewers and draft beer in a tiny, atmospheric lantern-lit alleyway that captures old Tokyo charms.',
          timeSlot: '06:30 PM - 09:00 PM',
          location: 'Dogenzaka, Shibuya',
          estimatedCost: 35,
          category: 'nightlife',
        }
      ]
    },
    {
      dayNumber: 3,
      title: 'Digital Art & Odaiba Waterfront',
      activities: [
        {
          id: 't9',
          title: 'teamLab Planets Exhibition',
          description: 'Immersive digital art museum where you walk through water and interact with glowing floating orchid installations.',
          timeSlot: '09:00 AM - 11:30 AM',
          location: 'Toyosu, Koto City',
          estimatedCost: 28,
          category: 'outdoor',
        },
        {
          id: 't10',
          title: 'Odaiba Seaside Park walking',
          description: 'Stroll along the beach, see the miniature Statue of Liberty copy, and view the Rainbow Bridge crossing the bay.',
          timeSlot: '01:00 PM - 03:00 PM',
          location: 'Daiba, Minato City',
          estimatedCost: 0,
          category: 'sightseeing',
        },
        {
          id: 't11',
          title: 'Sushi Dinner at Toyosu Market',
          description: 'Enjoy ultra-fresh sushi served direct from the world\'s largest seafood market auctions.',
          timeSlot: '06:00 PM - 08:30 PM',
          location: 'Toyosu Market Pier',
          estimatedCost: 60,
          category: 'food',
        }
      ]
    },
    {
      dayNumber: 4,
      title: 'Pop Culture Akihabara & Ueno Park',
      activities: [
        {
          id: 't12',
          title: 'Ueno Park & Toshogu Shrine',
          description: 'Sprawling park housing multiple national museums and a golden Edo-period shrine that survived WWII bombings.',
          timeSlot: '09:30 AM - 12:00 PM',
          location: 'Uenokoen, Taito City',
          estimatedCost: 5,
          category: 'outdoor',
        },
        {
          id: 't13',
          title: 'Ameyoko Market Street Shopping',
          description: 'Bustling open-air market street selling clothing, spices, street foods, and duty-free cosmetic goods.',
          timeSlot: '12:15 PM - 01:45 PM',
          location: 'Ueno, Taito City',
          estimatedCost: 12,
          category: 'food',
        },
        {
          id: 't14',
          title: 'Akihabara Electronic Town',
          description: 'Vibrant epicenter of anime merchandise, retro arcade centers, and multi-story electric department stores.',
          timeSlot: '02:15 PM - 05:30 PM',
          location: 'Sotokanda, Chiyoda City',
          estimatedCost: 15,
          category: 'culture',
        }
      ]
    },
    {
      dayNumber: 5,
      title: 'Modern Ginza & Imperial Gardens',
      activities: [
        {
          id: 't15',
          title: 'Imperial Palace East Gardens',
          description: 'Visit the historic ruins of Edo Castle\'s defense walls, surrounded by clean Japanese koi ponds and lawns.',
          timeSlot: '09:30 AM - 11:30 AM',
          location: 'Chiyoda, Chiyoda City',
          estimatedCost: 0,
          category: 'outdoor',
        },
        {
          id: 't16',
          title: 'Ginza Shopping & Art Galleries',
          description: 'Explore high-end design boutiques, multi-story department stores (Ginza Six), and modern art exhibition showrooms.',
          timeSlot: '12:30 PM - 03:00 PM',
          location: 'Ginza, Chuo City',
          estimatedCost: 20,
          category: 'sightseeing',
        },
        {
          id: 't17',
          title: 'Farewell Kaiseki Dinner Banquet',
          description: 'Traditional multi-course seasonal Japanese dining experience to conclude the expedition.',
          timeSlot: '06:30 PM - 09:30 PM',
          location: 'Ginza district, Tokyo',
          estimatedCost: 120,
          category: 'food',
        }
      ]
    }
  ]
};

interface ItineraryViewProps {
  tripId?: string;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ tripId }) => {
  const { savedTrips } = useTripContext();
  const [activeDay, setActiveDay] = useState<number>(1);

  // Retrieve matching trip from saved context, with high-fidelity Tokyo mock fallback
  const trip = useMemo(() => {
    if (tripId === 'sample-tokyo-2026') {
      return MOCK_TOKYO_ITINERARY;
    }
    return savedTrips.find((t) => t.id === tripId) || null;
  }, [savedTrips, tripId]);

  // Extract day titles to pass as themes to the DaySelector tabs
  const dayThemes = useMemo(() => {
    const themes: Record<number, string> = {};
    if (trip) {
      trip.days.forEach((day: DayItinerary) => {
        themes[day.dayNumber] = day.title || `Day ${day.dayNumber}`;
      });
    }
    return themes;
  }, [trip]);

  // Retrieve current active day activities
  const activeDayData = useMemo(() => {
    if (!trip) return null;
    return trip.days.find((day: DayItinerary) => day.dayNumber === activeDay) || null;
  }, [trip, activeDay]);

  if (!trip) {
    return (
      <Card className="text-center py-12 max-w-xl mx-auto space-y-6">
        <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white">Itinerary Not Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            The trip plan you are looking for might have been deleted, or does not exist in local storage.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/plan">
            <Button size="md">Create Trip Plan</Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="md">Go Home</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Itinerary Summary Overview */}
      <ItineraryOverview trip={trip} />

      {/* Day Selector Tabs and Timeline Section */}
      <div className="space-y-6">
        <div className="border-b border-slate-800 pb-2">
          <DaySelector
            totalDays={trip.durationDays}
            activeDay={activeDay}
            onSelectDay={setActiveDay}
            dayThemes={dayThemes}
          />
        </div>

        {/* Selected Day Theme Banner */}
        {activeDayData && (
          <Card className="bg-slate-900/40 border border-slate-800/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">Today's Focus</span>
              <h3 className="text-lg font-bold text-white">
                Day {activeDayData.dayNumber}: {activeDayData.title}
              </h3>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>{activeDayData.activities.length} planned items</span>
            </div>
          </Card>
        )}

        {/* Timeline Activities List */}
        <div className="relative space-y-6 pt-2">
          {activeDayData && activeDayData.activities.length > 0 ? (
            activeDayData.activities.map((activity: Activity, idx: number) => (
              <ActivityCard
                key={activity.id || idx}
                activity={activity}
              />
            ))
          ) : (
            <Card className="text-center py-10">
              <Compass className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-spin" />
              <h4 className="text-sm font-bold text-slate-300">No scheduled activities today</h4>
              <p className="text-xs text-slate-500 mt-1">This day is open for spontaneous sightseeing.</p>
            </Card>
          )}
        </div>
      </div>

      {/* Interactive Navigation Actions */}
      <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-800/80 pt-6">
        <Link to="/plan">
          <Button variant="glow" size="md">
            <span>Plan Another Trip</span>
          </Button>
        </Link>
        <Link to="/saved">
          <Button variant="secondary" size="md">
            <span>View Saved Gallery</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
