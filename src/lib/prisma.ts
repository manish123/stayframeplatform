import { PrismaClient as BasePrismaClient } from '@prisma/client';

// Extend the Prisma client to include our custom models
declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a custom Prisma client that includes our custom models
class PrismaClient extends BasePrismaClient {
  // Add custom methods here if needed
}

// Create a type that includes our custom models
type PrismaClientWithCustomModels = PrismaClient & {
  $queryRaw: BasePrismaClient['$queryRaw'];
  $executeRaw: BasePrismaClient['$executeRaw'];
  $transaction: BasePrismaClient['$transaction'];
  templateUsage: {
    create: (args: { 
      data: {
        type: string;
        templateId: string;
        templateName: string;
        timestamp?: Date;
      } 
    }) => Promise<any>;
  };
  platformStats: {
    findUnique: (args: any) => Promise<any>;
    upsert: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
    findMany: (args?: any) => Promise<any[]>;
    count: (args?: any) => Promise<number>;
  };
};

// Create a singleton Prisma client instance
const prisma = (global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})) as unknown as PrismaClientWithCustomModels;

// In development, set the global instance to enable hot-reloading
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * Tracks template usage and updates platform stats in a single transaction
 */
export async function trackTemplateUsage(data: {
  type: 'quote' | 'meme' | 'video';
  templateId: string;
  templateName: string;
}) {
  try {
    await prisma.$transaction([
      // Update platform stats
      prisma.platformStats.upsert({
        where: { id: 'platform_stats' },
        update: { 
          [data.type === 'quote' ? 'quotes' : 
            data.type === 'meme' ? 'memes' : 'videos']: { 
            increment: 1 
          } 
        },
        create: { 
          id: 'platform_stats',
          quotes: data.type === 'quote' ? 1 : 0,
          memes: data.type === 'meme' ? 1 : 0,
          videos: data.type === 'video' ? 1 : 0,
        },
      }),
      
      // Log the template usage
      prisma.templateUsage.create({
        data: {
          type: data.type,
          templateId: data.templateId,
          templateName: data.templateName,
          timestamp: new Date(),
        },
      }),
    ]);
  } catch (error) {
    console.error('Failed to track template usage:', error);
    // Don't throw - this is a non-critical operation
  }
}

/**
 * Fetches current platform stats
 */
export async function getPlatformStats() {
  try {
    return await prisma.platformStats.findUnique({
      where: { id: 'platform_stats' },
    }) || { quotes: 0, memes: 0, videos: 0 };
  } catch (error) {
    console.error('Failed to fetch platform stats:', error);
    return { quotes: 0, memes: 0, videos: 0 };
  }
}

export { prisma };

// Re-export Prisma types for convenience
export * from '@prisma/client';

// Extend the PrismaClient type with our custom methods
declare module '@prisma/client' {
  interface PrismaClient {
    // Add custom platformStats methods using a different name to avoid conflicts
    $custom: {
      platformStats: {
        findUnique: (args: any) => Promise<any>;
        upsert: (args: any) => Promise<any>;
        create: (args: any) => Promise<any>;
        update: (args: any) => Promise<any>;
        delete: (args: any) => Promise<any>;
        findMany: (args?: any) => Promise<any[]>;
        count: (args?: any) => Promise<number>;
      };
    };
  }
}
