import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/auth";

// Input validation schema for updating feedback
const updateFeedbackSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "parked", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  note: z.object({
    type: z.enum(["update", "comment", "decision"]),
    comment: z.string().min(1, "Comment is required"),
  }).optional(),
});

// GET /api/feedback/[id] - Get a single feedback with its progress logs
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Await the params object to ensure it's resolved
  const { id } = await Promise.resolve(params);
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Allow any authenticated user to view feedback
    // No role-based restrictions for viewing

    // Fetch basic feedback data first
    const feedback = await prisma.feedback.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        screenshot: true,
        metadata: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    // Then get the progress logs in a separate query
    const progressLogs = await prisma.progressLog.findMany({
      where: { feedbackId: Number(id) },
      select: {
        id: true,
        noteType: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to 50 most recent logs
    });

    // Combine the data
    const result = { ...feedback, progressLogs };

    // Add cache control headers
    const headers = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    };

    return NextResponse.json(result, { headers });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}

// PATCH /api/feedback/[id] - Update feedback status or add a note
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Allow any authenticated user to update feedback
    // Await the params object to ensure it's resolved
    const { id } = await Promise.resolve(params);
    const body = await request.json();
    const parsed = updateFeedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { status, priority, note } = parsed.data;
    const updates: any = {};
    let logMessage = '';

    // Prepare updates based on what's being changed
    if (status) {
      updates.status = status;
      logMessage = `Status changed to ${status}`;
    }
    
    if (priority) {
      updates.priority = priority;
      logMessage = logMessage 
        ? `${logMessage}, priority set to ${priority}`
        : `Priority set to ${priority}`;
    }

    // Update feedback
    const result = await prisma.$transaction(async (tx) => {
      // First, update the feedback
      const feedback = await tx.feedback.update({
        where: { id: Number(id) },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });

      // Add progress log for status/priority changes or notes
      if (logMessage || note) {
        await tx.progressLog.create({
          data: {
            feedbackId: feedback.id,
            noteType: note?.type || 'update',
            comment: note?.comment || logMessage,
            createdBy: session.user?.id,
          },
        });
      }

      // Return the updated feedback with its logs
      return tx.feedback.findUnique({
        where: { id: feedback.id },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
          progressLogs: {
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
              createdAt: "desc",
            },
          },
        },
      });
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating feedback:", error);
    return NextResponse.json(
      { error: "Failed to update feedback" },
      { status: 500 }
    );
  }
}

// DELETE /api/feedback/[id] - Delete feedback
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Allow any authenticated user to delete feedback

    // Await the params object to ensure it's resolved
    const { id } = await Promise.resolve(params);

    // Delete the feedback (cascading delete will handle progress logs)
    await prisma.feedback.delete({
      where: { id: Number(id) },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return NextResponse.json(
      { error: "Failed to delete feedback" },
      { status: 500 }
    );
  }
}
