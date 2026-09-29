import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { downloadDropboxFile, canAccessPath } from '@/lib/dropbox';

export const runtime = 'nodejs';

// Only types browsers can render safely inline. Anything else is not previewable.
const PREVIEW_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  txt: 'text/plain; charset=utf-8',
  csv: 'text/plain; charset=utf-8',
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const filePath = req.nextUrl.searchParams.get('path');
    if (!filePath) {
      return NextResponse.json({ error: 'File path is required.' }, { status: 400 });
    }

    if (!(await canAccessPath(session.user as any, filePath))) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
    const contentType = PREVIEW_TYPES[ext];
    if (!contentType) {
      return NextResponse.json({ error: 'Preview not available for this file type.' }, { status: 415 });
    }

    const body = await downloadDropboxFile(filePath);
    return new NextResponse(new Uint8Array(body), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline',
        'Cache-Control': 'private, max-age=300',
        // Sandbox everything except PDFs (the sandbox disables Chrome's PDF viewer)
        ...(ext !== 'pdf' && { 'Content-Security-Policy': "sandbox; default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'" }),
      },
    });
  } catch (error: any) {
    console.error('Preview error:', error?.message ?? error);
    return NextResponse.json({ error: 'Could not load preview.' }, { status: 500 });
  }
}
