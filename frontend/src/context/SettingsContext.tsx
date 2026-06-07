import { createContext, useContext, useEffect, useState } from 'react';
import { settingsApi } from '../services/api';
import type { AppSettings } from '../types';

interface SettingsContextValue {
  settings: AppSettings | null;
  loading: boolean;
  reload: () => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: null,
  loading: true,
  reload: () => undefined,
});

const defaults: Omit<AppSettings, 'id' | 'updatedAt'> = {
  phone: '(587) 123-4567',
  email: 'info@cleanhouse.ca',
  businessName: 'Clean House',
  location: 'Calgary, Alberta',
  startingPrice: 'From $40/hr',
  facebookUrl: null,
  googleBusinessUrl: null,
  bookingConfirmationMessage: 'Thank you! We will be in touch shortly.',
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    settingsApi
      .get()
      .then(setSettings)
      .catch(() => setSettings({ id: 1, updatedAt: '', ...defaults }))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, reload: load }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
