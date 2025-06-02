'use client';

import { useCallback } from 'react';

type TemplateType = 'quote' | 'meme' | 'video';

/**
 * Hook for tracking template usage
 * @returns Object with track function
 */
export function useTrackTemplate() {
  const track = useCallback(async (type: TemplateType, templateId: string, templateName?: string) => {
    try {
      const response = await fetch('/api/track-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          templateId,
          templateName: templateName || 'Unnamed Template',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to track template usage');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to track template usage:', error);
      // Silently fail - don't break the UI if tracking fails
      return { success: false, error };
    }
  }, []);

  return { track };
}
