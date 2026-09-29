import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getTemporaryLink, canAccessPath, canTransfer } from '@/lib/dropbox';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    if (!canTransfer(session.user as any)) {
      return NextResponse.json(
        { error: 'Downloads require the Backup plan ($25/month).', code: 'UPGRADE_REQUIRED' },
        { status: 403 }
      );
    }

    const filePath = req.nextUrl.searchParams.get('path');
    if (!filePath) {
      return NextResponse.json({ error: 'File path is required.' }, { status: 400 });
    }


    // Security: clients only reach their own folder; staff may reach any client folder
    if (!(await canAccessPath(session.user as any, filePath))) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const url = await getTemporaryLink(filePath);
    return NextResponse.json({ url }, { status: 200 });
  } catch (error: any) {
    console.error('Download link error:', error?.message ?? error);
    return NextResponse.json({ error: 'Could not generate download link.' }, { status: 500 });
  }
}
