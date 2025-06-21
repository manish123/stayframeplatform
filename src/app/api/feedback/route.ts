import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import * as UAParserModule from 'ua-parser-js';
import { put } from '@vercel/blob';

// Create a type-safe UAParser instance
function parseUserAgent(uaString: string) {
  const parser = new (UAParserModule as any).UAParser(uaString);
  return parser.getResult();
}
import { auth } from "@/auth";

// Input validation schemas
const feedbackSchema = z.object({
  type: z.enum(["bug", "feature", "general"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high"]),
  screenshot: z.union([z.string(), z.null()]).optional(),
  consent: z.boolean().default(false),
}).refine(
  (data) => !data.consent || (data.consent && data.screenshot !== null),
  {
    message: "Please capture a screenshot or uncheck the consent",
    path: ["screenshot"]
  }
);

// GET /api/feedback - Get all feedback
export async function GET(request: Request) {
  try {
    const session = await auth().catch(() => null);
    if (!session?.user) {
      return NextResponse.json(
        { 
          error: "Unauthorized",
          message: "You must be logged in to view feedback",
          code: "UNAUTHORIZED"
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    // Build the where clause for Prisma
    const where: any = {};

    if (status) where.status = status;
    if (type) where.type = type;
    if (priority) where.priority = priority;

    // Search in title and description if search query is provided
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get feedback with user relation
    const feedback = await prisma.feedback.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch feedback",
        message: error instanceof Error ? error.message : 'Unknown error',
        code: "FETCH_ERROR"
      },
      { status: 500 }
    );
  }
}

// PATCH /api/feedback/[id] - Update feedback status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth().catch(() => null);
    if (!session?.user) {
      return NextResponse.json(
        { 
          error: "Unauthorized",
          message: "You must be logged in to update feedback",
          code: "UNAUTHORIZED"
        },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { 
          error: "Forbidden",
          message: "You don't have permission to update feedback",
          code: "FORBIDDEN"
        },
        { status: 403 }
      );
    }

    const feedbackId = params.id;
    
    // Get request body
    const body = await request.json();
    
    // Validate input
    const updateSchema = z.object({
      status: z.enum(['Open', 'In Progress', 'Resolved', 'Closed']).optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
      notes: z.string().optional(),
    });
    
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Invalid update data',
          details: parsed.error.format() 
        },
        { status: 400 }
      );
    }
    
    // Convert feedbackId to number and validate
    const id = parseInt(feedbackId, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'Invalid feedback ID' },
        { status: 400 }
      );
    }

    // Update feedback
    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: {
        status: body.status,
        priority: body.priority,
        // Append to notes instead of overwriting
        ...(body.notes ? { 
          notes: { 
            push: `[${new Date().toISOString()}] ${body.notes}` 
          } 
        } : {})
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Feedback updated successfully',
      data: updatedFeedback
    });
    
  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json(
      { 
        error: 'Update Failed',
        message: error instanceof Error ? error.message : 'Failed to update feedback',
      },
      { status: 500 }
    );
  }
}

