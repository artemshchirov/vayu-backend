import { PrismaClient, StatusName, GroupStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedStatuses() {
  const statuses = [
    { id: 1, name: StatusName.PENDING },
    { id: 2, name: StatusName.ACTIVE },
    { id: 3, name: StatusName.BLOCKED },
  ];

  for (const status of statuses) {
    const existingStatus = await prisma.status.findUnique({
      where: { id: status.id },
    });

    if (!existingStatus) {
      await prisma.status.create({
        data: status,
      });
    }
  }
  console.log('Statuses seeded');
}

async function seedGroups() {
  const groups = [
    { name: 'Developers', status: GroupStatus.NOT_EMPTY },
    { name: 'Testers', status: GroupStatus.EMPTY },
  ];

  for (const group of groups) {
    await prisma.group.upsert({
      where: { name: group.name },
      update: {},
      create: group,
    });
  }
  console.log('Groups seeded');
}

async function seedUsers() {
  const users = [
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      statusId: 2,
      groupId: 1,
    },
    {
      name: 'Bob Smith',
      email: 'bob@example.com',
      statusId: 1,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
  console.log('Users seeded');
}

async function main() {
  console.log('Starting seeding process...');
  await seedStatuses();
  await seedGroups();
  await seedUsers();
  console.log('Seeding process completed.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
