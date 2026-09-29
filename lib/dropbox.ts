import { Dropbox, DropboxAuth } from 'dropbox';
import { DOCUMENT_CATEGORIES, type DocumentCategory } from './dropboxCategories';
import { getBackupRoot, normalizeDropboxPath } from './settings';

export { DOCUMENT_CATEGORIES };
export type { DocumentCategory };

function getDropboxClient(): Dropbox {
  const appKey     = process.env.DROPBOX_APP_KEY;
  const appSecret  = process.env.DROPBOX_APP_SECRET;
  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;
  const accessToken  = process.env.DROPBOX_ACCESS_TOKEN; // short-lived fallback

  // ── Production: refresh token (never expires) ────────────────────────────
  if (appKey && appSecret && refreshToken) {
    const auth = new DropboxAuth({ clientId: appKey, clientSecret: appSecret });
    auth.setRefreshToken(refreshToken);
    return new Dropbox({ auth });
  }

  // ── Development / testing: plain access token ────────────────────────────
  if (accessToken) {
    return new Dropbox({ accessToken });
  }

  throw new Error(
    'Dropbox is not configured. Set in .env.local:\n' +
    '  Production → DROPBOX_APP_KEY + DROPBOX_APP_SECRET + DROPBOX_REFRESH_TOKEN\n' +
    '  Testing    → DROPBOX_ACCESS_TOKEN'
  );
}

export async function uploadToDropbox(
  customerId: string,
  fileName: string,
  contents: Buffer,
  category: string = 'Other'
): Promise<string> {
  const dbx = getDropboxClient();
  const safeName = fileName.replace(/[^\w.\-]/g, '_');
  const safeCategory = DOCUMENT_CATEGORIES.includes(category as DocumentCategory) ? category : 'Other';
  const path = `/GoldenDollarConsultancy/${customerId}/${safeCategory}/${safeName}`;

  const response = await dbx.filesUpload({
    path,
    contents,
    mode: { '.tag': 'add' },
    autorename: true,
    mute: false,
  });

  return response.result.path_display ?? path;
}

export { normalizeDropboxPath };
export type FileArea = 'documents' | 'backup';

export async function areaRoot(customerId: string, area: FileArea = 'documents'): Promise<string> {
  return area === 'backup' ? `${await getBackupRoot()}/${customerId}` : customerRoot(customerId);
}

/** Upload into the customer's Backup folder (optionally a sanitized subfolder). */
export async function uploadToBackup(
  customerId: string,
  fileName: string,
  contents: Buffer,
  folder: string = ''
): Promise<string> {
  const dbx = getDropboxClient();
  const safeName = fileName.replace(/[^\w.\-]/g, '_');
  const safeFolder = folder
    .split('/')
    .map((seg) => seg.trim().replace(/[^\w.\- ]/g, '_'))
    .filter((seg) => seg && seg !== '.' && seg !== '..')
    .slice(0, 5)
    .join('/');
  const root = await areaRoot(customerId, 'backup');
  const path = `${root}/${safeFolder ? safeFolder + '/' : ''}${safeName}`;

  const response = await dbx.filesUpload({ path, contents, mode: { '.tag': 'add' }, autorename: true, mute: false });
  return response.result.path_display ?? path;
}

export async function listDropboxEntries(customerId: string, area: FileArea = 'documents') {
  const dbx = getDropboxClient();
  const path = await areaRoot(customerId, area);

  try {
    let response = await dbx.filesListFolder({ path, recursive: true, limit: 2000 });
    const entries = [...response.result.entries];
    while (response.result.has_more) {
      response = await dbx.filesListFolderContinue({ cursor: response.result.cursor });
      entries.push(...response.result.entries);
    }
    // Folder paths (relative to the area root) so empty folders still show in the tree
    const folders = entries
      .filter((e) => e['.tag'] === 'folder')
      .map((e) => (e.path_display ?? '').slice(path.length).replace(/^\/+/, ''))
      .filter(Boolean);
    const files = entries
      .filter((e) => e['.tag'] === 'file')
      .map((e) => {
        const fullPath = e.path_display ?? '';
        // Path shape: /GoldenDollarConsultancy/{customerId}/{category}/{filename}
        // Path relative to the area root, used to draw the folder tree
        const relPath = fullPath.slice(path.length).replace(/^\/+/, '') || e.name;
        const relSegments = relPath.split('/');
        const category = relSegments.length > 1 ? relSegments[0] : area === 'backup' ? 'Backup' : 'Other';
        return {
          name: e.name,
          path: fullPath,
          relPath,
          size: (e as any).size ?? 0,
          modified: (e as any).server_modified ?? '',
          category,
        };
      });
    return { files, folders };
  } catch (error: any) {
    const summary: string = error?.error?.error_summary ?? '';
    if (summary.startsWith('path/not_found')) return { files: [], folders: [] };
    throw error;
  }
}

