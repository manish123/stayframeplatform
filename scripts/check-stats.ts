import { PrismaClient } from '@prisma/client';

// Extend the Prisma client type to include our custom models
type PrismaClientWithCustomModels = PrismaClient & {
  platformStats: {
    findUnique: (args: any) => Promise<any>;
  };
  templateUsage: {
    findMany: (args?: any) => Promise<any[]>;
  };
};

const prisma = new PrismaClient() as PrismaClientWithCustomModels;

async function checkStats() {
  try {
    // Check platform stats
    const stats = await prisma.platformStats.findUnique({
      where: { id: 'platform_stats' },
    });
    console.log('📊 Platform Stats:', stats);

    // Check template usage
    const usage = await prisma.templateUsage.findMany({
      take: 5,
      orderBy: { timestamp: 'desc' },
    });
    console.log('\n🔄 Recent Template Usage:', usage.length > 0 ? usage : 'No template usage recorded yet');
  } catch (error) {
    console.error('❌ Error checking stats:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkStats();
