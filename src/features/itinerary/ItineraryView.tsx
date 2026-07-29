import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useTripContext } from '@/context/useTripContext';
import { ItineraryOverview } from './ItineraryOverview';
import { DaySelector } from './DaySelector';
import { SortableActivityCard } from './SortableActivityCard';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Compass, Clock, AlertTriangle, GripVertical } from 'lucide-react';
import type { TripItinerary, DayItinerary, Activity } from '@/types/trip';

// High-fidelity fallback mock Tokyo itinerary for demonstration
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
          isCompleted: true,
          isFavorite: true,
          notes: 'Great morning photo spot! Very peaceful early.',
        },
        {
          id: 't2',
          title: 'Lunch at Asakusa Imahan',
          description: 'Legendary restaurant established in 1889, famous for its Sukiyaki and Shabu-shabu beef dishes.',
          timeSlot: '12:30 PM - 02:00 PM',
          location: 'Nishi-Asakusa, Taito City',
          estimatedCost: 45,
          category: 'food',
          isCompleted: true,
          isFavorite: false,
          notes: 'Reserve a table by 12:15 PM.',
        },
        {
          id: 't3',
          title: 'Sumida River Cruise',
          description: 'Relaxing water bus ride from Asakusa to Hama-rikyu Gardens, with views of Tokyo Skytree.',
          timeSlot: '02:30 PM - 04:00 PM',
          location: 'Sumida River Pier',
          estimatedCost: 15,
          category: 'sightseeing',
          isCompleted: false,
          isFavorite: false,
          notes: '',
        },
        {
          id: 't4',
          title: 'Teatime at Hama-rikyu Tea House',
          description: 'Traditional matcha green tea with wagashi sweets at a floating teahouse.',
          timeSlot: '04:15 PM - 05:30 PM',
          location: 'Hama-rikyu Gardens',
          estimatedCost: 10,
          category: 'relaxation',
          isCompleted: false,
          isFavorite: true,
          notes: '',
        },
      ],
    },
    {
      dayNumber: 2,
      title: 'Neon Shibuya & Harajuku Trends',
      activities: [
        {
          id: 't5',
          title: 'Meiji Jingu Shrine Sanctuary',
          description: 'A serene Shinto shrine inside a dense forest of 120,000 evergreen trees.',
          timeSlot: '09:00 AM - 10:45 AM',
          location: 'Yoyogikamizonocho, Shibuya',
          estimatedCost: 0,
          category: 'culture',
          isCompleted: false,
          isFavorite: false,
          notes: '',
        },
        {
          id: 't6',
          title: 'Stroll Takeshita Street & Crepes',
          description: 'Epicentre of Japanese youth culture and kawaii fashion.',
          timeSlot: '11:00 AM - 12:30 PM',
          location: 'Jingumae, Shibuya',
          estimatedCost: 8,
          category: 'food',
          isCompleted: false,
          isFavorite: false,
          notes: '',
        },
        {
          id: 't7',
          title: 'Shibuya Crossing & Shibuya Sky',
          description: 'Cross the world\'s busiest pedestrian intersection and visit the open-air observatory.',
          timeSlot: '01:30 PM - 03:30 PM',
          location: 'Shibuya Station Square',
          estimatedCost: 20,
          category: 'sightseeing',
          isCompleted: false,
          isFavorite: true,
          notes: '',
        },
        {
          id: 't8',
          title: 'Izakaya Dinner in Nonbei Yokocho',
          description: 'Yakitori skewers and draft beer in a lantern-lit alleyway.',
          timeSlot: '06:30 PM - 09:00 PM',
          location: 'Dogenzaka, Shibuya',
          estimatedCost: 35,
          category: 'nightlife',
          isCompleted: false,
          isFavorite: false,
          notes: '',
        },
      ],
    },
    {
      dayNumber: 3,
      title: 'Digital Art & Odaiba Waterfront',
      activities: [
        {
          id: 't9',
          title: 'teamLab Planets Exhibition',
          description: 'Immersive digital art museum — walk through water and glowing orchid installations.',
          timeSlot: '09:00 AM - 11:30 AM',
          location: 'Toyosu, Koto City',
          estimatedCost: 28,
          category: 'outdoor',
          isCompleted: false,
          isFavorite: true,
          notes: '',
        },
        {
          id: 't10',
          title: 'Odaiba Seaside Park walking',
          description: 'Stroll along the beach and view the Rainbow Bridge.',
          timeSlot: '01:00 PM - 03:00 PM',
          location: 'Daiba, Minato City',
          estimatedCost: 0,
          category: 'sightseeing',
          isCompleted: false,
          isFavorite: false,
          notes: '',
        },
        {
          id: 't11',
          title: 'Sushi Dinner at Toyosu Market',
          description: 'Ultra-fresh sushi from the world\'s largest seafood market.',
          timeSlot: '06:00 PM - 08:30 PM',
          location: 'Toyosu Market Pier',
          estimatedCost: 60,
          category: 'food',
          isCompleted: false,
          isFavorite: false,
          notes: '',
        },
      ],
    },
    {
      dayNumber: 4,
      title: 'Pop Culture Akihabara & Ueno Park',
      activities: [
        {
          id: 't12',
          title: 'Ueno Park & Toshogu Shrine',
          description: 'Park housing multiple national museums and a golden Edo-period shrine.',
          timeSlot: '09:30 AM - 12:00 PM',
          location: 'Uenokoen, Taito City',
          estimatedCost: 5,
          category: 'outdoor',
          isCompleted: false,
          isFavorite: false,
          notes: '',
        },
        {
          id: 't13',
          title: 'Ameyoko Market Street Shopping',
          description: 'Bustling open-air market selling clothing, spices, and street foods.',
          timeSlot: '12:15 PM - 01:45 PM',
          location: 'Ueno, Taito City',
          estimatedCost: 12,
          category: 'food',
          isCompleted: false,
          isFavorite: false,
          notes: '',
        },
        {
          id: 't14',
          title: 'Akihabara Electronic Town',
          description: 'Epicenter of anime merchandise, retro arcades, and multi-story electronics.',
          timeSlot: '02:15 PM - 05:30 PM',
          location: 'Sotokanda, Chiyoda City',
          estimatedCost: 15,
          category: 'culture',
          isCompleted: false,
          isFavorite: false,
          notes: '',
        },
      ],
    },
    {
      dayNumber: 5,
      title: 'Modern Ginza & Imperial Gardens',
      activities: [
        {
          id: 't15',
          title: 'Imperial Palace East Gardens',
          description: 'Historic ruins of Edo Castle surrounded by koi ponds and lawns.',
          timeSlot: '09:30 AM - 11:30 AM',
          location: 'Chiyoda, Chiyoda City',
          estimatedCost: 0,
          category: 'outdoor',
          isCompleted: false,
          isFavorite: false,
          notes: '',
        },
        {
          id: 't16',
          title: 'Ginza Shopping & Art Galleries',
          description: 'High-end boutiques, department stores, and modern art exhibitions.',
          timeSlot: '12:30 PM - 03:00 PM',
          location: 'Ginza, Chuo City',
          estimatedCost: 20,
          category: 'sightseeing',
          isCompleted: false,
          isFavorite: false,
          notes: '',
        },
        {
          id: 't17',
          title: 'Farewell Kaiseki Dinner Banquet',
          description: 'Traditional multi-course seasonal Japanese dining to conclude the expedition.',
          timeSlot: '06:30 PM - 09:30 PM',
          location: 'Ginza district, Tokyo',
          estimatedCost: 120,
          category: 'food',
          isCompleted: false,
          isFavorite: false,
          notes: '',
        },
      ],
    },
  ],
};

