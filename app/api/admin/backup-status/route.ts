import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { refreshSnapshot } from '@/lib/sync';

export const runtime = 'nodejs';

async function isStaff() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  return role === 'admin' || role === 'it_support';
}

// GET -> one row per client: plan, backup-folder size and the last Dropbox sync
export async function GET() {
  if (!(await isStaff())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const [clients, snaps] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'client' },
      select: { id: true, name: true, email: true, customerId: true, backupPlan: true, isActive: true },
      orderBy: [{ backupPlan: 'desc' }, { name: 'asc' }],
    }),
    prisma.syncSnapshot.findMany({
      where: { area: 'backup' },
      select: { customerId: true, fileCount: true, folderCount: true, totalSize: true, lastModified: true, syncedAt: true },
    }),
  ]);
  const byCustomer = new Map(snaps.map((s) => [s.customerId, s]));

  return NextResponse.json({
    rows: clients.map((c) => ({ ...c, backup: byCustomer.get(c.customerId) ?? null })),
  });
}

// POST { customerId } or { all: true } -> re-sync backup folder(s) from Dropbox now
export async function POST(request: NextRequest) {
  if (!(await isStaff())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { customerId, all } = await request.json().catch(() => ({}));
  let ids: string[] = [];
  if (all === true) {
    const plan = await prisma.user.findMany({
      where: { role: 'client', backupPlan: true },
      select: { customerId: true },
      take: 100,
    });
    ids = plan.map((u) => u.customerId);
  } else if (typeof customerId === 'string' && /^[A-Za-z0-9-]+$/.test(customerId)) {
    ids = [customerId];
  } else {
    return NextResponse.json({ error: 'customerId or all required' }, { status: 400 });
  }

  const failed: string[] = [];
  for (const id of ids) {
    try {
      await refreshSnapshot(id, 'backup');
    } catch (error: any) {
      console.error('Backup sync failed for', id, error?.message ?? error);
      failed.push(id);
    }
  }
  return NextResponse.json({ synced: ids.length - failed.length, failed });
}
