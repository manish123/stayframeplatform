import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

type FeedbackType = 'bug' | 'feature' | 'general';
type FeedbackPriority = 'low' | 'medium' | 'high';

interface FeedbackFormData {
  type: FeedbackType;
  title: string;
  description: string;
  priority: FeedbackPriority;
  screenshot: string | null;
  consent: boolean;
}

export function useFeedbackWidget() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const toggleDialog = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const captureScreenshot = useCallback(async () => {
    try {
      setIsCapturing(true);
      
      // Dynamically import html2canvas only when needed
      const html2canvas = (await import('html2canvas')).default;
      // Using type assertion for html2canvas options to avoid type issues
      const options = {
        logging: false,
        useCORS: true,
        scale: 0.5, // Reduce size for better performance
        onclone: (clonedDoc: Document) => {
          // Hide the feedback widget during screenshot
          const widget = clonedDoc.querySelector('.feedback-widget');
          if (widget) {
            (widget as HTMLElement).style.display = 'none';
          }
          return clonedDoc;
        },
      } as const;
      
      const canvas = await html2canvas(document.documentElement, options);
      
      const screenshotDataUrl = canvas.toDataURL('image/png');
      setScreenshot(screenshotDataUrl);
      return screenshotDataUrl;
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast.error('Failed to capture screenshot');
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const submitFeedback = useCallback(
    async (data: FeedbackFormData) => {
      if (data.consent && !screenshot) {
        toast.error('Please capture a screenshot or uncheck the screenshot consent');
        return false;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            screenshot: data.consent ? screenshot : null,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit feedback');
        }

        toast.success('Thank you for your feedback!');
        setScreenshot(null);
        setIsOpen(false);
        return true;
      } catch (error) {
        console.error('Error submitting feedback:', error);
        toast.error('Failed to submit feedback. Please try again.');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [screenshot]
  );

  return {
    isOpen,
    toggleDialog,
    isSubmitting,
    screenshot,
    isCapturing,
    captureScreenshot,
    submitFeedback,
    hasAuth: !!session?.user,
  };
}
