import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listDropboxFiles } from '@/lib/dropbox';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (role !== 'admin' && role !== 'it_support') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const customerId = new URL(request.url).searchParams.get('customerId');
  if (!customerId) return NextResponse.json({ error: 'customerId required' }, { status: 400 });

  try {
    const files = await listDropboxFiles(customerId);
    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ files: [], error: 'Could not fetch files from Dropbox' });
  }
}
