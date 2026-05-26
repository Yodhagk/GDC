import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin / Owner ──────────────────────────────────────────────
  const adminEmail = 'priti@goldendollarconsulting.com';
  const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!adminExists) {
    const hash = await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD ?? 'GDC@Admin2025!', 12);
    await prisma.user.create({
      data: {
        name: 'Priti (Owner)',
        email: adminEmail,
        password: hash,
        customerId: 'GDC-ADMIN1',
        role: 'admin',
      },
    });
    console.log('✅ Admin user created:', adminEmail);
  } else {
    console.log('ℹ️  Admin user already exists:', adminEmail);
  }

  // ── IT Support ─────────────────────────────────────────────────
  const itEmail = 'itsupport@goldendollarconsulting.com';
  const itExists = await prisma.user.findUnique({ where: { email: itEmail } });

  if (!itExists) {
    const hash = await bcrypt.hash(process.env.IT_SEED_PASSWORD ?? 'GDC@ITSupport2025!', 12);
    await prisma.user.create({
      data: {
        name: 'IT Support',
        email: itEmail,
        password: hash,
        customerId: 'GDC-ITSUP1',
        role: 'it_support',
      },
    });
    console.log('✅ IT Support user created:', itEmail);
  } else {
    console.log('ℹ️  IT Support user already exists:', itEmail);
  }

  console.log('✅ Seeding complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
