'use client';

import { trackTemplateUsage } from './prisma';

type ContentType = 'quote' | 'meme' | 'video';

export async function trackTemplateClick({
  type,
  templateId,
  templateName = 'Unknown',
}: {
  type: ContentType;
  templateId: string;
  templateName?: string;
}) {
  try {
    // Send the tracking event to our API
    const response = await fetch('/api/stats/increment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        templateId,
        templateName,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error('Failed to track template usage');
    }
  } catch (error) {
    console.error('Error tracking template usage:', error);
  }
}
