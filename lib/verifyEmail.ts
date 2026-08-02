import { prisma } from './prisma';
import { sendVerificationEmail } from './email';
import crypto from 'crypto';

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESEND_COOLDOWN_MS = 60 * 1000; // min gap between emailed links

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Issues a fresh verification token for the user and emails it, unless one
 * was already issued within the cooldown window (silent no-op then, so
 * repeated calls — e.g. resend clicks — can't be used to spam the inbox).
 */
export async function issueVerificationEmail(user: {
  id: string;
  name: string;
  email: string;
  verifyEmailIssuedAt: Date | null;
  verifyEmailTokenExpires: Date | null;
}, baseUrl: string) {
  const now = new Date();
  const recentlyIssued =
    user.verifyEmailIssuedAt &&
    now.getTime() - user.verifyEmailIssuedAt.getTime() < RESEND_COOLDOWN_MS &&
    user.verifyEmailTokenExpires &&
    user.verifyEmailTokenExpires > now;

  if (recentlyIssued) return;

  const rawToken = crypto.randomBytes(32).toString('hex');
  await prisma.user.update({
    where: { id: user.id },
    data: {
      verifyEmailToken: hashToken(rawToken),
      verifyEmailTokenExpires: new Date(now.getTime() + TOKEN_TTL_MS),
      verifyEmailIssuedAt: now,
    },
  });

  const verifyUrl = `${baseUrl}/portal/verify-email?token=${rawToken}`;
  await sendVerificationEmail({ name: user.name, email: user.email, verifyUrl });
}

export function hashVerificationToken(token: string): string {
  return hashToken(token);
}
