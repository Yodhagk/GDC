import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getBackupRoot, setBackupRoot, normalizeDropboxPath } from '@/lib/settings';
import { listDropboxSubfolders, isDropboxFolder } from '@/lib/dropbox';

export const runtime = 'nodejs';

const DOCS_ROOT = '/goldendollarconsultancy';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.role === 'admin';
}

// GET            -> current backup root
// GET ?browse=/x -> sub-folders of a Dropbox path ('/' = Dropbox root), for the picker
export async function GET(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const browse = request.nextUrl.searchParams.get('browse');
  if (browse === null) return NextResponse.json({ root: await getBackupRoot() });

  if (browse.split('/').includes('..')) return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  try {
    const path = browse === '' || browse === '/' ? '/' : normalizeDropboxPath(browse);
    return NextResponse.json({ path, folders: await listDropboxSubfolders(path) });
  } catch (error: any) {
    console.error('Dropbox browse error:', error?.message ?? error);
    return NextResponse.json({ error: 'Could not list Dropbox folders' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { path } = await request.json().catch(() => ({}));
  if (typeof path !== 'string' || !path.trim() || path.split('/').includes('..')) {
    return NextResponse.json({ error: 'A folder path is required' }, { status: 400 });
  }
  const root = normalizeDropboxPath(path);
  const lower = root.toLowerCase();

  // Backups must not overlap the customer documents area (or be the whole Dropbox)
  if (root === '/' || lower === DOCS_ROOT || lower.startsWith(`${DOCS_ROOT}/`) || DOCS_ROOT.startsWith(`${lower}/`)) {
    return NextResponse.json(
      { error: 'Choose a folder separate from /GoldenDollarConsultancy (and not the Dropbox root).' },
      { status: 400 }
    );
  }
  if (!(await isDropboxFolder(root))) {
    return NextResponse.json({ error: 'That folder does not exist in Dropbox.' }, { status: 404 });
  }

  await setBackupRoot(root);
  return NextResponse.json({ root });
}
