import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { getRandomMessage } from '@/lib/utils/funMessages';

type WaitlistInterest = 'creator' | 'professional' | 'agency';
type WaitlistPlan = 'pro' | 'agency';

export type WaitlistStatus = {
  exists: boolean;
  email: string | null;
  plan: string | null;
  interest: string | null;
  subscribedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

interface UseWaitlistReturn {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  isSubscribed: boolean;
  waitlistStatus: WaitlistStatus | null;
  subscribeToWaitlist: (e: React.FormEvent, plan?: WaitlistPlan, interest?: WaitlistInterest) => Promise<boolean>;
  checkStatus: (email: string) => Promise<WaitlistStatus | null>;
}

export const useWaitlist = (): UseWaitlistReturn => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<WaitlistStatus | null>(null);
  
  // Memoize the setEmail function to prevent unnecessary re-renders
  const setEmailHandler = useCallback((newEmail: string) => {
    setEmail(newEmail);
  }, []);

  const subscribeToWaitlist = async (e: React.FormEvent, plan: WaitlistPlan = 'pro', interest: WaitlistInterest = 'creator') => {
    e.preventDefault();
    
    // Get the current email and trim it
    const currentEmail = email.trim();
    
    if (!currentEmail) {
      throw new Error('Email is required');
    }
    
    // Update the email state with trimmed email using the memoized handler
    setEmailHandler(currentEmail);
    
    // Basic email validation as a fallback
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentEmail)) {
      throw new Error('Please enter a valid email address');
    }
    
    setIsLoading(true);

    try {
      const subscribedAt = new Date().toISOString();
      
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: currentEmail.toLowerCase(),
          plan,
          interest,
          subscribedAt
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      // Update the waitlist status with the new subscription
      const statusResponse = await fetch(`/api/waitlist?email=${encodeURIComponent(currentEmail)}`);
      if (statusResponse.ok) {
        const status = await statusResponse.json();
        setWaitlistStatus(status);
      }
      
      setIsSubscribed(true);
      setEmailHandler('');
      
      return true;
    } catch (error) {
      console.error('Error subscribing to waitlist:', error);
      throw error; // Re-throw to be handled by the component
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check waitlist status for an email
  const checkStatus = async (emailToCheck: string) => {
    try {
      const response = await fetch(`/api/waitlist?email=${encodeURIComponent(emailToCheck)}`);
      if (response.ok) {
        const status = await response.json();
        setWaitlistStatus(status);
        return status;
      }
      return null;
    } catch (error) {
      console.error('Error checking waitlist status:', error);
      return null;
    }
  };

  return {
    email,
    setEmail: setEmailHandler,
    isLoading,
    isSubscribed,
    waitlistStatus,
    subscribeToWaitlist,
    checkStatus,
  };
};
