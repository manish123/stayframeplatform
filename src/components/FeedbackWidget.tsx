"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Bug, Check, HelpCircle, MessageSquare, X, Camera, Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRandomMessage } from "@/lib/utils/funMessages";
import type * as Html2Canvas from "html2canvas";

// Define form schema and types
const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'general'] as const, {
    required_error: 'Please select a feedback type',
  }),
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters',
  }),
  priority: z.enum(['low', 'medium', 'high'] as const, {
    required_error: 'Please select a priority',
  }),
  consent: z.boolean().default(false),
  screenshot: z.string().optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const defaultValues: FeedbackFormValues = {
  type: "general",
  priority: "medium",
  consent: false,
  title: "",
  description: "",
  screenshot: undefined,
};

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const pathname = usePathname();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema) as any,
    defaultValues,
  });

  const captureScreenshot = useCallback(async () => {
    try {
      setIsCapturing(true);

      const html2canvas = (await import('html2canvas')).default;
      const feedbackWidget = document.querySelector('.feedback-widget');

      const options = {
        logging: false,
        useCORS: true,
        scale: 1, // Controls the resolution (1 = 100%, 0.5 = 50%, etc.)
        ignoreElements: (element: Element) => {
          return feedbackWidget ? feedbackWidget.contains(element) : false;
        }
      } as const; // Use const assertion for type inference

      const canvas = await html2canvas(document.documentElement, options);

      const screenshotDataUrl = canvas.toDataURL('image/png');
      setScreenshot(screenshotDataUrl);
      setValue('screenshot', screenshotDataUrl, { shouldValidate: true });
      setValue('consent', true, { shouldValidate: true });
      toast.success('Screenshot captured!');
      return screenshotDataUrl;
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast.error('Failed to capture screenshot');
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, [setValue]);

  const isFeedbackPage = pathname ? pathname.startsWith('/feedback') : false;

  const onSubmit: SubmitHandler<FeedbackFormValues> = async (data) => {
    const toastId = toast.loading('Submitting feedback...');

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

      const successMessage = getRandomMessage('feedback.success');
      toast.success(
        <div className="space-y-1">
          <p className="font-medium">{successMessage.message}</p>
          {successMessage.description && (
            <p className="text-sm">
              {successMessage.description}
            </p>
          )}
        </div>,
        {
          id: toastId,
          duration: 10000,
          icon: successMessage.icon ? (
            <span className="text-2xl">{successMessage.icon}</span>
          ) : undefined,
        }
      );

      // Reset form and close dialog after a short delay
      setTimeout(() => {
        reset();
        setScreenshot(null);
        setOpen(false);
      }, 1000);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      const errorMessage = getRandomMessage('feedback.error');
      toast.error(
        <div className="space-y-1">
          <p className="font-medium">{errorMessage.message}</p>
          <p className="text-sm">
            {errorMessage.description || (error instanceof Error ? error.message : 'Please try again later.')}
          </p>
        </div>,
        {
          id: toastId,
          action: errorMessage.action ? {
            label: errorMessage.action,
            onClick: () => onSubmit(data)
          } : undefined
        }
      );
    }
  };

  if (isFeedbackPage) {
    return null;
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className={cn(
            "fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            open ? "scale-90 opacity-0" : "scale-100 opacity-100"
          )}
          aria-label="Provide feedback"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 shadow-xl sm:rounded-xl border border-border">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-foreground">
              Share Your Feedback
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What type of feedback do you have?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'bug', label: 'Bug', icon: <Bug className="w-4 h-4" /> },
                  { value: 'feature', label: 'Feature', icon: <Zap className="w-4 h-4" /> },
                  { value: 'general', label: 'General', icon: <HelpCircle className="w-4 h-4" /> },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-center justify-center p-2 border rounded-md cursor-pointer transition-colors",
                      watch('type') === option.value
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border hover:bg-accent/50"
                    )}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      value={option.value}
                      {...register('type')}
                    />
                    <span className="flex items-center gap-2 text-sm">
                      {option.icon}
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Briefly describe your feedback"
                {...register('title')}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Please provide as much detail as possible"
                {...register('description')}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map((priority) => (
                  <label
                    key={priority}
                    className={cn(
                      "flex items-center justify-center p-2 border rounded-md cursor-pointer transition-colors",
                      watch('priority') === priority
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border hover:bg-accent/50"
                    )}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      value={priority}
                      {...register('priority')}
                    />
                    <span className="capitalize text-sm">{priority}</span>
                  </label>
                ))}
              </div>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="screenshot-consent"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                  {...register('consent')}
                />
                <label htmlFor="screenshot-consent" className="ml-2 block text-sm text-gray-700">
                  Include screenshot of current page
                </label>
              </div>

              {watch('consent') && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={captureScreenshot}
                    disabled={isCapturing}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {isCapturing ? (
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <Camera className="h-4 w-4 mr-2" />
                    )}
                    {screenshot ? 'Retake Screenshot' : 'Capture Screenshot'}
                  </button>

                  {screenshot && (
                    <div className="mt-2 border rounded-md p-2">
                      <img
                        src={screenshot}
                        alt="Screenshot preview"
                        className="w-full h-auto rounded"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  reset();
                  setScreenshot(null);
                }}
                className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-input rounded-md shadow-sm hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 inline" />
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}