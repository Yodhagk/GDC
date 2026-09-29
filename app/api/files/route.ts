import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import type { FileArea } from '@/lib/dropbox';
import { getEntriesFor } from '@/lib/sync';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const user = session.user as any;
    const area: FileArea = req.nextUrl.searchParams.get('area') === 'backup' ? 'backup' : 'documents';
    if (area === 'backup' && !user.backupPlan) {
      return NextResponse.json(
        { error: 'Upgrade to the Backup plan to use backup folders.', code: 'UPGRADE_REQUIRED' },
        { status: 403 }
      );
    }

    const { files, folders, sync } = await getEntriesFor(user, user.customerId as string, area);

    return NextResponse.json({ files, folders, sync }, { status: 200 });
  } catch (error: any) {
    console.error('Files list error:', error?.message ?? error);
    return NextResponse.json(
      { error: 'Could not retrieve files. Please try again.' },
      { status: 500 }
    );
  }
}
