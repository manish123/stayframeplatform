import { prisma } from '@/lib/prisma';

type WaitlistData = {
  email: string;
  plan: string;
  interest: string;
  subscribedAt: string | Date;
};

export const addToWaitlist = async (data: WaitlistData) => {
  try {
    const { email, plan, interest, subscribedAt } = data;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Check if email already exists
    const existing = await prisma.waitlist.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return { success: false, message: 'already_exists' };
    }

    // Add to waitlist with all data
    await prisma.waitlist.create({
      data: {
        email: email.toLowerCase().trim(),
        plan,
        interest,
        subscribedAt: new Date(subscribedAt),
      },
    });

    return { success: true, message: 'success' };
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An error occurred' 
    };
  }
};

export const checkWaitlistStatus = async (email: string) => {
  try {
    const entry = await prisma.waitlist.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!entry) {
      return {
        exists: false,
        email: null,
        plan: null,
        interest: null,
        subscribedAt: null,
        createdAt: null,
        updatedAt: null
      };
    }

    return {
      exists: true,
      email: entry.email,
      plan: entry.plan,
      interest: entry.interest,
      subscribedAt: entry.subscribedAt,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt
    };
  } catch (error) {
    console.error('Error checking waitlist status:', error);
    throw new Error('Failed to check waitlist status');
  }
};
