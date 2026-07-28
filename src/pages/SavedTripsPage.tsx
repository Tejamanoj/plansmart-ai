import React from 'react';
import { SavedTripsList } from '@/features/saved-trips/SavedTripsList';

export const SavedTripsPage: React.FC = () => {
  return (
    <div className="py-4">
      <SavedTripsList />
    </div>
  );
};
