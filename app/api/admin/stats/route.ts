import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (role !== 'admin' && role !== 'it_support') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const [totalUsers, clientCount, adminCount, itCount, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'client' } }),
    prisma.user.count({ where: { role: 'admin' } }),
    prisma.user.count({ where: { role: 'it_support' } }),
    prisma.user.findMany({
      where: { role: 'client' },
      select: { id: true, name: true, email: true, customerId: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
  ]);

  return NextResponse.json({
    stats: { totalUsers, clientCount, adminCount, itCount },
    recentUsers,
  });
}