// POST /api/feedback - Create new feedback
export async function POST(request: Request) {
  try {
    // Get session if user is authenticated
    const session = await auth().catch(() => null);
    const isAuthenticated = !!session?.user;

    // Parse and validate request body
    let body;
    try {
      const bodyText = await request.text();
      
      try {
        body = JSON.parse(bodyText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return NextResponse.json(
          { 
            success: false,
            error: "Invalid JSON",
            message: "The request body is not valid JSON",
            code: "INVALID_JSON"
          },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('❌ Error reading request body:', error);
      return NextResponse.json(
        { 
          success: false,
          error: "Request Error",
          message: error instanceof Error ? error.message : 'Failed to read request body',
          code: "REQUEST_ERROR"
        },
        { status: 400 }
      );
    }
    
    // Validate against schema
    let parsed;
    try {
      parsed = feedbackSchema.safeParse(body);
      
      if (!parsed.success) {
        const formattedErrors = parsed.error.format();
        console.error('Validation errors:', formattedErrors);
        
        return NextResponse.json(
          { 
            success: false,
            error: "Validation Error",
            message: "Invalid input data",
            code: "VALIDATION_ERROR",
            details: formattedErrors
          },
          { status: 400 }
        );
      }
    } catch (validationError) {
      console.error('Error during validation:', validationError);
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          message: "Failed to validate input data",
          code: "VALIDATION_ERROR",
          details: validationError instanceof Error ? validationError.message : 'Unknown validation error'
        },
        { status: 400 }
      );
    }
    
    // Handle screenshot upload if consent was given and screenshot exists
    const { type, title, description, priority, screenshot, consent } = parsed.data;
    let screenshotUrl: string | undefined;

    if (consent && screenshot) {
      try {
        if (typeof screenshot === 'string' && screenshot.startsWith('data:image/')) {
          const blobName = `screenshots/feedback-${Date.now()}.png`;
          
          // Convert base64 to buffer
          const base64Data = screenshot.replace(/^data:image\/png;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          
          if (!process.env.BLOB_READ_WRITE_TOKEN) {
            throw new Error('BLOB_READ_WRITE_TOKEN is not set in environment variables');
          }
          
          const blob = await put(
            blobName,
            buffer,
            {
              access: 'public',
              contentType: 'image/png',
              addRandomSuffix: true,
              token: process.env.BLOB_READ_WRITE_TOKEN
            }
          );
          screenshotUrl = blob.url;
        }
      } catch (error) {
        console.error('Error processing screenshot:', error);
        // Continue without screenshot if there's an error
      }
    }

    // Get user agent for metadata
    const userAgent = request.headers.get('user-agent') || '';
    const ua = parseUserAgent(userAgent);
    const metadata = {
      browser: ua.browser?.name || 'unknown',
      browserVersion: ua.browser?.version || 'unknown',
      os: ua.os?.name || 'unknown',
      osVersion: ua.os?.version || 'unknown',
      device: ua.device?.model || 'unknown',
      deviceType: ua.device?.type || 'unknown',
      url: request.headers.get("referer") || 'unknown',
      timestamp: new Date().toISOString(),
      userAgent: userAgent,
    };

    // Create the feedback in database
    try {
      // Prepare feedback data
      const feedbackData: any = {
        type,
        title: title.substring(0, 255), // Ensure title is not too long
        description: description.substring(0, 5000), // Limit description length
        status: 'Open' as const,
        priority,
        metadata: {
          ...metadata,
          // Add IP address for better tracking of unauthenticated submissions
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          isAuthenticated,
        },
        // Only set userId if user is authenticated
        ...(isAuthenticated && session?.user?.id ? { userId: session.user.id } : {})
      };

      // Add screenshot URL if available
      if (screenshotUrl) {
        feedbackData.screenshot = screenshotUrl;
      }
      
      // Removed debug logging of feedback data

      // Validate required fields
      if (!feedbackData.title || !feedbackData.description) {
        throw new Error('Title and description are required');
      }
      
      // Save to database
      const feedback = await prisma.feedback.create({
        data: feedbackData,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      // Prepare response data with user-friendly message
      const responseData = {
        success: true,
        feedbackId: feedback.id,
        timestamp: new Date().toISOString(),
        screenshotReceived: !!screenshotUrl,
        ...(isAuthenticated && session?.user?.email ? {
          contactEmail: session.user.email,
          userName: session.user.name
        } : {
          note: 'Consider signing in next time to track your feedback history.'
        })
      };
      
      return NextResponse.json(responseData, { status: 201 });
      
    } catch (dbError) {
      console.error('Database error:');
      
      let errorDetails = {};
      
      // Handle Prisma specific errors
      if (dbError instanceof Error) {
        errorDetails = {
          name: dbError.name,
          message: dbError.message,
          ...(process.env.NODE_ENV !== 'production' && dbError.stack ? { 
            stack: dbError.stack.split('\n').slice(0, 3).join('\n') 
          } : {})
        };
        
        console.error('Error details:', errorDetails);
        
        // Handle common Prisma errors
        if (dbError.message.includes('Unique constraint')) {
          return NextResponse.json(
            {
              success: false,
              error: 'Duplicate Entry',
              message: 'This feedback appears to be a duplicate',
              code: 'DUPLICATE_ENTRY',
              details: errorDetails
            },
            { status: 409 }
          );
        }
        
        if (dbError.message.includes('Foreign key constraint')) {
          return NextResponse.json(
            {
              success: false,
              error: 'Invalid Reference',
              message: 'The referenced user does not exist',
              code: 'INVALID_REFERENCE',
              details: errorDetails
            },
            { status: 400 }
          );
        }
      }
      
      // Default database error response
      return NextResponse.json(
        {
          success: false,
          error: 'Database Error',
          message: 'Failed to save feedback to database',
          code: 'DATABASE_ERROR',
          ...(process.env.NODE_ENV !== 'production' ? { details: errorDetails } : {})
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in feedback submission:', error);
    
    // Default error response
    let errorMessage = 'An unexpected error occurred';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let statusCode = 500;
    let details = null;
    
    // Handle different types of errors
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle Prisma errors
      if (error.name.includes('Prisma')) {
        errorCode = 'DATABASE_ERROR';
        statusCode = 500;
        details = {
          name: error.name,
          message: error.message,
          // Don't expose stack trace in production
          ...(process.env.NODE_ENV !== 'production' ? { stack: error.stack } : {})
        };
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to submit feedback",
        message: errorMessage,
        code: errorCode,
        ...(details ? { details } : {})
      },
      { status: statusCode }
    );
  }
}
