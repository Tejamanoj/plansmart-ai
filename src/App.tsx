import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TripProvider } from '@/context/TripContext';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { ThemeContext } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/useTheme';
import { AppRoutes } from '@/routes/AppRoutes';

/**
 * App — root component.
 *
 * Responsibilities:
 *  - Owns the ThemeContext (hoisted above TripProvider so Navbar can read it)
 *  - Wraps everything in ErrorBoundary for unhandled render errors
 *  - Provides TripProvider for itinerary state + localStorage persistence
 *  - BrowserRouter for client-side routing
 */
export const App: React.FC = () => {
  const themeValue = useTheme();

  return (
    <ThemeContext.Provider value={themeValue}>
      <ErrorBoundary>
        <TripProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TripProvider>
      </ErrorBoundary>
    </ThemeContext.Provider>
  );
};

export default App;
