import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TripProvider } from '@/context/TripContext';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { AppRoutes } from '@/routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <TripProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TripProvider>
    </ErrorBoundary>
  );
};

export default App;
