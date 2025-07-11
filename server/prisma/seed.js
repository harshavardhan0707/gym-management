const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const user1Password = await bcrypt.hash('password1', 10);
  const user2Password = await bcrypt.hash('password2', 10);
  const trainerPassword = await bcrypt.hash('trainerpass', 10);

  // Users
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      rollNumber: 'admin001',
      email: 'admin@example.com',
      phone: '9999999999',
      password: adminPassword,
      role: 'admin',
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      rollNumber: 'user001',
      email: 'john.doe@example.com',
      phone: '8888888888',
      password: user1Password,
      role: 'user',
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      rollNumber: 'user002',
      email: 'jane.smith@example.com',
      phone: '7777777777',
      password: user2Password,
      role: 'user',
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'trainer.bob@example.com' },
    update: {},
    create: {
      name: 'Bob Trainer',
      rollNumber: 'trainer001',
      email: 'trainer.bob@example.com',
      phone: '6666666666',
      password: trainerPassword,
      role: 'trainer',
      isActive: true,
    },
  });

  // Plans
  // Plan 30 days
  const plan30 = await prisma.plan.upsert({
    where: { duration: 30 },
    update: {},
    create: {
      name: 'Monthly',
      duration: 30,
      price: 500,
    },
  });

  // Plan 90 days
  const plan90 = await prisma.plan.upsert({
    where: { duration: 90 },
    update: {},
    create: {
      name: 'Quarterly',
      duration: 90,
      price: 1500,
    },
  });

  // Subscriptions
  const john = await prisma.user.findUnique({ where: { email: 'john.doe@example.com' } });
  const jane = await prisma.user.findUnique({ where: { email: 'jane.smith@example.com' } });

  await prisma.subscriptions.createMany({
    data: [
      {
        userId: john.id,
        planId: plan30.id,
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-07-31'),
        paymentStatus: 'paid',
      },
      {
        userId: jane.id,
        planId: plan90.id,
        startDate: new Date('2025-06-15'),
        endDate: new Date('2025-09-13'),
        paymentStatus: 'unpaid',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seeded admin, users, plans, and subscriptions');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());