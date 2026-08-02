import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashVerificationToken } from '@/lib/verifyEmail';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing verification token.' }, { status: 400 });
    }

    const tokenHash = hashVerificationToken(token);
    const user = await prisma.user.findFirst({ where: { verifyEmailToken: tokenHash } });

    if (!user || !user.verifyEmailTokenExpires || user.verifyEmailTokenExpires < new Date()) {
      return NextResponse.json(
        { error: 'This verification link is invalid or has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({ success: true, message: 'Email already verified.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verifyEmailToken: null,
        verifyEmailTokenExpires: null,
      },
    });

    return NextResponse.json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json({ error: 'Internal server error. Please try again.' }, { status: 500 });
  }
}
