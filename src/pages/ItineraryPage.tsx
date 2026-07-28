import React from 'react';
import { useParams } from 'react-router-dom';
import { ItineraryView } from '@/features/itinerary/ItineraryView';

export const ItineraryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="py-4">
      <ItineraryView tripId={id} />
    </div>
  );
};
