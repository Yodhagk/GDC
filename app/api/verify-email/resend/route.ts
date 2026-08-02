import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { issueVerificationEmail } from '@/lib/verifyEmail';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const genericResponse = NextResponse.json({
      success: true,
      message: 'If an unverified account exists for that email, a new verification link has been sent.',
    });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    // Never reveal whether the account exists, and don't leak already-verified status
    if (!user || user.emailVerified) return genericResponse;

    const baseUrl = process.env.NEXTAUTH_URL || req.nextUrl.origin;
    await issueVerificationEmail(user, baseUrl);

    return genericResponse;
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ error: 'Internal server error. Please try again.' }, { status: 500 });
  }
}
