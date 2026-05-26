import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}

function isPrivileged(role?: string) {
  return role === 'admin' || role === 'it_support';
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isPrivileged((session?.user as any)?.role)) return unauthorized();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      customerId: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ users });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'admin') return unauthorized();

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (target.role === 'admin') {
    return NextResponse.json({ error: 'Cannot delete admin accounts' }, { status: 403 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'admin') return unauthorized();

  const { id, role } = await request.json();
  if (!id || !role) return NextResponse.json({ error: 'id and role required' }, { status: 400 });
  if (!['client', 'admin', 'it_support'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const updated = await prisma.user.update({ where: { id }, data: { role } });
  return NextResponse.json({ user: { id: updated.id, role: updated.role } });
}
