import { prisma } from './prisma';

const BACKUP_ROOT_KEY = 'backupRoot';

export function normalizeDropboxPath(raw: string): string {
  return '/' + raw.trim().replace(/^\/+|\/+$/g, '');
}

/** Backup root chosen by an admin (DB), else DROPBOX_BACKUP_ROOT, else /GDC-Backups. */
export async function getBackupRoot(): Promise<string> {
  try {
    const row = await prisma.appSetting.findUnique({ where: { key: BACKUP_ROOT_KEY } });
    if (row?.value) return normalizeDropboxPath(row.value);
  } catch (err) {
    console.error('Could not read backupRoot setting:', err);
  }
  return normalizeDropboxPath(process.env.DROPBOX_BACKUP_ROOT || '/GDC-Backups');
}

export async function setBackupRoot(path: string): Promise<void> {
  await prisma.appSetting.upsert({
    where: { key: BACKUP_ROOT_KEY },
    update: { value: path },
    create: { key: BACKUP_ROOT_KEY, value: path },
  });
}
