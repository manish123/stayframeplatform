// src/components/quote/ThemeSelector.tsx
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { fetchThemes } from '@/services/quoteService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface ThemeSelectorProps {
  onThemeChange: (theme: string) => void;
  className?: string;
  hideLabel?: boolean;
  value: string;
  defaultTheme?: string;
}

export function ThemeSelector({ 
  onThemeChange, 
  className = '', 
  hideLabel = false, 
  value,
  defaultTheme = 'inspiration' 
}: ThemeSelectorProps) {
  const [themes, setThemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Helper function to get a random theme from the list
  const getRandomTheme = (themeList: string[]): string => {
    if (themeList.length === 0) return defaultTheme;
    const randomIndex = Math.floor(Math.random() * themeList.length);
    return themeList[randomIndex];
  };

  useEffect(() => {
    const loadThemes = async () => {
      try {
        const themeList = await fetchThemes();
        
        // If no themes are returned, use default themes
        const availableThemes = themeList.length > 0 ? themeList : [
          'Inspiration', 
          'Motivation / Hustle', 
          'Success', 
          'Wisdom', 
          'Funny'
        ];
        
        setThemes(availableThemes);
        
        // Only set a random theme on initial load if no theme is selected
        if (!initialized) {
          const randomTheme = getRandomTheme(availableThemes);
          onThemeChange(randomTheme);
          setInitialized(true);
        }
      } catch (err) {
        console.error('Error loading themes:', err);
        // Fallback to default themes if there's an error
        const fallbackThemes = [
          'Inspiration',
          'Motivation / Hustle',
          'Success',
          'Wisdom',
          'Funny'
        ];
        setThemes(fallbackThemes);
        
        if (!initialized) {
          const randomTheme = getRandomTheme(fallbackThemes);
          onThemeChange(randomTheme);
          setInitialized(true);
        }
      } finally {
        setLoading(false);
      }
    };

    loadThemes();
  }, [onThemeChange, initialized]);

  return (
    <div className={cn('space-y-2', className)}>
      {!hideLabel && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Theme
        </label>
      )}
      <Select
        onValueChange={onThemeChange}
        disabled={loading}
        value={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={loading ? "Loading themes..." : (hideLabel ? "Select theme..." : "Select a theme")}
          />
        </SelectTrigger>
        <SelectContent>
          {themes.map((theme) => (
            <SelectItem key={theme} value={theme}>
              {theme}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}