/** Sub-folders directly under `path` ('' = Dropbox root). Admin folder picker only. */
export async function listDropboxSubfolders(path: string): Promise<{ name: string; path: string }[]> {
  const dbx = getDropboxClient();
  let response = await dbx.filesListFolder({ path: path === '/' ? '' : path, limit: 2000 });
  const entries = [...response.result.entries];
  while (response.result.has_more) {
    response = await dbx.filesListFolderContinue({ cursor: response.result.cursor });
    entries.push(...response.result.entries);
  }
  return entries
    .filter((e) => e['.tag'] === 'folder')
    .map((e) => ({ name: e.name, path: e.path_display ?? '' }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Whether `path` exists in Dropbox and is a folder. */
export async function isDropboxFolder(path: string): Promise<boolean> {
  const dbx = getDropboxClient();
  try {
    const meta = await dbx.filesGetMetadata({ path });
    return meta.result['.tag'] === 'folder';
  } catch {
    return false;
  }
}

/** Root Dropbox folder for a customer. All user-facing file access must stay inside it. */
export function customerRoot(customerId: string): string {
  return `/GoldenDollarConsultancy/${customerId}`;
}

/**
 * Clients reach their own documents folder, and their own backup folder only
 * with an active Backup plan. Admin / IT support reach any customer's folders.
 * Both reject `..` traversal.
 */
export async function canAccessPath(
  user: { role?: string; customerId?: string; backupPlan?: boolean },
  filePath: string
): Promise<boolean> {
  if (filePath.split('/').includes('..')) return false;
  const lower = filePath.toLowerCase();
  if (user.role === 'admin' || user.role === 'it_support') {
    return lower.startsWith('/goldendollarconsultancy/') || lower.startsWith(`${(await getBackupRoot()).toLowerCase()}/`);
  }
  const id = user.customerId ?? '';
  if (!id) return false;
  if (lower.startsWith(`${customerRoot(id).toLowerCase()}/`)) return true;
  return !!user.backupPlan && lower.startsWith(`${(await areaRoot(id, 'backup')).toLowerCase()}/`);
}

/** Clients need the Backup plan to upload or download; staff never do. */
export function canTransfer(user: { role?: string; backupPlan?: boolean }): boolean {
  return user.role === 'admin' || user.role === 'it_support' || !!user.backupPlan;
}

export async function downloadDropboxFile(filePath: string): Promise<Buffer> {
  const dbx = getDropboxClient();
  const response = await dbx.filesDownload({ path: filePath });
  return (response.result as any).fileBinary as Buffer;
}

export async function getTemporaryLink(filePath: string): Promise<string> {
  const dbx = getDropboxClient();
  const response = await dbx.filesGetTemporaryLink({ path: filePath });
  return response.result.link;
}

/**
 * Returns a shareable Dropbox link to a customer's whole document folder, so
 * staff can open it directly in Dropbox (browsing, bulk download, etc.)
 * instead of only using the in-app file list. Reuses an existing shared link
 * if one was already created, since Dropbox errors on creating a duplicate.
 */
export async function getOrCreateFolderShareLink(customerId: string): Promise<string> {
  const dbx = getDropboxClient();
  const path = `/GoldenDollarConsultancy/${customerId}`;

  try {
    const created = await dbx.sharingCreateSharedLinkWithSettings({ path });
    return created.result.url;
  } catch (error: any) {
    const summary: string = error?.error?.error_summary ?? '';
    if (summary.startsWith('shared_link_already_exists')) {
      const existing = await dbx.sharingListSharedLinks({ path, direct_only: true });
      if (existing.result.links.length > 0) return existing.result.links[0].url;
    }
    throw error;
  }
}

export type DropboxHealth = {
  credentials: 'refresh_token' | 'access_token' | 'missing';
  /** Env vars still needed when credentials are missing/partial. Names only, never values. */
  missingEnv: string[];
  connected: boolean;
  account?: { name: string; email: string };
  documentsRoot: { path: string; exists: boolean };
  backupRoot: { path: string; exists: boolean };
  error?: string;
  checkedAt: string;
};

/** Read-only connectivity check: credentials, live API call, and both root folders. */
export async function checkDropboxHealth(): Promise<DropboxHealth> {
  const backupPath = await getBackupRoot();
  const health: DropboxHealth = {
    credentials: 'missing',
    missingEnv: [],
    connected: false,
    documentsRoot: { path: '/GoldenDollarConsultancy', exists: false },
    backupRoot: { path: backupPath, exists: false },
    checkedAt: new Date().toISOString(),
  };

  const { DROPBOX_APP_KEY: key, DROPBOX_APP_SECRET: secret, DROPBOX_REFRESH_TOKEN: refresh, DROPBOX_ACCESS_TOKEN: access } = process.env;
  if (key && secret && refresh) health.credentials = 'refresh_token';
  else if (access) health.credentials = 'access_token';
  else {
    health.missingEnv = ['DROPBOX_APP_KEY', 'DROPBOX_APP_SECRET', 'DROPBOX_REFRESH_TOKEN'].filter((k) => !process.env[k]);
    health.error = 'Dropbox credentials are not set on the server.';
    return health;
  }

  try {
    const dbx = getDropboxClient();
    const acct = await dbx.usersGetCurrentAccount();
    health.connected = true;
    health.account = { name: acct.result.name.display_name, email: acct.result.email };
    health.documentsRoot.exists = await isDropboxFolder(health.documentsRoot.path);
    health.backupRoot.exists = await isDropboxFolder(backupPath);
  } catch (error: any) {
    const summary: string = error?.error?.error_summary ?? error?.error?.error_description ?? error?.message ?? 'Unknown error';
    health.error = /expired_access_token|invalid_access_token|invalid_grant/.test(summary)
      ? `Dropbox rejected the token (${summary}). Regenerate the refresh token with scripts/getDropboxToken.cjs.`
      : `Dropbox request failed: ${summary}`;
  }
  return health;
}
