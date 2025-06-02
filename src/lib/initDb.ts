import { prisma } from './prisma';

export async function initializeStats() {
  try {
    const existing = await prisma.platformStats.findUnique({
      where: { id: 'platform_stats' }
    });
    
    if (!existing) {
      await prisma.platformStats.create({
        data: { id: 'platform_stats' }
      });
      console.log('Initialized platform stats');
    }
  } catch (error) {
    console.error('Error initializing platform stats:', error);
  }
}

// Run initialization when this module is imported
if (typeof window === 'undefined') {
  initializeStats().catch(console.error);
}
