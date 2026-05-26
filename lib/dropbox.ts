import { Dropbox } from 'dropbox';

function getDropboxClient(): Dropbox {
  const accessToken = process.env.DROPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('DROPBOX_ACCESS_TOKEN environment variable is not set.');
  }
  return new Dropbox({ accessToken, fetch });
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
