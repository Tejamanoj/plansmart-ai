import { useState } from 'react';
import type { TripPlanRequest } from '@/types/trip';

export const useTripPlanner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setLoading(false);
    setError(null);
  };

  const validateRequest = (request: Partial<TripPlanRequest>): boolean => {
    if (!request.destination?.trim()) {
      setError('Destination is required');
      return false;
    }
    if (!request.durationDays || request.durationDays <= 0) {
      setError('Trip duration must be at least 1 day');
      return false;
    }
    return true;
  };

  return {
    loading,
    error,
    setError,
    resetState,
    validateRequest,
  };
};
