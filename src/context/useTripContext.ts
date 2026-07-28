import { useContext } from 'react';
import { TripContext, type TripContextType } from './TripContextState';

export const useTripContext = (): TripContextType => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};
