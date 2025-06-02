import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      console.log('Created initial platform stats');
    } else {
      console.log('Platform stats already exist');
    }
  } catch (error) {
    console.error('Error initializing platform stats:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initPlatformStats();
