import { Dropbox, DropboxAuth } from 'dropbox';

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
  contents: Buffer
): Promise<string> {
  const dbx = getDropboxClient();
  const safeName = fileName.replace(/[^\w.\-]/g, '_');
  const path = `/GoldenDollarConsultancy/${customerId}/${safeName}`;

  const response = await dbx.filesUpload({
    path,
    contents,
    mode: { '.tag': 'add' },
    autorename: true,
    mute: false,
  });

  return response.result.path_display ?? path;
}

export async function listDropboxFiles(customerId: string) {
  const dbx = getDropboxClient();
  const path = `/GoldenDollarConsultancy/${customerId}`;

  try {
    const response = await dbx.filesListFolder({ path });
    return response.result.entries
      .filter((e) => e['.tag'] === 'file')
      .map((e) => ({
        name: e.name,
        path: e.path_display ?? '',
        size: (e as any).size ?? 0,
        modified: (e as any).server_modified ?? '',
      }));
  } catch (error: any) {
    const summary: string = error?.error?.error_summary ?? '';
    if (summary.startsWith('path/not_found')) return [];
    throw error;
  }
}

export async function getTemporaryLink(filePath: string): Promise<string> {
  const dbx = getDropboxClient();
  const response = await dbx.filesGetTemporaryLink({ path: filePath });
  return response.result.link;
}
