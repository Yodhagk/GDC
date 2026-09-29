import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { issueVerificationEmail } from '@/lib/verifyEmail';

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
      isActive: true,
      backupPlan: true,
      emailVerified: true,
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
  const actorRole = (session?.user as any)?.role;
  const actorId = (session?.user as any)?.id;
  if (!isPrivileged(actorRole)) return unauthorized();

  const { id, role, isActive, backupPlan, forceVerify, resendVerification } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  if (role === undefined && isActive === undefined && backupPlan === undefined && !forceVerify && !resendVerification) {
    return NextResponse.json({ error: 'No changes requested' }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // ── Role changes: admin only ──────────────────────────────────────────────
  if (role !== undefined) {
    if (actorRole !== 'admin') return unauthorized();
    if (!['client', 'admin', 'it_support'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
  }

  // ── Activate/deactivate: admin + it_support, scoped ──────────────────────
  if (isActive !== undefined) {
    if (id === actorId) {
      return NextResponse.json({ error: 'Cannot deactivate your own account' }, { status: 403 });
    }
    if (target.role === 'admin') {
      return NextResponse.json({ error: 'Cannot deactivate admin accounts' }, { status: 403 });
    }
    // IT Support may only manage client accounts; admin may also manage IT Support accounts.
    if (actorRole === 'it_support' && target.role !== 'client') {
      return NextResponse.json({ error: 'IT Support can only manage client accounts' }, { status: 403 });
    }
  }

  // ── Backup plan ($25/mo, billed offline): admin + it_support, client accounts only ──
  if (backupPlan !== undefined) {
    if (typeof backupPlan !== 'boolean') {
      return NextResponse.json({ error: 'backupPlan must be true or false' }, { status: 400 });
    }
    if (target.role !== 'client') {
      return NextResponse.json({ error: 'Backup plan applies to client accounts only' }, { status: 400 });
    }
  }

  // ── Force-verify / resend: admin + it_support, any target ────────────────
  if (resendVerification && !target.emailVerified) {
    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;
    await issueVerificationEmail(target, baseUrl);
  }

  const data: Record<string, unknown> = {};
  if (role !== undefined) data.role = role;
  if (isActive !== undefined) data.isActive = isActive;
  if (backupPlan !== undefined) data.backupPlan = backupPlan;
  if (forceVerify) {
    data.emailVerified = new Date();
    data.verifyEmailToken = null;
    data.verifyEmailTokenExpires = null;
  }

  const updated = Object.keys(data).length
    ? await prisma.user.update({ where: { id }, data })
    : target;

  return NextResponse.json({
    user: {
      id: updated.id,
      role: updated.role,
      isActive: updated.isActive,
      backupPlan: updated.backupPlan,
      emailVerified: updated.emailVerified,
    },
  });
}
