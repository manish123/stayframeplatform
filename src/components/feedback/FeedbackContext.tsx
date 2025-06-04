'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Feedback, FeedbackStatus, FeedbackType, FeedbackPriority, ProgressLogType } from '@/types/feedback';

interface FeedbackItem extends Omit<Feedback, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

interface FeedbackContextType {
  feedbacks: FeedbackItem[];
  loading: boolean;
  error: string | null;
  fetchFeedbacks: (filters?: {
    status?: string;
    type?: string;
    priority?: string;
    search?: string;
  }) => Promise<void>;
  updateFeedbackStatus: (id: number, status: FeedbackStatus) => Promise<boolean>;
  addProgressLog: (feedbackId: number, note: string, noteType: ProgressLogType) => Promise<boolean>;
  deleteFeedback: (id: number) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const fetchFeedbacks = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });

      const response = await fetch(`/api/feedback?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      
      const data = await response.json();
      setFeedbacks(data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Failed to load feedbacks. Please try again.');
      toast.error('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFeedbackStatus = useCallback(async (id: number, status: FeedbackStatus) => {
    if (session?.user?.role !== 'admin') {
      toast.error('You do not have permission to update feedback status');
      return false;
    }

    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update feedback status');
      }

      const updatedFeedback = await response.json();
      
      setFeedbacks(prevFeedbacks =>
        prevFeedbacks.map(fb => (fb.id === id ? { ...fb, status, updatedAt: updatedFeedback.updatedAt } : fb))
      );
      
      toast.success('Status updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating feedback status:', err);
      toast.error('Failed to update status');
      return false;
    }
  }, [session]);

  const addProgressLog = useCallback(async (feedbackId: number, comment: string, noteType: 'Update' | 'Comment' | 'Decision') => {
    if (!session?.user) {
      toast.error('You must be logged in to add a note');
      return false;
    }

    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: {
            type: noteType,
            comment,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add note');
      }

      const updatedFeedback = await response.json();
      
      // If we're on the feedback detail page, we'll refresh the data
      if (window.location.pathname === `/feedback/${feedbackId}`) {
        router.refresh();
      } else {
        // Otherwise, update the feedback in the list
        setFeedbacks(prevFeedbacks =>
          prevFeedbacks.map(fb => 
            fb.id === feedbackId 
              ? { 
                  ...fb, 
                  updatedAt: updatedFeedback.updatedAt,
                  status: updatedFeedback.status 
                } 
              : fb
          )
        );
      }
      
      toast.success('Note added successfully');
      return true;
    } catch (err) {
      console.error('Error adding note:', err);
      toast.error('Failed to add note');
      return false;
    }
  }, [session, router]);

  const deleteFeedback = useCallback(async (id: number) => {
    if (session?.user?.role !== 'admin') {
      toast.error('You do not have permission to delete feedback');
      return false;
    }

    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete feedback');
      }

      setFeedbacks(prevFeedbacks => prevFeedbacks.filter(fb => fb.id !== id));
      toast.success('Feedback deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting feedback:', err);
      toast.error('Failed to delete feedback');
      return false;
    }
  }, [session]);

  return (
    <FeedbackContext.Provider
      value={{
        feedbacks,
        loading,
        error,
        fetchFeedbacks,
        updateFeedbackStatus,
        addProgressLog,
        deleteFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
}
