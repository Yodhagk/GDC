import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkDropboxHealth } from '@/lib/dropbox';

export const runtime = 'nodejs';

// Staff-only live Dropbox connectivity check (replaces a hardcoded "Operational" label)
export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (role !== 'admin' && role !== 'it_support') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  return NextResponse.json({ health: await checkDropboxHealth() });
}
