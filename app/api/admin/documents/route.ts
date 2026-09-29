import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { FileArea } from '@/lib/dropbox';
import { getEntriesFor } from '@/lib/sync';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (role !== 'admin' && role !== 'it_support') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const customerId = new URL(request.url).searchParams.get('customerId');
  if (!customerId || !/^[A-Za-z0-9-]+$/.test(customerId)) {
    return NextResponse.json({ error: 'Valid customerId required' }, { status: 400 });
  }

  try {
    const area: FileArea = new URL(request.url).searchParams.get('area') === 'backup' ? 'backup' : 'documents';
    const { files, folders, sync } = await getEntriesFor({ role }, customerId, area);
    return NextResponse.json({ files, folders, sync });
  } catch (error: any) {
    const detail = error?.error?.error_summary ?? error?.message ?? 'unknown error';
    console.error('Admin documents list error:', detail);
    return NextResponse.json({ error: `Could not fetch files from Dropbox: ${detail}` }, { status: 502 });
  }
}