interface ItineraryViewProps {
  tripId?: string;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ tripId }) => {
  const { savedTrips, saveTrip } = useTripContext();
  const [activeDay, setActiveDay] = useState<number>(1);
  const [localTripOverride, setLocalTripOverride] = useState<TripItinerary | null>(null);

  // Clear local override whenever the route parameter tripId changes
  useEffect(() => {
    setLocalTripOverride(null);
    setActiveDay(1);
  }, [tripId]);

  // Retrieve matching trip from saved context or override
  const trip = useMemo(() => {
    if (localTripOverride && (!tripId || localTripOverride.id === tripId)) {
      return localTripOverride;
    }
    if (tripId) {
      const found = savedTrips.find((t) => t.id === tripId);
      if (found) return found;
      if (tripId === 'sample-tokyo-2026') return MOCK_TOKYO_ITINERARY;
    }
    // Fallback: Return most recent saved trip if available, otherwise sample Tokyo
    return savedTrips.length > 0 ? savedTrips[0] : MOCK_TOKYO_ITINERARY;
  }, [savedTrips, tripId, localTripOverride]);

  // Helper to update trip immutably and persist to localStorage
  const updateTripState = useCallback(
    (updater: (prev: TripItinerary) => TripItinerary) => {
      if (!trip) return;
      const updated = updater(trip);
      setLocalTripOverride(updated);
      saveTrip(updated);
    },
    [trip, saveTrip]
  );

  // ── dnd-kit sensors ────────────────────────────────────────────────
  // PointerSensor — activates drag on mouse/touch after 8px movement (prevents accidental drags on click)
  // KeyboardSensor — allows reordering with ↑ / ↓ / Space / Enter for full keyboard accessibility
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ── Handler: Drag End — reorders activities and persists ──────────
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      updateTripState((prevTrip) => ({
        ...prevTrip,
        days: prevTrip.days.map((day) => {
          if (day.dayNumber !== activeDay) return day;

          const oldIndex = day.activities.findIndex((act) => act.id === active.id);
          const newIndex = day.activities.findIndex((act) => act.id === over.id);

          if (oldIndex === -1 || newIndex === -1) return day;

          return {
            ...day,
            activities: arrayMove(day.activities, oldIndex, newIndex),
          };
        }),
      }));
    },
    [activeDay, updateTripState]
  );

  // Handler: Toggle completion state
  const handleToggleComplete = useCallback(
    (dayNumber: number, activityId: string) => {
      updateTripState((prevTrip) => ({
        ...prevTrip,
        days: prevTrip.days.map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          return {
            ...day,
            activities: day.activities.map((act) =>
              act.id === activityId ? { ...act, isCompleted: !act.isCompleted } : act
            ),
          };
        }),
      }));
    },
    [updateTripState]
  );

  // Handler: Toggle favorite state
  const handleToggleFavorite = useCallback(
    (dayNumber: number, activityId: string) => {
      updateTripState((prevTrip) => ({
        ...prevTrip,
        days: prevTrip.days.map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          return {
            ...day,
            activities: day.activities.map((act) =>
              act.id === activityId ? { ...act, isFavorite: !act.isFavorite } : act
            ),
          };
        }),
      }));
    },
    [updateTripState]
  );

  // Handler: Mark all activities completed
  const handleMarkAllComplete = useCallback(() => {
    updateTripState((prevTrip) => ({
      ...prevTrip,
      days: prevTrip.days.map((day) => ({
        ...day,
        activities: day.activities.map((act) => ({ ...act, isCompleted: true })),
      })),
    }));
  }, [updateTripState]);

  // Handler: Reset completion progress back to 0
  const handleResetProgress = useCallback(() => {
    updateTripState((prevTrip) => ({
      ...prevTrip,
      days: prevTrip.days.map((day) => ({
        ...day,
        activities: day.activities.map((act) => ({ ...act, isCompleted: false })),
      })),
    }));
  }, [updateTripState]);

  // Handler: Delete activity
  const handleDeleteActivity = useCallback(
    (dayNumber: number, activityId: string) => {
      updateTripState((prevTrip) => ({
        ...prevTrip,
        days: prevTrip.days.map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          return {
            ...day,
            activities: day.activities.filter((act) => act.id !== activityId),
          };
        }),
      }));
    },
    [updateTripState]
  );

  // Handler: Save personal notes
  const handleSaveNotes = useCallback(
    (dayNumber: number, activityId: string, notes: string) => {
      updateTripState((prevTrip) => ({
        ...prevTrip,
        days: prevTrip.days.map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          return {
            ...day,
            activities: day.activities.map((act) =>
              act.id === activityId ? { ...act, notes } : act
            ),
          };
        }),
      }));
    },
    [updateTripState]
  );

  // Extract day titles for DaySelector tabs
  const dayThemes = useMemo(() => {
    const themes: Record<number, string> = {};
    if (trip) {
      trip.days.forEach((day: DayItinerary) => {
        themes[day.dayNumber] = day.title || `Day ${day.dayNumber}`;
      });
    }
    return themes;
  }, [trip]);

  // Current active day data
  const activeDayData = useMemo(() => {
    if (!trip) return null;
    return trip.days.find((day: DayItinerary) => day.dayNumber === activeDay) || null;
  }, [trip, activeDay]);

  // Stable ID list for SortableContext
  const activityIds = useMemo(
    () => activeDayData?.activities.map((a) => a.id) ?? [],
    [activeDayData]
  );

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
      {/* Itinerary Summary Overview with live progress calculation */}
      <ItineraryOverview
        trip={trip}
        onMarkAllComplete={handleMarkAllComplete}
        onResetProgress={handleResetProgress}
      />

      {/* Day Selector Tabs */}
      <div className="space-y-6">
        <div className="border-b border-slate-800 pb-2">
          <DaySelector
            totalDays={trip.durationDays}
            activeDay={activeDay}
            onSelectDay={setActiveDay}
            dayThemes={dayThemes}
          />
        </div>

        {/* Day Theme Banner */}
        {activeDayData && (
          <Card className="bg-slate-900/40 border border-slate-800/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">Today's Focus</span>
              <h3 className="text-lg font-bold text-white">
                {activeDayData.title.startsWith(`Day ${activeDayData.dayNumber}`)
                  ? activeDayData.title
                  : `Day ${activeDayData.dayNumber}: ${activeDayData.title}`}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>{activeDayData.activities.length} planned items</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 border-l border-slate-800 pl-3">
                <GripVertical className="w-3.5 h-3.5" />
                <span>Drag to reorder</span>
              </div>
            </div>
          </Card>
        )}

        {/* Drag & Drop Context — Sortable Activities Timeline */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          accessibility={{
            announcements: {
              onDragStart({ active }) {
                return `Picked up activity: ${active.id}. Use arrow keys to move, Space to drop.`;
              },
              onDragOver({ active, over }) {
                if (over) return `Activity ${active.id} is over position ${over.id}.`;
                return `Activity ${active.id} is no longer over a drop target.`;
              },
              onDragEnd({ active, over }) {
                if (over) return `Activity ${active.id} was dropped over ${over.id}.`;
                return `Activity ${active.id} was dropped.`;
              },
              onDragCancel({ active }) {
                return `Drag cancelled. Activity ${active.id} returned to original position.`;
              },
            },
          }}
        >
          <SortableContext items={activityIds} strategy={verticalListSortingStrategy}>
            <div className="relative space-y-6 pt-2 pl-2">
              {activeDayData && activeDayData.activities.length > 0 ? (
                activeDayData.activities.map((activity: Activity, idx: number) => (
                  <SortableActivityCard
                    key={activity.id || idx}
                    activity={activity}
                    dayNumber={activeDay}
                    onToggleComplete={handleToggleComplete}
                    onToggleFavorite={handleToggleFavorite}
                    onDeleteActivity={handleDeleteActivity}
                    onSaveNotes={handleSaveNotes}
                  />
                ))
              ) : (
                <Card className="text-center py-10">
                  <Compass className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-spin" />
                  <h4 className="text-sm font-bold text-slate-300">No activities on Day {activeDay}</h4>
                  <p className="text-xs text-slate-500 mt-1">This day is open for spontaneous sightseeing.</p>
                </Card>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Navigation Actions */}
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
