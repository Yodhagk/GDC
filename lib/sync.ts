import { prisma } from './prisma';
import { listDropboxEntries, type FileArea } from './dropbox';

/** Free-plan clients see Dropbox changes only after up to this long. Backup plan = live. */
export const FREE_SYNC_MS = 24 * 60 * 60 * 1000;

type Entries = Awaited<ReturnType<typeof listDropboxEntries>>;

export type SyncInfo = {
  mode: 'live' | 'delayed';
  syncedAt: string;
  /** Only for delayed mode: when the next free-tier refresh becomes due. */
  nextSyncAt?: string;
};

/** Live Dropbox listing, saved as the customer's snapshot for this area. */
export async function refreshSnapshot(customerId: string, area: FileArea): Promise<Entries & { syncedAt: Date }> {
  const entries = await listDropboxEntries(customerId, area);
  const syncedAt = new Date();
  const newest = entries.files.reduce<string>((m, f) => (f.modified > m ? f.modified : m), '');
  const stats = {
    data: JSON.stringify(entries),
    fileCount: entries.files.length,
    folderCount: entries.folders.length,
    totalSize: entries.files.reduce((n, f) => n + (f.size || 0), 0),
    lastModified: newest ? new Date(newest) : null,
    syncedAt,
  };
  await prisma.syncSnapshot.upsert({
    where: { customerId_area: { customerId, area } },
    update: stats,
    create: { customerId, area, ...stats },
  });
  return { ...entries, syncedAt };
}

/**
 * File listing as this user is entitled to see it: live for staff and Backup-plan
 * clients, otherwise the snapshot, refreshed only once it is 24h old.
 */
export async function getEntriesFor(
  user: { role?: string; backupPlan?: boolean },
  customerId: string,
  area: FileArea
): Promise<Entries & { sync: SyncInfo }> {
  const live = user.role === 'admin' || user.role === 'it_support' || !!user.backupPlan;

  if (live) {
    // Backup listings also refresh the snapshot so the staff status tab stays current
    if (area === 'backup') {
      const { syncedAt, ...entries } = await refreshSnapshot(customerId, area);
      return { ...entries, sync: { mode: 'live', syncedAt: syncedAt.toISOString() } };
    }
    return { ...(await listDropboxEntries(customerId, area)), sync: { mode: 'live', syncedAt: new Date().toISOString() } };
  }

  let snap = await prisma.syncSnapshot.findUnique({ where: { customerId_area: { customerId, area } } });
  if (!snap || Date.now() - snap.syncedAt.getTime() >= FREE_SYNC_MS) {
    await refreshSnapshot(customerId, area);
    snap = await prisma.syncSnapshot.findUnique({ where: { customerId_area: { customerId, area } } });
  }
  const parsed: Entries = JSON.parse(snap!.data);
  return {
    ...parsed,
    sync: {
      mode: 'delayed',
      syncedAt: snap!.syncedAt.toISOString(),
      nextSyncAt: new Date(snap!.syncedAt.getTime() + FREE_SYNC_MS).toISOString(),
    },
  };
}
