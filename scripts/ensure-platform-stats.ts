import { PrismaClient } from '@prisma/client';

// Extend the Prisma client type to include our custom platformStats model
type PrismaClientWithPlatformStats = PrismaClient & {
  platformStats: {
    findUnique: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
  };
};

const prisma = new PrismaClient() as PrismaClientWithPlatformStats;

async function initPlatformStats() {
  try {
    // Check if platform stats exist
    const existingStats = await prisma.platformStats.findUnique({
      where: { id: 'platform_stats' },
    });

    if (!existingStats) {
      // Create initial platform stats
      await prisma.platformStats.create({
        data: {
          id: 'platform_stats',
          quotes: 0,
          memes: 0,
          videos: 0,
        },
      });
      console.log('✅ Created initial platform stats');
    } else {
      console.log('ℹ️ Platform stats already exist:', existingStats);
    }
  } catch (error) {
    console.error('❌ Error initializing platform stats:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initPlatformStats();
