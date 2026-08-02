import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const genericResponse = NextResponse.json({
      success: true,
      message: 'If an account exists for that email, a reset link has been sent.',
    });

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Never reveal whether the account exists
    if (!user) return genericResponse;

    // Throttle: if a token was created in the last minute, don't send another
    const recent = await prisma.passwordResetToken.findFirst({
      where: { userId: user.id, createdAt: { gt: new Date(Date.now() - 60 * 1000) } },
    });
    if (recent) return genericResponse;

    // Invalidate any previous tokens, then issue a fresh one
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const rawToken = crypto.randomBytes(32).toString('hex');
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: crypto.createHash('sha256').update(rawToken).digest('hex'),
        expires: new Date(Date.now() + TOKEN_TTL_MS),
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || req.nextUrl.origin;
    const resetUrl = `${baseUrl}/portal/reset-password?token=${rawToken}`;

    await sendPasswordResetEmail({ name: user.name, email: user.email, resetUrl });

    return genericResponse;
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error. Please try again.' }, { status: 500 });
  }
}
