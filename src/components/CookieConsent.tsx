'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Cookie, Check, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

declare global {
  interface Window {
    'ga-disable-GA_MEASUREMENT_ID'?: boolean;
    dataLayer?: any[];
  }
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else {
      // If consent was given previously, set up cookies based on preferences
      const savedPrefs = JSON.parse(consent);
      setPreferences(savedPrefs);
      initializeCookies(savedPrefs);
    }
  }, []);

  const initializeCookies = (prefs: CookiePreferences) => {
    // This is where you would initialize your analytics/marketing cookies
    // based on user preferences
    console.log('Initializing cookies with preferences:', prefs);
    
    // Example: Initialize Google Analytics if analytics is enabled
    if (prefs.analytics && typeof window !== 'undefined' && !window['ga-disable-GA_MEASUREMENT_ID']) {
      // Initialize Google Analytics
      // window.dataLayer = window.dataLayer || [];
      // function gtag(){window.dataLayer.push(arguments);}
      // gtag('js', new Date());
      // gtag('config', 'GA_MEASUREMENT_ID');
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    initializeCookies(allAccepted);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    const updatedPrefs = { ...preferences };
    localStorage.setItem('cookieConsent', JSON.stringify(updatedPrefs));
    initializeCookies(updatedPrefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    // 'necessary' cookies cannot be disabled
    if (key === 'necessary') return;
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t z-50">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Cookie className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">We value your privacy</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
                By clicking "Accept All", you consent to our use of cookies. 
                <a href="/marketing/cookies" className="text-primary hover:underline ml-1">Cookie Policy</a>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSettings(true)}
                className="whitespace-nowrap"
              >
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </Button>
              <Button 
                size="sm" 
                onClick={handleAcceptAll}
                className="whitespace-nowrap"
              >
                <Check className="h-4 w-4 mr-2" />
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. You can change these settings at any time by visiting our 
              <a href="/marketing/cookies" className="text-primary hover:underline"> Cookie Policy</a>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Necessary Cookies - Always on */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-medium">Necessary Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Essential for the website to function properly. Cannot be disabled.
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="necessary"
                  checked={true}
                  disabled
                  className="sr-only"
                />
                <label
                  htmlFor="necessary"
                  className="block overflow-hidden h-6 rounded-full bg-primary cursor-pointer"
                >
                  <span className="block h-6 w-6 rounded-full bg-white transform translate-x-4"></span>
                </label>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Analytics Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Help us understand how visitors interact with our website.
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="analytics"
                  checked={preferences.analytics}
                  onChange={() => togglePreference('analytics')}
                  className="sr-only"
                />
                <label
                  htmlFor="analytics"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                    preferences.analytics ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform ${
                      preferences.analytics ? 'translate-x-4' : 'translate-x-0'
                    } transition-transform`}
                  ></span>
                </label>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Marketing Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Used to track visitors across websites for advertising purposes.
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="marketing"
                  checked={preferences.marketing}
                  onChange={() => togglePreference('marketing')}
                  className="sr-only"
                />
                <label
                  htmlFor="marketing"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                    preferences.marketing ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform ${
                      preferences.marketing ? 'translate-x-4' : 'translate-x-0'
                    } transition-transform`}
                  ></span>
                </label>
              </div>
            </div>

            {/* Preferences Cookies */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Preference Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Allow the website to remember choices you make for a better experience.
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="preferences"
                  checked={preferences.preferences}
                  onChange={() => togglePreference('preferences')}
                  className="sr-only"
                />
                <label
                  htmlFor="preferences"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                    preferences.preferences ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform ${
                      preferences.preferences ? 'translate-x-4' : 'translate-x-0'
                    } transition-transform`}
                  ></span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={() => setShowSettings(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSavePreferences}
            >
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
