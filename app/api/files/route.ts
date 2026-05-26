import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { listDropboxFiles } from '@/lib/dropbox';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const customerId = (session.user as any).customerId as string;
    const files = await listDropboxFiles(customerId);

    return NextResponse.json({ files }, { status: 200 });
  } catch (error: any) {
    console.error('Files list error:', error?.message ?? error);
    return NextResponse.json(
      { error: 'Could not retrieve files. Please try again.' },
      { status: 500 }
    );
  }
}
