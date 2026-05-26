import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { uploadToDropbox } from '@/lib/dropbox';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/utils';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const customerId = (session.user as any).customerId as string;
    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID not found.' }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'File is empty.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum allowed size is 10 MB.` },
        { status: 413 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Upload PDF, Excel, Word, or image files only.' },
        { status: 415 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = await uploadToDropbox(customerId, file.name, buffer);

    return NextResponse.json({ success: true, path }, { status: 200 });
  } catch (error: any) {
    console.error('Upload error:', error?.message ?? error);
    return NextResponse.json(
      { error: 'Upload failed. Please check your Dropbox configuration and try again.' },
      { status: 500 }
    );
  }
}
