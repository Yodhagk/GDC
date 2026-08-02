import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getOrCreateFolderShareLink } from '@/lib/dropbox';

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
    const url = await getOrCreateFolderShareLink(customerId);
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Dropbox share link error:', error?.message ?? error);
    return NextResponse.json({ error: 'Could not create Dropbox link' }, { status: 500 });
  }
}
