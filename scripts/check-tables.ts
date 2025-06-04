import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function checkTables() {
  try {
    console.log('Checking database tables...');
    
    // Check if feedbacks table exists by trying to count records
    const feedbackCount = await prisma.feedback.count().catch(() => null);
    console.log('Feedbacks table exists:', feedbackCount !== null);
    
    // List all tables in the database
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('\nAll tables in database:');
    console.log(tables);
    
    if (feedbackCount !== null) {
      console.log('\nFirst few feedback records:');
      const feedbacks = await prisma.feedback.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
      console.log(feedbacks);
    }
    
  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
