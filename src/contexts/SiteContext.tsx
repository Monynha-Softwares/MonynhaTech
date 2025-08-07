import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

// Define types for our context data
interface SiteContextType {
  siteSettings: any;
  navigation: any;
  isLoading: boolean;
  error: string | null;
}

// Create the context with default values
const SiteContext = createContext<SiteContextType>({
  siteSettings: null,
  navigation: null,
  isLoading: true,
  error: null,
});

// Custom hook to use the site context
export const useSite = () => useContext(SiteContext);

// Provider component
export const SiteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [navigation, setNavigation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch site settings and navigation in parallel
        const [settingsResponse, navigationResponse] = await Promise.all([
          api.settings.getSiteSettings(),
          api.settings.getNavigation(),
        ]);
        
        setSiteSettings(settingsResponse);
        setNavigation(navigationResponse);
        setError(null);
      } catch (err) {
        console.error('Error fetching site data:', err);
        setError('Failed to load site data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, []);

  return (
    <SiteContext.Provider value={{ siteSettings, navigation, isLoading, error }}>
      {children}
    </SiteContext.Provider>
  );
};