import { NextResponse } from 'next/server';
import { trackTemplateUsage } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { type, templateId, templateName } = await request.json();
    
    if (!type || !templateId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await trackTemplateUsage({
      type,
      templateId,
      templateName: templateName || 'Unnamed Template',
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error tracking template usage:', error);
    return NextResponse.json(
      { error: 'Failed to track template usage' },
      { status: 500 }
    );
  }
}
