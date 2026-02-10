import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: { name: 'SUPER_ADMIN' }
  });

  await prisma.user.upsert({
    where: { email: 'admin@platform.com' },
    update: {},
    create: {
      id: 'superadmin',
      email: 'admin@platform.com',
      name: 'Super Admin',
      password: 'admin123',  // plain text for simple test
      roleId: 'superadminrole'
    }
  });

  console.log('✅ SEED OK');
}

main().finally(() => prisma.$disconnect());
