import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/auth';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'demo@codecraft.com',
      name: 'Demo User',
      password: hashPassword('password123')
    }
  });

  // Create sample projects
  await prisma.project.createMany({
    data: [
      { title: 'My First Project', description: 'Getting started with CodeCraft', userId: user.id },
      { title: 'API Integration', description: 'Learning backend development', userId: user.id },
      { title: 'UI Components', description: 'Building reusable components', userId: user.id }
    ]
  });

  console.log('Seed completed');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
