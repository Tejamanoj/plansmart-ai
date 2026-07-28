export const APP_CONFIG = {
  appName: 'PlanSmart AI',
  tagline: 'AI-Powered Smart Trip Planner',
  version: '0.1.0',
  defaultCurrency: 'USD',
  storageKeys: {
    savedTrips: 'plansmart_saved_trips',
    userPreferences: 'plansmart_user_prefs',
  },
} as const;

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Plan Trip', path: '/plan' },
  { label: 'Saved Trips', path: '/saved' },
] as const;
