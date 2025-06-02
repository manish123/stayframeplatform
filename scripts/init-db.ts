// @ts-ignore - This is a script, not a module
const { PrismaClient } = require('@prisma/client');

const dbClient = new PrismaClient();

async function main() {
  try {
    // Check if the platform stats record exists
    const existing = await dbClient.platformStats.findUnique({
      where: { id: 'platform_stats' }
    });
    
    if (!existing) {
      // Create the platform stats record with default values
      await dbClient.platformStats.create({
        data: { id: 'platform_stats' }
      });
      console.log('✅ Created platform stats record');
    } else {
      console.log('ℹ️ Platform stats record already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    await dbClient.$disconnect();
  }
}

main().catch(console.error);
